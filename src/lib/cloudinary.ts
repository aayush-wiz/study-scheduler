import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

// Define transformation type
interface ImageTransformation {
  width?: number;
  height?: number;
  crop?: string;
  gravity?: string;
  quality?: string | number;
  [key: string]: unknown;
}

/**
 * Upload an image to Cloudinary
 * @param file Buffer of the image file
 * @param options Upload options
 * @returns Cloudinary upload response
 */
export const uploadToCloudinary = async (
  buffer: Buffer,
  options: {
    folder?: string;
    public_id?: string;
    transformation?: ImageTransformation;
  } = {}
) => {
  // Return a promise that resolves with the upload result
  return new Promise((resolve, reject) => {
    // Upload options
    const uploadOptions = {
      folder: options.folder || "study-scheduler/profile-images",
      public_id: options.public_id,
      transformation: options.transformation,
      overwrite: true,
    };

    // Upload stream
    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    // Convert buffer to stream and pipe to uploadStream
    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);
    readableStream.pipe(uploadStream);
  });
};

/**
 * Delete an image from Cloudinary
 * @param publicId Public ID of the image
 * @returns Cloudinary delete response
 */
export const deleteFromCloudinary = async (publicId: string) => {
  return cloudinary.uploader.destroy(publicId);
};
