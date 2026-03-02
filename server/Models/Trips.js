import { DataTypes } from "sequelize";
import { sequelize } from "../Database/database.js";
import User from "./User.js";
import TrekPlan from "./TrekPlan.js";

const Trip = sequelize.define(
  "Trip",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    trekPlanId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "trekplans",
        key: "id",
      },
    },

    trekkerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },

    guideId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },

    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    remarks: {
      type: DataTypes.TEXT,
    },

    status: {
      type: DataTypes.ENUM("upcoming", "ongoing", "completed", "cancelled"),
      defaultValue: "upcoming",
    },
  },
  {
    tableName: "trips",
    timestamps: true,
  }
);

Trip.belongsTo(TrekPlan, { foreignKey: "trekPlanId" });
Trip.belongsTo(User, { foreignKey: "trekkerId", as: "trekker" });
Trip.belongsTo(User, { foreignKey: "guideId", as: "guide" });

export default Trip;