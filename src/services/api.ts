import { Recipe, User } from '../types';

// Helper to manage LocalStorage
const STORAGE_KEYS = {
  RECIPES: 'hallocook_recipes',
  USERS: 'hallocook_users',
  FAVORITES: 'hallocook_favorites',
  SHOPPING_LIST: 'hallocook_shopping_list',
  COOKING_SESSIONS: 'hallocook_cooking_sessions'
};

const getFromStorage = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

const saveToStorage = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Initial Dummy Data
const INITIAL_RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'Soto Ayam Lamongan',
    description: 'Soto khas Lamongan dengan koya yang gurih dan nikmat.',
    image_url: 'https://images.unsplash.com/photo-1547928576-965ce9074ee5?q=80&w=2070&auto=format&fit=crop',
    difficulty: 'Medium',
    category: 'Local',
    chef_name: 'HalloCook Chef',
    duration: '45 mins',
    servings: 4,
    calories: 320,
    ingredients: ['1/2 chicken', 'Turmeric', 'Galangal', 'Lemongrass', 'Garlic', 'Shallots', 'Koya powder'],
    steps: ['Boil the chicken with spices', 'Shred the chicken', 'Prepare the broth', 'Service with koya'],
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Nasi Goreng Spesial',
    description: 'Nasi goreng dengan bumbu rahasia dan topping melimpah.',
    image_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=1925&auto=format&fit=crop',
    difficulty: 'Easy',
    category: 'Local',
    chef_name: 'Chef Juna',
    duration: '20 mins',
    servings: 2,
    calories: 450,
    ingredients: ['Rice', 'Egg', 'Chicken', 'Leek', 'Kecap Manis', 'Chili'],
    steps: ['Sauté spices', 'Add chicken and eggs', 'Add rice and sauces', 'Mix well and serve'],
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Rendang Daging Sapi',
    description: 'Masakan legendaris Indonesia yang sudah mendunia.',
    image_url: 'https://images.unsplash.com/photo-1606491956689-2ea8c5119c85?q=80&w=2042&auto=format&fit=crop',
    difficulty: 'Hard',
    category: 'Local',
    chef_name: 'H. Syahrandi',
    duration: '180 mins',
    servings: 6,
    calories: 550,
    ingredients: ['Beef', 'Coconut milk', 'Rendang spices', 'Lime leaves', 'Lemongrass'],
    steps: ['Sauté the spices', 'Add beef and coconut milk', 'Cook on low heat until dry and dark browser'],
    created_at: new Date().toISOString()
  }
];

const INITIAL_USERS = [
  { id: 'admin-1', username: 'admin@email.com', email: 'admin@email.com', password: '123', role: 'admin' },
  { id: 'user-1', username: 'andre@email.com', email: 'andre@email.com', password: '123', role: 'user' }
];

// Initialize storage and ensure demo users have correct credentials
let users = getFromStorage<any[]>(STORAGE_KEYS.USERS, []);

let changed = false;
INITIAL_USERS.forEach(initialUser => {
  const existingIndex = users.findIndex(u => u.email === initialUser.email);
  if (existingIndex === -1) {
    users.push(initialUser);
    changed = true;
  } else if (users[existingIndex].password !== initialUser.password) {
    // Force update password if it's the old one
    users[existingIndex] = { ...users[existingIndex], ...initialUser };
    changed = true;
  }
});

if (changed) {
  saveToStorage(STORAGE_KEYS.USERS, users);
}

if (!localStorage.getItem(STORAGE_KEYS.RECIPES)) {
  saveToStorage(STORAGE_KEYS.RECIPES, INITIAL_RECIPES);
}

export const api = {
  // Auth
  async login(credentials: any) {
    const users = getFromStorage<any[]>(STORAGE_KEYS.USERS, []);
    const user = users.find(u => (u.email === credentials.email || u.username === credentials.email) && u.password === credentials.password);
    
    if (!user) throw new Error('Invalid email/username or password');
    
    // Return user without password
    const { password, ...safeUser } = user;
    return { user: safeUser, message: 'Login successful' };
  },

  async signup(userData: any) {
    const users = getFromStorage<any[]>(STORAGE_KEYS.USERS, []);
    if (users.some(u => u.email === userData.email || u.username === userData.username)) {
      throw new Error('User already exists');
    }
    const newUser = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      role: userData.role || 'user',
      created_at: new Date().toISOString()
    };
    users.push(newUser);
    saveToStorage(STORAGE_KEYS.USERS, users);
    const { password, ...safeUser } = newUser;
    return { ...safeUser, message: 'Account created successfully' };
  },

  // Recipes
  async getRecipes(): Promise<Recipe[]> {
    return getFromStorage<Recipe[]>(STORAGE_KEYS.RECIPES, []);
  },

  async getRecipeById(id: string): Promise<Recipe> {
    const recipes = await this.getRecipes();
    const recipe = recipes.find(r => r.id === id);
    if (!recipe) throw new Error('Recipe not found');
    return recipe;
  },

  // Admin Recipe CRUD
  async createRecipe(recipe: Partial<Recipe>) {
    const recipes = await this.getRecipes();
    const newRecipe = {
      ...recipe,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString()
    } as Recipe;
    recipes.push(newRecipe);
    saveToStorage(STORAGE_KEYS.RECIPES, recipes);
    return newRecipe;
  },

  async updateRecipe(id: string, recipeData: Partial<Recipe>) {
    const recipes = await this.getRecipes();
    const index = recipes.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Recipe not found');
    
    recipes[index] = { ...recipes[index], ...recipeData };
    saveToStorage(STORAGE_KEYS.RECIPES, recipes);
    return recipes[index];
  },

  async deleteRecipe(id: string) {
    const recipes = await this.getRecipes();
    const filtered = recipes.filter(r => r.id !== id);
    saveToStorage(STORAGE_KEYS.RECIPES, filtered);
    return { message: 'Recipe deleted' };
  },

  // Admin Management (Users)
  async getAdmins() {
    const users = getFromStorage<any[]>(STORAGE_KEYS.USERS, []);
    return users.filter(u => u.role === 'admin');
  },

  async createAdmin(adminData: any) {
    return this.signup({ ...adminData, role: 'admin' });
  },

  async updateAdmin(id: string, adminData: any) {
    const users = getFromStorage<any[]>(STORAGE_KEYS.USERS, []);
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('Admin not found');
    users[index] = { ...users[index], ...adminData };
    saveToStorage(STORAGE_KEYS.USERS, users);
    return users[index];
  },

  async deleteAdmin(id: string) {
    const users = getFromStorage<any[]>(STORAGE_KEYS.USERS, []);
    const filtered = users.filter(u => u.id !== id);
    saveToStorage(STORAGE_KEYS.USERS, filtered);
    return { message: 'Admin deleted' };
  },

  // Favorites
  async getFavorites(userId: string): Promise<any[]> {
    const favorites = getFromStorage<any[]>(STORAGE_KEYS.FAVORITES, []);
    const userFavorites = favorites.filter(f => f.userId === userId);
    const recipes = await this.getRecipes();

    // Join recipe data to match the expected format { recipe_id, recipes: { ... } }
    return userFavorites.map(f => ({
      recipe_id: f.recipeId,
      recipes: recipes.find(r => r.id === f.recipeId)
    }));
  },

  async toggleFavorite(userId: string, recipeId: string) {
    const favorites = getFromStorage<any[]>(STORAGE_KEYS.FAVORITES, []);
    const index = favorites.findIndex(f => f.userId === userId && f.recipeId === recipeId);
    
    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push({ userId, recipeId });
    }
    
    saveToStorage(STORAGE_KEYS.FAVORITES, favorites);
    return { 
      message: index > -1 ? 'Removed from favorites' : 'Added to favorites',
      active: index === -1 // If it was -1, it's now added (active: true)
    };
  },

  // Shopping List
  async getShoppingList(userId: string): Promise<any[]> {
    const shoppingList = getFromStorage<any[]>(STORAGE_KEYS.SHOPPING_LIST, []);
    const userList = shoppingList.filter(s => s.userId === userId);
    const recipes = await this.getRecipes();

    // Join recipe data to match the expected format { recipe_id, recipes: { ... } }
    return userList.map(s => ({
      ...s,
      recipe_id: s.recipeId,
      recipes: recipes.find(r => r.id === s.recipeId)
    }));
  },

  async addToShoppingList(userId: string, recipeId: string) {
    const shoppingList = getFromStorage<any[]>(STORAGE_KEYS.SHOPPING_LIST, []);
    if (!shoppingList.some(s => s.userId === userId && s.recipeId === recipeId)) {
      shoppingList.push({ 
        id: Math.random().toString(36).substr(2, 9),
        userId, 
        recipeId,
        checked_ingredients: [] 
      });
      saveToStorage(STORAGE_KEYS.SHOPPING_LIST, shoppingList);
    }
    return { message: 'Added to shopping list' };
  },

  async updateShoppingListItem(id: string, data: any) {
    const shoppingList = getFromStorage<any[]>(STORAGE_KEYS.SHOPPING_LIST, []);
    const index = shoppingList.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Item not found');
    
    shoppingList[index] = { ...shoppingList[index], ...data };
    saveToStorage(STORAGE_KEYS.SHOPPING_LIST, shoppingList);
    return shoppingList[index];
  },

  async deleteFromShoppingList(id: string) {
    const shoppingList = getFromStorage<any[]>(STORAGE_KEYS.SHOPPING_LIST, []);
    const filtered = shoppingList.filter(s => s.id !== id);
    saveToStorage(STORAGE_KEYS.SHOPPING_LIST, filtered);
    return { message: 'Item removed' };
  },

  // Cooking Sessions (Active Kitchen)
  async getCookingSessions(userId: string): Promise<any[]> {
    const sessions = getFromStorage<any[]>(STORAGE_KEYS.COOKING_SESSIONS, []);
    const userSessions = sessions.filter(s => s.userId === userId);
    const recipes = await this.getRecipes();

    return userSessions.map(s => ({
      ...s,
      recipe: recipes.find(r => r.id === s.recipeId)
    }));
  },

  async startCooking(userId: string, recipeId: string) {
    const sessions = getFromStorage<any[]>(STORAGE_KEYS.COOKING_SESSIONS, []);
    let session = sessions.find(s => s.userId === userId && s.recipeId === recipeId);
    
    if (!session) {
      session = {
        id: Math.random().toString(36).substr(2, 9),
        userId,
        recipeId,
        completed_steps: [],
        progress: 0,
        updated_at: new Date().toISOString()
      };
      sessions.push(session);
      saveToStorage(STORAGE_KEYS.COOKING_SESSIONS, sessions);
    }
    
    return session;
  },

  async updateCookingProgress(sessionId: string, completed_steps: number[], progress: number) {
    const sessions = getFromStorage<any[]>(STORAGE_KEYS.COOKING_SESSIONS, []);
    const index = sessions.findIndex(s => s.id === sessionId);
    if (index === -1) throw new Error('Session not found');
    
    sessions[index] = { 
      ...sessions[index], 
      completed_steps, 
      progress, 
      updated_at: new Date().toISOString() 
    };
    saveToStorage(STORAGE_KEYS.COOKING_SESSIONS, sessions);
    return sessions[index];
  },

  async resetCookingSession(sessionId: string) {
    const sessions = getFromStorage<any[]>(STORAGE_KEYS.COOKING_SESSIONS, []);
    const index = sessions.findIndex(s => s.id === sessionId);
    if (index === -1) throw new Error('Session not found');
    
    sessions[index] = { 
      ...sessions[index], 
      completed_steps: [], 
      progress: 0, 
      updated_at: new Date().toISOString() 
    };
    saveToStorage(STORAGE_KEYS.COOKING_SESSIONS, sessions);
    return sessions[index];
  }
};
