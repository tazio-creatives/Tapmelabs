const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ResellerOrder = sequelize.define(
  "ResellerOrder",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    reseller_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    order_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    customer_name: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    customer_phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    customer_email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    order_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    commission_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
    },
    commission_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    commission_applied: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    razorpay_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    payment_method: {
      type: DataTypes.ENUM("razorpay", "commission", "mixed"),
      defaultValue: "razorpay",
    },
    razorpay_order_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    razorpay_payment_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    customer_setup_token: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    customer_setup_token_expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "paid", "cancelled", "refunded"),
      defaultValue: "pending",
    },
  },
  {
    tableName: "reseller_orders",
    underscored: true,
    timestamps: true,
  }
);

module.exports = ResellerOrder;
