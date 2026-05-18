require("dotenv").config({ path: require("node:path").resolve(__dirname, "../../.env") });

const bcrypt = require("bcryptjs");
const sequelize = require("../config/database");
const User = require("../models/User");

const ADMIN = {
  full_name:         "Admin",
  email:             "admin@tapmelabs.com",
  phone:             "9999999999",
  password:          "Admin@123",
  role:              "admin",
  is_email_verified: true,
  status:            "active",
};

async function seed() {
  try {
    await sequelize.authenticate();

    const existing = await User.findOne({ where: { email: ADMIN.email } });

    if (existing) {
      console.log(`Admin user already exists (${ADMIN.email}) — skipping.`);
      return;
    }

    const hashed = await bcrypt.hash(ADMIN.password, 12);

    await User.create({ ...ADMIN, password: hashed });

    console.log(`Admin user created: ${ADMIN.email}`);
  } catch (err) {
    console.error("Seeder failed:", err.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

seed();
