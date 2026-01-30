// src/controllers/holiday.controller.js
import {
  createHolidayService,
  getHolidaysService,
  updateHolidayService,
  deleteHolidayService,
} from "../services/holiday.service.js";

export const createHolidayController = async (req, res) => {
  try {
    const holiday = await createHolidayService(req.body);
    res.status(201).json({
      message: "Holiday created successfully",
      holiday,
    });
  } catch (err) {
    console.error("Create holiday error:", err.message);
    res.status(400).json({ message: err.message });
  }
};

export const getHolidaysController = async (req, res) => {
  try {
    const { year, type, isActive } = req.query;
    const holidays = await getHolidaysService({ year, type, isActive });
    res.json(holidays);
  } catch (err) {
    console.error("Get holidays error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateHolidayController = async (req, res) => {
  try {
    const { id } = req.params;
    const holiday = await updateHolidayService(id, req.body);
    res.json({
      message: "Holiday updated successfully",
      holiday,
    });
  } catch (err) {
    console.error("Update holiday error:", err.message);
    res.status(400).json({ message: err.message });
  }
};

export const deleteHolidayController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteHolidayService(id);
    res.json(result);
  } catch (err) {
    console.error("Delete holiday error:", err.message);
    res.status(400).json({ message: err.message });
  }
};



