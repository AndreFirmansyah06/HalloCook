import { supabase } from "../lib/supabase";
import bcrypt from "bcryptjs";

export const userService = {
  async getAllAdmins() {
    const { data, error } = await supabase.from("users").select("*").eq("role", "admin");
    if (error) throw error;
    return data || [];
  },
  async getAllUsers() {
    const { data, error } = await supabase.from("users").select("*");
    if (error) throw error;
    return data || [];
  },
  async createAdmin(userData: any) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const { data: existing } = await supabase.from("users").select("id").eq("email", userData.email).single();
    if (existing) throw new Error("Email already registered");

    const { data, error } = await supabase.from("users").insert([{
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      role: "admin"
    }]).select().single();
    if (error) throw error;
    return data;
  },
  async updateAdmin(id: string, userData: any) {
    const updateData: any = { ...userData };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    } else {
      delete updateData.password;
    }
    
    const { data, error } = await supabase.from("users").update(updateData).eq("id", id).select().single();
    if (error) throw error;
    return data;
  },
  async deleteAdmin(id: string) {
    const { error } = await supabase.from("users").delete().eq("id", id);
    if (error) throw error;
    return true;
  }
};
