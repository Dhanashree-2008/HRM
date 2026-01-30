import { Notification } from "../models/index.js";

export const listNotificationsController = async (req, res) => {
  try {
    const items = await Notification.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const markReadController = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Notification.findByPk(id);
    if (!item || item.userId !== req.user.id) {
      return res.status(404).json({ message: "Not found" });
    }
    await item.update({ isRead: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const markAllReadController = async (req, res) => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { userId: req.user.id } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteNotificationController = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Notification.findByPk(id);
    if (!item || item.userId !== req.user.id) {
      return res.status(404).json({ message: "Not found" });
    }
    await item.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const clearAllNotificationsController = async (req, res) => {
  try {
    await Notification.destroy({ where: { userId: req.user.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
