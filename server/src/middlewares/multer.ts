import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (_req, file) => {
    const fileType = file.mimetype.startsWith("image") ? "images" : "videos";
    const uniqueFilename = `${Date.now()}-${file.originalname}`;
    return {
      folder: fileType,
      public_id: uniqueFilename,
      resource_type: file.mimetype.startsWith("image") ? "image" : "video",
    };
  },
});

const upload = multer({ storage }).fields([
  { name: "img", maxCount: 1 },
  { name: "video", maxCount: 1 },
]);

export default upload;
