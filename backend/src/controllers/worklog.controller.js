import {
  addWorklogService,
  getMyWorklogsService,
  getTeamWorklogsService,
} from "../services/worklog.service.js";

export const addWorklogController = async (req, res) => {
  try {
    const entry = await addWorklogService(req.user.employeeId, req.body);
    res.status(201).json({ message: "Worklog added", entry });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const myWorklogsController = async (req, res) => {
  try {
    const logs = await getMyWorklogsService(req.user.employeeId);
    res.json(logs);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const teamWorklogsController = async (req, res) => {
  try {
    const logs = await getTeamWorklogsService(req.user);
    res.json(logs);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
