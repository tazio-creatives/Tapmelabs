const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PayoutRequest = sequelize.define(
  "PayoutRequest",
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
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected", "paid"),
      defaultValue: "pending",
    },
    upi_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    bank_account: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    bank_ifsc: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    bank_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    admin_note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    processed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "payout_requests",
    underscored: true,
    timestamps: true,
  }
);

module.exports = PayoutRequest;
