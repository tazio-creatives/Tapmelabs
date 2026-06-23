require("dotenv").config();

// ── Env validation ────────────────────────────────────────────────────────────
// Fail fast before any app code runs so misconfigured deploys are obvious.
const REQUIRED_ENV = [
  "PORT",
  "JWT_SECRET",
  "DB_HOST",
  "DB_PORT",
  "DB_NAME",
  "DB_USER",
  "DB_PASSWORD",
  "ALLOWED_ORIGINS",
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
];

const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`[Startup] Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

const path      = require("node:path");
const express   = require("express");
const cors      = require("cors");
const sequelize = require("./src/config/database");

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim());

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (curl, Postman, mobile apps)
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy: origin ${origin} not allowed`));
      }
    },
    credentials: true,
  })
);

// ── Body parsers ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ── Route imports ─────────────────────────────────────────────────────────────
const authRoutes           = require("./src/routes/authRoutes");
const productRoutes        = require("./src/routes/productRoutes");
const profileRoutes        = require("./src/routes/profileRoutes");
const orderRoutes          = require("./src/routes/orderRoutes");
const nfcCardRoutes        = require("./src/routes/nfcCardRoutes");
const themeRoutes          = require("./src/routes/themeRoutes");
const analyticsRoutes      = require("./src/routes/analyticsRoutes");
const uploadRoutes              = require("./src/routes/uploadRoutes");
const adminCustomerRoutes       = require("./src/routes/adminCustomerRoutes");
const adminDashboardRoutes      = require("./src/routes/adminDashboardRoutes");
const paymentRoutes             = require("./src/routes/paymentRoutes");
const resellerAuthRoutes        = require("./src/routes/resellerAuthRoutes");
const resellerOrderRoutes       = require("./src/routes/resellerOrderRoutes");
const resellerPaymentRoutes     = require("./src/routes/resellerPaymentRoutes");
const resellerCommissionRoutes  = require("./src/routes/resellerCommissionRoutes");
const resellerProfileRoutes     = require("./src/routes/resellerProfileRoutes");
const resellerCustomerRoutes    = require("./src/routes/resellerCustomerRoutes");
const adminResellerRoutes       = require("./src/routes/adminResellerRoutes");
const formRoutes                = require("./src/routes/formRoutes");
const leadRoutes                = require("./src/routes/leadRoutes");

// ── Static files ──────────────────────────────────────────────────────────────
app.use("/uploads", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
}, express.static(path.join(__dirname, "uploads")));

// ── Routes ────────────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "TAPME Backend API Running", version: "1.0.0" });
});

app.use("/api/auth",            authRoutes);
app.use("/api/products",        productRoutes);
app.use("/api/profiles",        profileRoutes);
app.use("/api/orders",          orderRoutes);
app.use("/api/nfc-cards",       nfcCardRoutes);
app.use("/api/themes",          themeRoutes);
app.use("/api/analytics",       analyticsRoutes);
app.use("/api/uploads",         uploadRoutes);
app.use("/api/admin/customers",  adminCustomerRoutes);
app.use("/api/admin/dashboard",  adminDashboardRoutes);
app.use("/api/admin/resellers",  adminResellerRoutes);
app.use("/api/payments",         paymentRoutes);
app.use("/api/reseller/auth",       resellerAuthRoutes);
app.use("/api/reseller/orders",     resellerOrderRoutes);
app.use("/api/reseller/payment",    resellerPaymentRoutes);
app.use("/api/reseller/commission", resellerCommissionRoutes);
app.use("/api/reseller/profile",    resellerProfileRoutes);
app.use("/api/reseller/customer",   resellerCustomerRoutes);
app.use("/api/forms",               formRoutes);
app.use("/api/leads",               leadRoutes);

// Manual trigger for testing (dev only)
if (process.env.NODE_ENV === "development") {
  app.post("/api/admin/trigger-scoring", async (req, res) => {
    const { runScoringJob } = require("./src/jobs/scoringCron");
    res.json({ message: "Scoring job triggered" });
    runScoringJob(); // run async, don't wait
  });
}

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    data: null,
  });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  console.error(`[Error] ${status} — ${err.message}`);
  res.status(status).json({
    success: false,
    message: err.message || "Internal server error",
    data: null,
  });
});

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT;
const NODE_ENV = process.env.NODE_ENV || "production";

async function start() {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");

    if (NODE_ENV === "development") {
      // sync({ alter: true }) updates columns without dropping tables.
      // For production, use proper migrations (e.g. sequelize-cli migrate).
      await sequelize.sync({ alter: { drop: false } });
      console.log("Database synced (development mode)");
    }
  } catch (err) {
    console.error("Database startup failed:", err.original?.message || err.message || err);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`\n🚀  TAPME Backend running on http://localhost:${PORT}`);
    console.log(`    ENV:             ${NODE_ENV}`);
    console.log(`    Allowed origins: ${ALLOWED_ORIGINS.join(", ")}\n`);

    // Start lead scoring cron job
    const { startScoringCron } = require("./src/jobs/scoringCron");
    startScoringCron();
  });
}

start();
