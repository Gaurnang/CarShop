import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const uploadImage = (buffer) => {

    return new Promise((resolve, reject) => {

        const uploadStream = cloudinary.uploader.upload_stream(

            {
                folder: "carshop/products"
            },

            (error, result) => {

                if (error) {

                    return reject(error);

                }

                resolve(result);

            }

        );

        streamifier
            .createReadStream(buffer)
            .pipe(uploadStream);

    });

};