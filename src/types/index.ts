export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  image_url: string;
  duration: string;
  difficulty: string;
  calories: number;
  servings: number;
  category?: string;
  chef_name?: string;
  created_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  recipe_id: string;
  recipe?: Recipe;
}

export interface ShoppingItem {
  id: string;
  user_id: string;
  recipe_id: string;
  recipes?: { title: string };
}
