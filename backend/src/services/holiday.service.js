// src/services/holiday.service.js
import { Op } from "sequelize";
import { Holiday } from "../models/index.js";

export const createHolidayService = async (data) => {
  const { name, date, type, isRecurring, year } = data;

  // Check duplicate date for same year (or recurring)
  const where = { date };
  if (!isRecurring && year) {
    where.year = year;
  }

  const existing = await Holiday.findOne({ where });
  if (existing) throw new Error("Holiday already exists for this date");

  return await Holiday.create({
    name,
    date,
    type,
    isRecurring: isRecurring || false,
    year: isRecurring ? null : year || new Date().getFullYear(),
    isActive: true,
  });
};

export const getHolidaysService = async (filters = {}) => {
  const { year, type, isActive } = filters;
  const currentYear = year || new Date().getFullYear();

  const where = {};
  if (year) {
    where[Op.or] = [
      { year: currentYear },
      { isRecurring: true },
    ];
  }
  if (type) where.type = type;
  if (isActive !== undefined) where.isActive = isActive;

  return await Holiday.findAll({
    where,
    order: [["date", "ASC"]],
  });
};

export const updateHolidayService = async (holidayId, data) => {
  const holiday = await Holiday.findByPk(holidayId);
  if (!holiday) throw new Error("Holiday not found");

  await holiday.update(data);
  return holiday;
};

export const deleteHolidayService = async (holidayId) => {
  const holiday = await Holiday.findByPk(holidayId);
  if (!holiday) throw new Error("Holiday not found");

  await holiday.destroy();
  return { message: "Holiday deleted successfully" };
};



