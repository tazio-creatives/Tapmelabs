const { User, Order, Product, NfcCard, Profile, ProfileVisit } = require("../models");
const { Op, fn, col, literal } = require("sequelize");

// ── GET /api/admin/dashboard ──────────────────────────────────────────────────

async function getDashboardStats(req, res, next) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const [
      totalCustomers,
      totalOrders,
      totalRevenue,
      totalActiveProducts,
      activeNfcCards,
      pendingOrders,
      outOfStockProducts,
      newCustomersToday,
      recentOrders,
      tapsByDay,
    ] = await Promise.all([
      User.count({ where: { role: "customer" } }),
      Order.count(),
      Order.sum("total_amount"),
      Product.count({ where: { status: "active" } }),
      NfcCard.count({ where: { status: "active" } }),
      Order.count({ where: { order_status: "pending" } }),
      Product.count({ where: { status: "out_of_stock" } }),
      User.count({ where: { role: "customer", created_at: { [Op.gte]: today } } }),

      Order.findAll({
        limit: 5,
        order: [["created_at", "DESC"]],
        include: [
          { model: User,    as: "user",    attributes: ["full_name", "email"] },
          { model: Product, as: "product", attributes: ["name"] },
        ],
      }),

      ProfileVisit.findAll({
        attributes: [
          [literal("DATE(created_at)"), "date"],
          [literal("COUNT(id)"),        "taps"],
        ],
        where: {
          visit_type:  "tap",
          created_at:  { [Op.gte]: sevenDaysAgo },
        },
        group: [literal("DATE(created_at)")],
        order: [[literal("DATE(created_at)"), "ASC"]],
        raw: true,
      }),
    ]);

    // Build a complete 7-day array, filling zeros for missing days
    const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const tapsMap = {};
    tapsByDay.forEach((row) => {
      tapsMap[String(row.date)] = Number(row.taps);
    });

    const dailyTaps = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      dailyTaps.push({
        day:  DAY_LABELS[d.getDay()],
        date: dateStr,
        taps: tapsMap[dateStr] || 0,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Dashboard stats fetched successfully.",
      data: {
        stats: {
          total_revenue:          Number(totalRevenue)  || 0,
          total_orders:           totalOrders,
          total_customers:        totalCustomers,
          total_active_products:  totalActiveProducts,
          active_nfc_cards:       activeNfcCards,
          pending_orders:         pendingOrders,
          out_of_stock_products:  outOfStockProducts,
          new_customers_today:    newCustomersToday,
        },
        recent_orders: recentOrders,
        daily_taps:    dailyTaps,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getDashboardStats };
