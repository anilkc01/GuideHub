import { DataTypes } from "sequelize";
import { sequelize } from "../Database/database.js";
import User from "./User.js";
import TrekPlan from "./TrekPlan.js";

const Offer = sequelize.define(
  "Offer",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    trekPlanId: {
      type: DataTypes.INTEGER,
      references: {
        model: "trekplans",
        key: "id",
      },
    },

    bidderId: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },

    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected", "cancelled"),
      defaultValue: "pending",
    },
  },
  {
    tableName: "offers",
    timestamps: true,
  }
);

TrekPlan.hasMany(Offer, { foreignKey: "trekPlanId", as: "offers" });
Offer.belongsTo(TrekPlan, { foreignKey: "trekPlanId", as: "plan" });

User.hasMany(Offer, { foreignKey: "bidderId", as: "bids" });
Offer.belongsTo(User, { foreignKey: "bidderId", as: "bidder" });
export default Offer;