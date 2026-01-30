import {
    getSettingsService,
    updateSettingsService,
} from "../services/setting.service.js";

export const getCompanySettingsController = async (req, res) => {
    try {
        const settings = await getSettingsService("company_settings");
        // Return default structure if null
        const defaults = {
            general: {
                companyName: "LiteHR Solutions",
                companyEmail: "info@litehr.com",
                phone: "+1 (555) 123-4567",
                address: "123 Tech Street, Silicon Valley, CA 94000",
                website: "www.litehr.com",
                foundedYear: "2023",
                logo: null,
            },
            workingHours: {
                startTime: "09:00",
                endTime: "18:00",
                breakDuration: "60",
                workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                overtimeRate: "1.5x",
                gracePeriod: "15",
            }
        };
        res.json(settings || defaults);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateCompanySettingsController = async (req, res) => {
    try {
        const settings = await updateSettingsService("company_settings", req.body);
        res.json(settings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
