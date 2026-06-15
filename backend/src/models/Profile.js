const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Profile = sequelize.define(
  "Profile",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    designation: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    company_name: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: { isEmail: true },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    profile_image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    company_logo: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    theme_key: {
      type: DataTypes.STRING(50),
      defaultValue: "default",
    },
    social_links: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    theme_customization: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
    },
    is_public: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "profiles",
    underscored: true,
    timestamps: true,
  }
);

module.exports = Profile;
