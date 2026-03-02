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

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("pending", "resolved"),
      defaultValue: "pending",
    },
  },
  {
    tableName: "blog_reports",
    timestamps: true,
  }
);

BlogReport.belongsTo(User, { foreignKey: "reporterId", as: "reporter" });
BlogReport.belongsTo(Blog, { foreignKey: "blogId", as: "reportedBlog" });


export default BlogReport;