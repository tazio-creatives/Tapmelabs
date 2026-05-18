require("dotenv").config({ path: require("node:path").resolve(__dirname, "../../.env") });

const sequelize = require("../config/database");
const Theme = require("../models/Theme");

const THEMES = [
  { name: "Default",        key: "default"    },
  { name: "Midnight Dark",  key: "midnight"   },
  { name: "Professional",   key: "professional" },
  { name: "Modern",         key: "modern"     },
  { name: "Vibrant",        key: "vibrant"    },
  { name: "Minimal",        key: "minimal"    },
];

async function seed() {
  try {
    await sequelize.authenticate();

    let created = 0;
    let skipped = 0;

    for (const theme of THEMES) {
      const [, wasCreated] = await Theme.findOrCreate({
        where: { key: theme.key },
        defaults: { name: theme.name, status: "active" },
      });
      wasCreated ? created++ : skipped++;
    }

    console.log(`Themes seeded — created: ${created}, already existed: ${skipped}`);
  } catch (err) {
    console.error("Seeder failed:", err.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

seed();
