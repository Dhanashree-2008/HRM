import { Document, Employee } from "../models/index.js";
import path from "path";
import fs from "fs";

// Helper to format file size
const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const uploadDocument = async (req, res) => {
    try {
        const { employeeId, documentType, category, description, confidentialLevel, expiryDate } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Upload handling is done by multer middleware, but here we construct the URL
        // If memory storage (buffer), we need to write to disk. 
        // But let's assume `upload.middleware.js` uses diskStorage or we write it here.
        // Checking upload.middleware.js ... it was changed to memoryStorage in a previous turn!
        // So we need to write the buffer to disk.

        const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
        const uploadDir = path.join(process.cwd(), "public/uploads/vault");

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, filename);
        await fs.promises.writeFile(filePath, file.buffer);

        const fileUrl = `/uploads/vault/${filename}`;
        const fileSize = formatFileSize(file.size);

        // Find employee to get name if needed, or just rely on ID
        // const employee = await Employee.findByPk(employeeId); // optional

        const newDoc = await Document.create({
            employeeId,
            name: file.originalname,
            type: documentType,
            category,
            description,
            confidentialLevel,
            expiryDate: expiryDate || null,
            fileUrl,
            fileSize
        });

        res.status(201).json({
            success: true,
            message: "Document uploaded successfully",
            document: newDoc
        });

    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: "Failed to upload document", error: error.message });
    }
};

export const getAllDocuments = async (req, res) => {
    try {
        const { search, category, type } = req.query;
        // Build where clause
        const where = {};
        if (category && category !== "All") where.category = category;
        if (type) where.type = type;

        // Note: Searching by employee name requires a join (include Employee)

        const documents = await Document.findAll({
            where,
            include: [{
                model: Employee,
                as: 'employee',
                attributes: ['id', 'fullName', 'employeeCode', 'department'], // Updated attributes
            }],
            order: [["createdAt", "DESC"]]
        });

        res.json({ success: true, documents });
    } catch (error) {
        console.error("Fetch error:", error);
        res.status(500).json({ message: "Failed to fetch documents", error: error.message });
    }
};

export const getMyDocuments = async (req, res) => {
    try {
        const employeeId = req.user.employeeId; // Assuming auth middleware populates this

        if (!employeeId) {
            // If user is ADMIN, they might not have an employee ID, so just return empty docs or handle gracefully
            if (req.user.role === "ADMIN") {
                return res.json({ success: true, documents: [] });
            }
            console.error("getMyDocuments: Missing employeeId for user", req.user.id);
            return res.status(400).json({ message: "Employee ID not found for user. Please contact admin to link your account." });
        }

        const { search, category } = req.query;

        const where = { employeeId };
        if (category && category !== "all") where.category = category;
        // Search logic could be added here if needed, but frontend does client-side search currently.

        const documents = await Document.findAll({
            where,
            order: [["createdAt", "DESC"]]
        });

        res.json({ success: true, documents });
    } catch (error) {
        console.error("Fetch my documents error:", error);
        res.status(500).json({ message: "Failed to fetch your documents", error: error.message });
    }
};

export const getDocumentsByEmployeeIdController = async (req, res) => {
    try {
        const { employeeId } = req.params;
        if (!employeeId) return res.status(400).json({ message: "Employee ID required" });

        const where = { employeeId };
        const { category } = req.query;
        if (category && category !== "all") where.category = category;

        const documents = await Document.findAll({
            where,
            order: [["createdAt", "DESC"]]
        });

        res.json({ success: true, documents });
    } catch (error) {
        console.error("Fetch employee documents error:", error);
        res.status(500).json({ message: "Failed to fetch documents", error: error.message });
    }
};

export const deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const document = await Document.findByPk(id);

        if (!document) {
            return res.status(404).json({ message: "Document not found" });
        }

        // Delete file from disk
        if (document.fileUrl) {
            const filePath = path.join(process.cwd(), "public", document.fileUrl);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await document.destroy();

        res.json({ success: true, message: "Document deleted successfully" });
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ message: "Failed to delete document", error: error.message });
    }
};

export const getStats = async (req, res) => {
    try {
        const totalDocs = await Document.count();
        // Calculate storage used... (sum of bytes if we stored bytes, but we stored string "2.4 MB")
        // We can approximate or separate logic.

        // Group by category
        // const byCategory = await Document.findAll({
        //    attributes: ['category', [sequelize.fn('COUNT', sequelize.col('category')), 'count']],
        //    group: ['category']
        // });

        res.json({
            success: true,
            stats: {
                totalDocuments: totalDocs,
                // Add more real stats logic here
            }
        });
    } catch (error) {
        console.error("Stats error:", error);
        res.status(500).json({ message: "Failed to fetch stats" });
    }
};
