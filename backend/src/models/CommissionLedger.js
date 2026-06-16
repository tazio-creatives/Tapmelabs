const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CommissionLedger = sequelize.define(
  "CommissionLedger",
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
    reseller_order_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM("earned", "used", "withdrawn", "refunded"),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    balance_after: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    note: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "commission_ledger",
    underscored: true,
    timestamps: true,
    updatedAt: false,
  }
);

module.exports = CommissionLedger;
