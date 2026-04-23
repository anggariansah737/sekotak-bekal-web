import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedSampleData() {
  try {
    console.log("Fetching all available menu items...");
    const { data: menuItems, error: menuError } = await supabase
      .from("menu_items")
      .select("id, name")
      .eq("is_available", true);

    if (menuError) throw menuError;
    if (!menuItems || menuItems.length === 0) {
      console.log("No menu items found. Please seed menu_items first.");
      return;
    }

    console.log(`Found ${menuItems.length} available menu items`);

    const schedules = [];
    const dates = [
      "2026-04-24", // Today
      "2026-04-25", // Tomorrow
      "2026-04-26",
      "2026-04-27",
      "2026-04-28",
      "2026-04-29",
      "2026-04-30",
    ];

    // Shuffle menu items for variety
    const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

    for (const date of dates) {
      let count;
      if (date === "2026-04-24") {
        // Add all items for today
        count = menuItems.length;
      } else if (date === "2026-04-25") {
        // Add 4 items for tomorrow
        count = 4;
      } else if (date === "2026-04-26") {
        // Add 5 items
        count = 5;
      } else {
        // Add 3-4 items for other days
        count = Math.floor(Math.random() * 2) + 3;
      }

      const shuffled = shuffle(menuItems);
      for (let i = 0; i < count && i < shuffled.length; i++) {
        schedules.push({
          menu_item_id: shuffled[i].id,
          available_date: date,
        });
      }

      console.log(
        `📅 ${date}: ${Math.min(count, menuItems.length)} menu items`,
      );
    }

    console.log(`\nInserting ${schedules.length} schedule entries...`);

    const { error: insertError } = await supabase
      .from("menu_schedules")
      .insert(schedules);

    if (insertError) {
      // Check if it's a duplicate key error
      if (insertError.code === "23505") {
        console.log("⚠️  Some schedules already exist. Skipping duplicates.");
      } else {
        throw insertError;
      }
    }

    // Verify the data
    console.log("\n✓ Verifying inserted data...");
    const { data: verification } = await supabase
      .from("menu_schedules")
      .select("available_date")
      .gte("available_date", "2026-04-24")
      .lte("available_date", "2026-04-30");

    if (verification) {
      const groupedByDate = {};
      verification.forEach((row) => {
        if (!groupedByDate[row.available_date]) {
          groupedByDate[row.available_date] = 0;
        }
        groupedByDate[row.available_date]++;
      });

      console.log("\nSample data summary:");
      Object.entries(groupedByDate)
        .sort()
        .forEach(([date, count]) => {
          console.log(`  📅 ${date}: ${count} menu items`);
        });
    }

    console.log("\n✅ Sample data seeded successfully!");
    console.log("\nYou can now:");
    console.log("1. Open http://localhost:5173");
    console.log("2. Click on different dates to see different menus");
    console.log("3. Add items from multiple dates to cart");
    console.log("4. Test checkout to create multi-date orders");
  } catch (err) {
    console.error("❌ Error seeding sample data:", err.message);
    process.exit(1);
  }
}

seedSampleData();
