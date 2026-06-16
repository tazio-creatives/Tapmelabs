const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Reseller = sequelize.define(
  "Reseller",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    full_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive", "blocked"),
      defaultValue: "active",
    },
    commission_rate: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 10.00,
    },
    commission_balance: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
    },
    total_earned: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
    },
    total_withdrawn: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
    },
    refresh_token: {
      type: DataTypes.STRING(512),
      allowNull: true,
    },
    two_fa_secret: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    two_fa_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "resellers",
    underscored: true,
    timestamps: true,
  }
);

module.exports = Reseller;
