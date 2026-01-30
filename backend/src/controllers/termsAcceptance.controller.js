// src/controllers/termsAcceptance.controller.js
import {
  getTermsDocumentsService,
  getUserAcceptanceStatusService,
  acceptTermsService,
  getUserAcceptanceHistoryService,
} from "../services/termsAcceptance.service.js";

export const getTermsDocumentsController = async (req, res) => {
  try {
    const documents = await getTermsDocumentsService();
    res.json(documents);
  } catch (err) {
    console.error("Get terms documents error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserAcceptanceStatusController = async (req, res) => {
  try {
    const userId = req.user.id;
    const status = await getUserAcceptanceStatusService(userId);
    res.json(status);
  } catch (err) {
    console.error("Get acceptance status error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const acceptTermsController = async (req, res) => {
  try {
    const { documentType, version } = req.body;
    const userId = req.user.id;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get("user-agent");

    if (!documentType || !version) {
      return res.status(400).json({ message: "Document type and version are required" });
    }

    const acceptance = await acceptTermsService(userId, documentType, version, ipAddress, userAgent);
    res.json({
      message: "Terms accepted successfully",
      acceptance,
    });
  } catch (err) {
    console.error("Accept terms error:", err.message);
    res.status(400).json({ message: err.message });
  }
};

export const getUserAcceptanceHistoryController = async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await getUserAcceptanceHistoryService(userId);
    res.json(history);
  } catch (err) {
    console.error("Get acceptance history error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};



