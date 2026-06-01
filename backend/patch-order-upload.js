// One-shot script: patch TAPME1002 card_customization with test upload_own_design data
// Run: node patch-order-upload.js
// Delete this file after testing.

require("dotenv").config({ path: require("path").join(__dirname, ".env") });

const sequelize = require("./src/config/database");
const Order     = require("./src/models/Order");

// Tiny 5:3 red placeholder PNG (base64) — simulates an uploaded front design
const TEST_FRONT_DATAURL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAYAAAD68A/GAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAHklEQVQI12P8z8BQDwADhQGAWjR9awAAAABJRU5ErkJggg==";

// Tiny 5:3 blue placeholder PNG — simulates an uploaded back design
const TEST_BACK_DATAURL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAYAAAD68A/GAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAHUlEQVQI12NkYGD4z0ABAAQaAAEJDhVCAAAAAElFTkSuQmCC";

async function main() {
  await sequelize.authenticate();
  console.log("DB connected.");

  const order = await Order.findOne({ where: { order_number: "TAPME1002" } });
  if (!order) {
    console.error("Order TAPME1002 not found.");
    process.exit(1);
  }

  await order.update({
    card_customization: {
      design_method:         "upload_own_design",
      uploaded_front_design: TEST_FRONT_DATAURL,
      uploaded_back_design:  TEST_BACK_DATAURL,
    },
  });

  console.log("Patched TAPME1002 card_customization → upload_own_design with test images.");
  await sequelize.close();
}

main().catch((err) => { console.error(err); process.exit(1); });
