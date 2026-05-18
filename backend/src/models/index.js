const sequelize = require("../config/database");

const User = require("./User");
const Product = require("./Product");
const Order = require("./Order");
const Profile = require("./Profile");
const NfcCard = require("./NfcCard");
const Theme = require("./Theme");
const ProfileVisit = require("./ProfileVisit");

// User associations
User.hasMany(Order, { foreignKey: "user_id", as: "orders" });
User.hasOne(Profile, { foreignKey: "user_id", as: "profile" });
User.hasMany(NfcCard, { foreignKey: "user_id", as: "nfc_cards" });

// Order associations
Order.belongsTo(User, { foreignKey: "user_id", as: "user" });
Order.belongsTo(Product, { foreignKey: "product_id", as: "product" });

// Product associations
Product.hasMany(Order, { foreignKey: "product_id", as: "orders" });

// Profile associations
Profile.belongsTo(User, { foreignKey: "user_id", as: "user" });
Profile.hasMany(ProfileVisit, { foreignKey: "profile_id", as: "visits" });

// ProfileVisit associations
ProfileVisit.belongsTo(Profile, { foreignKey: "profile_id", as: "profile" });

// NfcCard associations
NfcCard.belongsTo(User, { foreignKey: "user_id", as: "user" });
NfcCard.belongsTo(Profile, { foreignKey: "profile_id", as: "profile" });

module.exports = {
  sequelize,
  User,
  Product,
  Order,
  Profile,
  NfcCard,
  Theme,
  ProfileVisit,
};
