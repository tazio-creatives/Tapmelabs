const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Subscription = sequelize.define(
  "Subscription",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    user_id: { type: DataTypes.UUID, allowNull: false },
    plan: { type: DataTypes.STRING(20), defaultValue: "pro" },
    status: {
      type: DataTypes.ENUM("active", "expired", "cancelled"),
      defaultValue: "active",
    },
    starts_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    expires_at: { type: DataTypes.DATE, allowNull: true },
    leads_scored_this_month: { type: DataTypes.INTEGER, defaultValue: 0 },
    leads_limit: { type: DataTypes.INTEGER, defaultValue: 500 },
  },
  { tableName: "subscriptions", underscored: true, timestamps: true }
);

module.exports = Subscription;
