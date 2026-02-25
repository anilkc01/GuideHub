import { DataTypes } from "sequelize";
import { sequelize } from "../Database/database.js";
import User from "./User.js";

const Blog = sequelize.define(
  "Blog",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    authorId: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    location: {
      type: DataTypes.STRING,
    },
    cover: {
        type: DataTypes.STRING,
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("published", "draft"),
      defaultValue: "published",
    },
  },
  {
    tableName: "blogs",
    timestamps: true,
  }
);

User.hasMany(Blog, { foreignKey: "authorId" });
Blog.belongsTo(User, { foreignKey: "authorId", as: "author" });

export default Blog;