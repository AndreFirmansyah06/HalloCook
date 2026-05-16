import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { authService } from "./server/services/authService";
import { recipeService } from "./server/services/recipeService";
import { userService } from "./server/services/userService";
import { supabase } from "./server/lib/supabase";

dotenv.config();

// Safely handle __dirname and __filename for both ESM and CJS
let _filename = "";
let _dirname = "";

try {
  // @ts-ignore
  _filename = typeof __filename !== "undefined" ? __filename : fileURLToPath(import.meta.url);
  // @ts-ignore
  _dirname = typeof __dirname !== "undefined" ? __dirname : path.dirname(_filename);
} catch (e) {
  // Fallback for environments where import.meta.url might be missing (like some CJS bundles)
  _dirname = process.cwd();
}

const app = express();
app.use(express.json());

const PORT = 3000;

// --- AUTH API ---
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    vercel: !!process.env.VERCEL,
    supabase: !!supabase 
  });
});

app.post("/api/auth/signup", async (req, res) => {
  try {
    if (!supabase) throw new Error("Database connection not initialized. Please check Vercel environment variables.");
    const data = await authService.signup(req.body);
    res.json({ message: "Account created successfully", user: { id: data.id, username: data.username, email: data.email, role: data.role } });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    if (!supabase && req.body.email !== "admin") {
       throw new Error("Database connection not initialized. Please check Vercel environment variables.");
    }
    const { email, password } = req.body;
    const user = await authService.login(email, password);
    res.json({ user, message: "Login successful" });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

// --- RECIPES API ---
app.get("/api/recipes", async (req, res) => {
  try {
    if (!supabase) throw new Error("Database connection not initialized.");
    const data = await recipeService.getAll();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/recipes/:id", async (req, res) => {
  try {
    const data = await recipeService.getById(req.params.id);
    res.json(data);
  } catch (error: any) {
    res.status(404).json({ error: "Recipe not found" });
  }
});

// Admin-only Recipe CRUD
app.post("/api/admin/recipes", async (req, res) => {
  try {
    const data = await recipeService.create(req.body);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/admin/recipes/:id", async (req, res) => {
  try {
    const data = await recipeService.update(req.params.id, req.body);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/admin/recipes/:id", async (req, res) => {
  try {
    await recipeService.delete(req.params.id);
    res.json({ message: "Recipe deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- ADMIN MANAGEMENT API ---
app.get("/api/admin/admins", async (req, res) => {
  try {
    const data = await userService.getAllAdmins();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/admin/admins", async (req, res) => {
  try {
    const data = await userService.createAdmin(req.body);
    res.json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/api/admin/admins/:id", async (req, res) => {
  try {
    const data = await userService.updateAdmin(req.params.id, req.body);
    res.json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/api/admin/admins/:id", async (req, res) => {
  try {
    await userService.deleteAdmin(req.params.id);
    res.json({ message: "Admin deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- USER FEATURES (Keeping them for now but restricted in frontend) ---
app.post("/api/favorites", async (req, res) => {
  const { userId, recipeId } = req.body;
  try {
    const { data: existing } = await supabase.from("favorites").select("*").eq("user_id", userId).eq("recipe_id", recipeId).single();
    if (existing) {
      await supabase.from("favorites").delete().eq("id", existing.id);
      return res.json({ message: "Removed from favorites", active: false });
    } else {
      await supabase.from("favorites").insert([{ user_id: userId, recipe_id: recipeId }]);
      return res.json({ message: "Added to favorites", active: true });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/favorites/:userId", async (req, res) => {
  try {
    const { data, error } = await supabase.from("favorites").select("recipe_id, recipes(*)").eq("user_id", req.params.userId);
    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/shopping-list/:userId", async (req, res) => {
  try {
    const { data, error } = await supabase.from("shopping_list").select("*, recipes(title)").eq("user_id", req.params.userId);
    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/shopping-list", async (req, res) => {
  const { userId, recipeId } = req.body;
  try {
    await supabase.from("shopping_list").insert([{ user_id: userId, recipe_id: recipeId }]);
    res.json({ message: "Added to shopping list" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- VITE MIDDLEWARE ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Note: use _dirname (safe fallback) instead of __dirname
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      // In Vercel or production, fall back to index.html
      const indexPath = path.join(distPath, "index.html");
      res.sendFile(indexPath);
    });
  }

  const host = "0.0.0.0";
  app.listen(PORT, host, () => {
    console.log(`HalloCook Server running on http://${host}:${PORT}`);
  });
}

// Export app for Vercel serverless functions
export default app;

// Only start the listening server if we are NOT on Vercel
const isVercel = process.env.VERCEL === "1" || !!process.env.VITE_VERCEL_ENV;

if (!isVercel) {
  startServer();
} else {
  // In Vercel serverless functions, we don't call .listen()
  // But we might still need to handle Vite middleware if in a preview environment
  if (process.env.NODE_ENV !== "production") {
    startServer();
  }
}
