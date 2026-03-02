import { DataTypes } from "sequelize";
import { sequelize } from "../Database/database.js";
import User from "./User.js";


const Message = sequelize.define(
  "Message",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("sent", "read"),
      defaultValue: "sent",
    },
  },
  {
    tableName: "messages",
    timestamps: true,      
    paranoid: true,       
    indexes: [
      { fields: ["senderId"] },
      { fields: ["receiverId"] },
      { fields: ["createdAt"] },
    ],
  }
);

Message.belongsTo(User, { as: "sender", foreignKey: "senderId" });
Message.belongsTo(User, { as: "receiver", foreignKey: "receiverId" });

User.hasMany(Message, { as: "sentMessages", foreignKey: "senderId" });
User.hasMany(Message, { as: "receivedMessages", foreignKey: "receiverId" });

export default Message;