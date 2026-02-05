import { DataTypes } from "sequelize";
import { sequelize } from "../Database/database.js";
import User from "./User.js";

const Guide = sequelize.define(
  "Guide",
  {
    guideID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: "users",
        key: "id",
      },
    },

    licenseNo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    totalTreks: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    licenseImg: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    citizenshipImg: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("pending", "verified", "rejected"),
      defaultValue: "pending",
    },
  },
  {
    tableName: "guides",
    timestamps: true,
  }
);

// Associations
User.hasOne(Guide, { foreignKey: "userId", as: "guideProfile" });
Guide.belongsTo(User, { foreignKey: "userId", as: "user" });

export default Guide;