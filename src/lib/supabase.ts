import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nimihppvvpfepbgzewwu.supabase.co";
const supabaseKey = "sb_publishable_k-LV2U5wPyfhrG-gwso7EQ_8fyr3pfP";

export const supabase = createClient(supabaseUrl, supabaseKey);
