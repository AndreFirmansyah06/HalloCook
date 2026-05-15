-- CREATE TABLES
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  ingredients JSONB, -- Array of strings
  steps JSONB, -- Array of steps
  image_url TEXT,
  duration TEXT,
  difficulty TEXT,
  calories INTEGER,
  servings INTEGER,
  category TEXT,
  chef_name TEXT DEFAULT 'HalloCook Chef',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, recipe_id)
);

CREATE TABLE shopping_list (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- DUMMY DATA SEEDING
INSERT INTO recipes (title, description, ingredients, steps, image_url, duration, difficulty, calories, servings) VALUES
('Rawon', 'Authentic East Java beef soup with nutty black broth.', '["500g Beef", "Kluwak", "Lemongrass", "Shallots", "Garic"]', '["Prepare kluwak paste", "Sauté spices", "Boil beef until tender"]', 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&q=80', '60 mins', 'Medium', 450, 4),
('Nasi Goreng', 'Indonesia''s signature fried rice with exotic spices.', '["Rice", "Egg", "Sweet Soy Sauce", "Chili", "Garlic"]', '["Heat oil", "Scramble egg", "Stir rice with sauce"]', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80', '15 mins', 'Easy', 350, 2),
('Rendang', 'World-famous slow-cooked beef in coconut milk and spices.', '["Beef", "Coconut Milk", "Galangal", "Tamarind", "Chili"]', '["Boil everything together", "Simmer for 4 hours", "Stir until dry and dark"]', 'https://images.unsplash.com/photo-1626777566127-ec9a3bb18228?auto=format&fit=crop&q=80', '240 mins', 'Hard', 600, 6);

-- RLS POLICIES (Simple version for Anon access if server handles auth)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_list ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Recipes" ON recipes FOR SELECT USING (true);
CREATE POLICY "Users can manage own data" ON users FOR ALL USING (true);
CREATE POLICY "Users can manage favorites" ON favorites FOR ALL USING (true);
CREATE POLICY "Users can manage shopping list" ON shopping_list FOR ALL USING (true);
