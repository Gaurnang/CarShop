import cloudinary
from "../config/cloudinary.js";

const uploadImage =
  async (
    buffer
  ) => {

    return new Promise(
      (
        resolve,
        reject
      ) => {

        const stream =
          cloudinary.uploader
            .upload_stream(

              {
                folder:
                  "carshop",
              },

              (
                error,
                result
              ) => {

                if (error) {
                  reject(error);
                }

                resolve(result);
              }
            );

        stream.end(buffer);
      }
    );

  };

export {
  uploadImage,
};