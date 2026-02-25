import { DataTypes } from "sequelize";
import { sequelize } from "../Database/database.js";
import User from "./User.js";
import Blog from "./Blog.js";

const BlogReport = sequelize.define(
  "BlogReport",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    blogId: {
      type: DataTypes.INTEGER,
      references: {
        model: "blogs",
        key: "id",
      },
    },

    reporterId: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },

    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("pending", "reviewed"),
      defaultValue: "pending",
    },
  },
  {
    tableName: "blog_reports",
    timestamps: true,
  }
);

export default BlogReport;