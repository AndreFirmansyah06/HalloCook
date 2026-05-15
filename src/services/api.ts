import { Recipe, User } from '../types';

export const api = {
  // Auth
  async login(credentials: any) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },

  async signup(userData: any) {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },

  // Recipes
  async getRecipes(): Promise<Recipe[]> {
    const res = await fetch('/api/recipes');
    return res.json();
  },

  async getRecipeById(id: string): Promise<Recipe> {
    const res = await fetch(`/api/recipes/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },

  // Admin Recipe CRUD
  async createRecipe(recipe: Partial<Recipe>) {
    const res = await fetch('/api/admin/recipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipe),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create recipe');
    return data;
  },

  async updateRecipe(id: string, recipe: Partial<Recipe>) {
    const res = await fetch(`/api/admin/recipes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipe),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update recipe');
    return data;
  },

  async deleteRecipe(id: string) {
    const res = await fetch(`/api/admin/recipes/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete recipe');
    return data;
  },

  // Admin Management
  async getAdmins() {
    const res = await fetch('/api/admin/admins');
    return res.json();
  },

  async createAdmin(adminData: any) {
    const res = await fetch('/api/admin/admins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adminData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },

  async updateAdmin(id: string, adminData: any) {
    const res = await fetch(`/api/admin/admins/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adminData),
    });
    return res.json();
  },

  async deleteAdmin(id: string) {
    const res = await fetch(`/api/admin/admins/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  // Favorites
  async getFavorites(userId: string): Promise<any[]> {
    const res = await fetch(`/api/favorites/${userId}`);
    return res.json();
  },

  async toggleFavorite(userId: string, recipeId: string) {
    const res = await fetch('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, recipeId }),
    });
    return res.json();
  },

  // Shopping List
  async getShoppingList(userId: string): Promise<any[]> {
    const res = await fetch(`/api/shopping-list/${userId}`);
    return res.json();
  },

  async addToShoppingList(userId: string, recipeId: string) {
    const res = await fetch('/api/shopping-list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, recipeId }),
    });
    return res.json();
  }
};
