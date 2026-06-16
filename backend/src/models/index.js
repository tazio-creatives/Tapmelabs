const sequelize = require("../config/database");

const User = require("./User");
const Product = require("./Product");
const Order = require("./Order");
const Profile = require("./Profile");
const NfcCard = require("./NfcCard");
const Theme = require("./Theme");
const ProfileVisit = require("./ProfileVisit");
const Reseller = require("./Reseller");
const ResellerOrder = require("./ResellerOrder");
const CommissionLedger = require("./CommissionLedger");
const PayoutRequest = require("./PayoutRequest");

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

// Reseller associations
Reseller.hasMany(ResellerOrder,    { foreignKey: "reseller_id", as: "reseller_orders" });
Reseller.hasMany(CommissionLedger, { foreignKey: "reseller_id", as: "ledger" });
Reseller.hasMany(PayoutRequest,    { foreignKey: "reseller_id", as: "payouts" });

ResellerOrder.belongsTo(Reseller, { foreignKey: "reseller_id", as: "reseller" });
ResellerOrder.belongsTo(Order,    { foreignKey: "order_id",    as: "order" });
Order.hasOne(ResellerOrder,       { foreignKey: "order_id",    as: "reseller_order" });

CommissionLedger.belongsTo(Reseller,      { foreignKey: "reseller_id",       as: "reseller" });
CommissionLedger.belongsTo(ResellerOrder, { foreignKey: "reseller_order_id", as: "reseller_order" });

PayoutRequest.belongsTo(Reseller, { foreignKey: "reseller_id", as: "reseller" });

module.exports = {
  sequelize,
  User,
  Product,
  Order,
  Profile,
  NfcCard,
  Theme,
  ProfileVisit,
  Reseller,
  ResellerOrder,
  CommissionLedger,
  PayoutRequest,
};
