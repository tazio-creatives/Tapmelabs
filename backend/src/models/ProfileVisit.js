const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ProfileVisit = sequelize.define(
  "ProfileVisit",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    profile_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    device: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    visit_type: {
      type: DataTypes.ENUM("view", "tap", "qr_scan", "contact_saved"),
      defaultValue: "view",
    },
  },
  {
    tableName: "profile_visits",
    underscored: true,
    timestamps: true,
    updatedAt: false,
  }
);

module.exports = ProfileVisit;
