// src/services/cloudinary.service.js
import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadBuffer = (buffer, options = {}) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      return resolve(result);
    });
    stream.end(buffer);
  });

export const destroyResource = (publicId) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });