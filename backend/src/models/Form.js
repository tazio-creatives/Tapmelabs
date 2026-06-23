const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Form = sequelize.define(
  "Form",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    user_id: { type: DataTypes.UUID, allowNull: false },
    title: { type: DataTypes.STRING(255), allowNull: false, defaultValue: "Contact Me" },
    description: { type: DataTypes.TEXT, allowNull: true },
    fields: { type: DataTypes.JSONB, defaultValue: [] },
    thank_you_message: {
      type: DataTypes.TEXT,
      defaultValue: "Thanks for connecting! I will reach out shortly.",
    },
    slug: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { tableName: "forms", underscored: true, timestamps: true }
);

module.exports = Form;
