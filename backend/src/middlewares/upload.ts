import multer from 'multer';
import cloudinary from '../cloudinary.js';
import type { Request, Response, NextFunction } from 'express';
import type { UploadApiResponse } from "cloudinary";

export const upload = multer({ storage: multer.memoryStorage() });

export const uploadImage = async (req:Request, res: Response , next: NextFunction ) =>{
  try{
    if (!req.file) {
       return res.status(400).json({ message: "Debes enviar una foto" });
    }            
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({
       folder: "mis_imagenes", 
       resource_type: "image",
    },
    (error, result) => {
       if (error) return reject(error);
          resolve(result as UploadApiResponse);
        });
        stream.end(req.file?.buffer);
    });    
    (req as any).cloudinaryImage = {
        url: result.secure_url,
        public_id: result.public_id
    };
    next();
  } catch (err) {    
    return res.status(500).json({ error: "Error subiendo la imagen" });
  }
}

export const uploadDoc = async (req:Request, res: Response , next: NextFunction ) =>{
  try{
    if (!req.file) {
       return res.status(400).json({ message: "Debes subir un documento." });
    }            
    const originalName = req.file.originalname;
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({
      folder: "mis_documentos", 
      resource_type: "raw",
      use_filename: true,
      unique_filename: false,
      filename_override: originalName,
    },
    (error, result) => {
       if (error) return reject(error);
          resolve(result as UploadApiResponse);
        });
        stream.end(req.file?.buffer);
    });    
    (req as any).cloudinaryImage = {
        url: result.secure_url,
        public_id: result.public_id,
        filename: result.original_filename 
    };
    next();
  } catch (err) {    
    return res.status(500).json({ error: "Error subiendo documento." });
  }
}
