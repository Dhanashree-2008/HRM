import axios from "axios";

/**
 * Uploads an image file to the backend, which handles Cloudinary upload
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} - The secure URL of the uploaded image
 */
export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("token");

    try {
        const response = await axios.post("/api/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`
            },
        });

        return response.data.secure_url;
    } catch (error) {
        console.error("Image upload failed:", error);
        throw new Error(error.response?.data?.message || "Upload failed");
    }
};
