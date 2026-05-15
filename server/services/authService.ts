import { supabase } from "../lib/supabase";
import bcrypt from "bcryptjs";

const adminEmails = ["admin@hallocook.com", "indomieseleramu1@gmail.com"];

export const authService = {
  async signup(userData: any) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    // Check existing
    const { data: existing } = await supabase.from("users").select("id").eq("email", userData.email).single();
    if (existing) throw new Error("Email already registered");

    const { data, error } = await supabase
      .from("users")
      .insert([{ 
        username: userData.username, 
        email: userData.email, 
        password: hashedPassword,
        role: adminEmails.includes(userData.email) ? "admin" : "user"
      }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async login(email: string, password: string) {
    // Special hardcoded admin for initial setup
    if (email === "admin" && password === "123") {
      return { id: "admin", username: "System Admin", email: "admin@hallocook.com", role: "admin" };
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) throw new Error("Invalid credentials");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error("Invalid credentials");

    const role = adminEmails.includes(user.email) ? "admin" : (user.role || "user");

    return { id: user.id, username: user.username, email: user.email, role };
  }
};
