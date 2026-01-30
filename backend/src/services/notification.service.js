import { Notification } from "../models/index.js";

export const createNotification = async ({
  userId,
  title,
  message,
  type,
}) => {
  return Notification.create({
    userId,
    title,
    message,
    type,
  });
};
