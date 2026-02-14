import { DataTypes } from "sequelize";
import { sequelize } from "../Database/database.js";
import User from "./User.js";

const TrekPlan = sequelize.define(
  "TrekPlan",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    itinerary: {
      type: DataTypes.JSONB,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    timePlanned: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    estBudget: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    trekkerId: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },

    status: {
      type: DataTypes.ENUM("open", "ongoing", "completed", "cancelled"),
      defaultValue: "open",
    },
  },
  {
    tableName: "trekplans",
    timestamps: true,
  }
);

User.hasMany(TrekPlan, { foreignKey: "trekkerId", as: "plans" });
TrekPlan.belongsTo(User, { foreignKey: "trekkerId", as: "trekker" });

export default TrekPlan;