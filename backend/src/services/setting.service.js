import { Setting } from "../models/index.js";

// Get settings by key
export const getSettingsService = async (key) => {
    const setting = await Setting.findOne({ where: { key } });
    return setting ? setting.value : null;
};

// Update or settings
export const updateSettingsService = async (key, value) => {
    const [setting, created] = await Setting.findOrCreate({
        where: { key },
        defaults: { value },
    });

    if (!created) {
        setting.value = value;
        await setting.save();
    }

    return setting.value;
};
