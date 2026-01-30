import { Parser } from "json2csv";
import {
  getAttendanceReport,
  getLeaveReport,
  getWorklogReport,
  getTaskReport,
  getAttendanceAnalytics
} from "../services/report.service.js";

// ATTENDANCE ANALYTICS
export const getAttendanceAnalyticsController = async (req, res) => {
  try {
    const { start, end, department } = req.query;
    const data = await getAttendanceAnalytics({
      dateRange: { start, end },
      department
    });
    res.json(data);
  } catch (err) {
    console.error("Analytics Error:", err);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};

const exportCSV = (res, data, fileName) => {
  const parser = new Parser();
  const csv = parser.parse(data);

  res.header("Content-Type", "text/csv");
  res.attachment(fileName);
  return res.send(csv);
};

// ATTENDANCE CSV
export const exportAttendanceCSV = async (req, res) => {
  const { start, end, department } = req.query;
  const data = await getAttendanceReport({ start, end, department });
  exportCSV(res, data, "attendance_report.csv");
};

// LEAVE CSV
export const exportLeaveCSV = async (req, res) => {
  const data = await getLeaveReport();
  exportCSV(res, data, "leave_report.csv");
};

// WORKLOG CSV
export const exportWorklogCSV = async (req, res) => {
  const data = await getWorklogReport();
  exportCSV(res, data, "worklog_report.csv");
};

// TASK CSV
export const exportTaskCSV = async (req, res) => {
  const data = await getTaskReport();
  exportCSV(res, data, "task_report.csv");
};
