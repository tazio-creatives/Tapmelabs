const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ReviewTag = sequelize.define(
  "ReviewTag",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
    },
    code: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    product_type: {
      type: DataTypes.ENUM("standee_social", "standee_google", "card_google"),
      allowNull: false,
    },
    business_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    logo_url: {
      type: DataTypes.STRING(2048),
      allowNull: true,
    },
    google_review_url: {
      type: DataTypes.STRING(2048),
      allowNull: false,
    },
    instagram_url: {
      type: DataTypes.STRING(2048),
      allowNull: true,
    },
    whatsapp_url: {
      type: DataTypes.STRING(2048),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("active", "locked"),
      defaultValue: "active",
    },
  },
  {
    tableName: "review_tags",
    underscored: true,
    timestamps: true,
  }
);

module.exports = ReviewTag;
