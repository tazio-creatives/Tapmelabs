const { Op } = require("sequelize");
const { User, Profile, Order, NfcCard, Product } = require("../models");

const USER_SAFE_ATTRS = { exclude: ["password"] };

// ── GET /api/admin/customers ──────────────────────────────────────────────────
// Returns all customers with order/card/profile summary counts.
// TODO: Add pagination (page, limit query params) for large datasets.

async function getAllCustomers(req, res, next) {
  try {
    const { search } = req.query;

    const where = { role: "customer" };

    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      where[Op.or] = [
        { full_name: { [Op.iLike]: term } },
        { email:     { [Op.iLike]: term } },
        { phone:     { [Op.iLike]: term } },
      ];
    }

    const users = await User.findAll({
      where,
      attributes: USER_SAFE_ATTRS,
      include: [
        {
          model: Profile,
          as: "profile",
          attributes: ["id", "slug", "name", "designation", "company_name"],
          required: false,
        },
        {
          model: Order,
          as: "orders",
          attributes: ["id", "total_amount", "order_status"],
          required: false,
        },
        {
          model: NfcCard,
          as: "nfc_cards",
          attributes: ["id", "card_uid", "status"],
          required: false,
        },
      ],
      order: [["created_at", "DESC"]],
    });

    const customers = users.map((u) => {
      const json = u.toJSON();
      return {
        ...json,
        order_count:     json.orders?.length ?? 0,
        nfc_card_count:  json.nfc_cards?.length ?? 0,
        has_profile:     !!json.profile,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Customers fetched successfully.",
      data: { customers, count: customers.length },
    });
  } catch (err) {
    next(err);
  }
}

// ── GET /api/admin/customers/:id ──────────────────────────────────────────────

async function getCustomerById(req, res, next) {
  try {
    const user = await User.findOne({
      where: { id: req.params.id, role: "customer" },
      attributes: USER_SAFE_ATTRS,
      include: [
        {
          model: Profile,
          as: "profile",
          required: false,
        },
        {
          model: Order,
          as: "orders",
          required: false,
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "slug", "price"],
              required: false,
            },
          ],
          order: [["created_at", "DESC"]],
        },
        {
          model: NfcCard,
          as: "nfc_cards",
          attributes: ["id", "card_uid", "status", "created_at"],
          required: false,
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
        data: null,
      });
    }

    const json = user.toJSON();
    const totalSpent = (json.orders ?? []).reduce(
      (sum, o) => sum + Number(o.total_amount ?? 0),
      0
    );

    return res.status(200).json({
      success: true,
      message: "Customer fetched successfully.",
      data: {
        customer: {
          ...json,
          order_count:    json.orders?.length ?? 0,
          nfc_card_count: json.nfc_cards?.length ?? 0,
          has_profile:    !!json.profile,
          total_spent:    totalSpent,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllCustomers, getCustomerById };
