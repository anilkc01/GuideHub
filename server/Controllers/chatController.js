import { Op } from "sequelize";
import Message from "../Models/Message.js";
import User from "../Models/User.js";

export const getConversations = async (req, res) => {
  const userId = req.user.id;
  try {
    const messages = await Message.findAll({
      where: { [Op.or]: [{ senderId: userId }, { receiverId: userId }] },
      include: [
        { model: User, as: "sender", attributes: ["id", "fullName", "dp"] },
        { model: User, as: "receiver", attributes: ["id", "fullName", "dp"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    const chatList = [];
    const seenUsers = new Set();

    messages.forEach((msg) => {
      const partner = msg.senderId === userId ? msg.receiver : msg.sender;
      if (partner && !seenUsers.has(partner.id)) {
        seenUsers.add(partner.id);
        chatList.push({
          partner,
          lastMessage: msg.content,
          time: msg.createdAt,
          isUnread: msg.receiverId === userId && msg.status !== "read",
        });
      }
    });
    res.status(200).json(chatList);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

export const getMessagesBetweenUsers = async (req, res) => {
  const { partnerId } = req.params;
  const userId = req.user.id;
  try {
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: userId, receiverId: partnerId },
          { senderId: partnerId, receiverId: userId },
        ],
      },
      order: [["createdAt", "ASC"]],
    });
    res.status(200).json(messages);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const markAsRead = async (req, res) => {
  try {
    await Message.update({ status: "read" }, {
      where: { senderId: req.params.partnerId, receiverId: req.user.id, status: "sent" }
    });
    res.sendStatus(200);
  } catch (err) { res.status(500).json(err); }
};