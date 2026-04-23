import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedSchedules() {
  try {
    // Get all available menu items
    const { data: menuItems, error: menuError } = await supabase
      .from("menu_items")
      .select("id")
      .eq("is_available", true);

    if (menuError) throw menuError;
    if (!menuItems || menuItems.length === 0) {
      console.log("No menu items found. Please seed menu_items first.");
      return;
    }

    console.log(`Found ${menuItems.length} menu items`);

    // Create schedules for next 7 days
    const schedules = [];
    const today = new Date();

    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const date = new Date(today);
      date.setDate(today.getDate() + dayOffset);
      const dateStr = date.toISOString().split("T")[0];

      // Add 2-3 random menu items per day
      const itemsPerDay = Math.floor(Math.random() * 2) + 2;
      const shuffled = [...menuItems].sort(() => Math.random() - 0.5);

      for (let i = 0; i < itemsPerDay && i < shuffled.length; i++) {
        schedules.push({
          menu_item_id: shuffled[i].id,
          available_date: dateStr,
        });
      }
    }

    console.log(`Inserting ${schedules.length} schedule entries...`);

    const { error: insertError } = await supabase
      .from("menu_schedules")
      .insert(schedules);

    if (insertError) {
      // Ignore duplicate key errors
      if (insertError.code === "23505") {
        console.log("Some schedules already exist. Skipping duplicates.");
      } else {
        throw insertError;
      }
    }

    console.log("✓ Menu schedules seeded successfully");
  } catch (err) {
    console.error("Error seeding schedules:", err);
    process.exit(1);
  }
}

seedSchedules();
