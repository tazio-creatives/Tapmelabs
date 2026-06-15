const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    sale_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    short_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    full_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    images: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    front_image: {
      type: DataTypes.STRING(2048),
      allowNull: true,
    },
    back_image: {
      type: DataTypes.STRING(2048),
      allowNull: true,
    },
    allow_color_customization: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    background_styles: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    status: {
      type: DataTypes.ENUM("active", "draft", "out_of_stock"),
      defaultValue: "draft",
    },
  },
  {
    tableName: "products",
    underscored: true,
    timestamps: true,
  }
);

module.exports = Product;
