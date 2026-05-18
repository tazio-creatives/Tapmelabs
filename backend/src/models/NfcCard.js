const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const NfcCard = sequelize.define(
  "NfcCard",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    card_uid: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    profile_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("unassigned", "active", "locked"),
      defaultValue: "unassigned",
    },
  },
  {
    tableName: "nfc_cards",
    underscored: true,
    timestamps: true,
  }
);

module.exports = NfcCard;
