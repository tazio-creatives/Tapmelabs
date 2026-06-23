const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Lead = sequelize.define(
  "Lead",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    form_id: { type: DataTypes.UUID, allowNull: false },
    user_id: { type: DataTypes.UUID, allowNull: false },
    data: { type: DataTypes.JSONB, defaultValue: {} },
    name: { type: DataTypes.STRING(255), allowNull: true },
    email: { type: DataTypes.STRING(255), allowNull: true },
    phone: { type: DataTypes.STRING(30), allowNull: true },
    status: {
      type: DataTypes.ENUM("new", "contacted", "follow_up", "closed"),
      defaultValue: "new",
    },
    notes: { type: DataTypes.TEXT, allowNull: true },
    // AI scoring fields
    ai_score: { type: DataTypes.DECIMAL(3, 1), allowNull: true },
    ai_priority: { type: DataTypes.ENUM("hot", "warm", "cold"), allowNull: true },
    ai_intent: { type: DataTypes.STRING(100), allowNull: true },
    ai_sentiment: { type: DataTypes.STRING(50), allowNull: true },
    ai_summary: { type: DataTypes.TEXT, allowNull: true },
    ai_reply_suggestion: { type: DataTypes.TEXT, allowNull: true },
    ai_scored_at: { type: DataTypes.DATE, allowNull: true },
    scoring_status: {
      type: DataTypes.ENUM("pending", "scored", "skipped", "error"),
      defaultValue: "pending",
    },
  },
  { tableName: "leads", underscored: true, timestamps: true }
);

module.exports = Lead;
