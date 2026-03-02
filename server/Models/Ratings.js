import { DataTypes } from "sequelize";
import { sequelize } from "../Database/database.js";
import User from "./User.js";

const Rating = sequelize.define(
  "Rating",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    ratingFrom: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },

    ratingTo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },

    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },

    review: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "ratings",
    timestamps: true,
  }
);

User.hasMany(Rating, { foreignKey: "ratingTo", as: "receivedRatings" });
Rating.belongsTo(User, { foreignKey: "ratingFrom", as: "reviewer" });

export default Rating;