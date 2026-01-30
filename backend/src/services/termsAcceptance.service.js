// src/services/termsAcceptance.service.js
import { TermsAcceptance, User } from "../models/index.js";

// Get all terms documents that need acceptance
export const getTermsDocumentsService = async () => {
  return [
    {
      type: "Company Policy",
      version: "1.0",
      description: "Company policies and guidelines",
      required: true,
    },
    {
      type: "Leave Rules",
      version: "1.0",
      description: "Leave policy and rules",
      required: true,
    },
    {
      type: "Code of Conduct",
      version: "1.0",
      description: "Employee code of conduct",
      required: true,
    },
    {
      type: "Data Privacy",
      version: "1.0",
      description: "Data privacy and protection policy",
      required: true,
    },
    {
      type: "Terms of Service",
      version: "1.0",
      description: "Terms and conditions of service",
      required: true,
    },
  ];
};

// Check user's acceptance status
export const getUserAcceptanceStatusService = async (userId) => {
  const acceptances = await TermsAcceptance.findAll({
    where: { userId },
    order: [["acceptedAt", "DESC"]],
  });

  const documents = await getTermsDocumentsService();

  return documents.map((doc) => {
    const acceptance = acceptances.find(
      (a) => a.documentType === doc.type && a.version === doc.version
    );
    return {
      ...doc,
      accepted: !!acceptance,
      acceptedAt: acceptance?.acceptedAt || null,
    };
  });
};

// Accept terms
export const acceptTermsService = async (userId, documentType, version, ipAddress, userAgent) => {
  // Check if already accepted
  const existing = await TermsAcceptance.findOne({
    where: {
      userId,
      documentType,
      version,
    },
  });

  if (existing) {
    return existing;
  }

  return await TermsAcceptance.create({
    userId,
    documentType,
    version,
    ipAddress,
    userAgent,
  });
};

// Get acceptance history for user
export const getUserAcceptanceHistoryService = async (userId) => {
  return await TermsAcceptance.findAll({
    where: { userId },
    order: [["acceptedAt", "DESC"]],
  });
};



