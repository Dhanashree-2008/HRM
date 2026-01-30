import { uploadBuffer } from "../services/cloudinary.service.js";

export const uploadImageController = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Convert buffer to upload
        const result = await uploadBuffer(req.file.buffer, {
            folder: process.env.CLOUDINARY_FOLDER || "litehr/uploads",
        });

        res.json({ secure_url: result.secure_url });
    } catch (error) {
        console.error("Image upload failed:", error);
        res.status(500).json({ message: error.message || "Image upload failed" });
    }
};
