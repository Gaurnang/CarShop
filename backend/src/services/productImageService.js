import { getProductById } from "../repositories/productRepository.js";

import {
    saveProductImage,
    getMaxDisplayOrder
} from "../repositories/productImageRepository.js";

import {
    uploadImage
} from "./cloudinaryService.js";




export const uploadProductImages = async (
    productId,
    files
) => {

    const product =
        await getProductById(productId);

    if (!product) {

        throw new Error("Product not found");

    }

    const maxDisplayOrder =
        await getMaxDisplayOrder(productId);

    const uploadedImages = [];

    for (let i = 0; i < files.length; i++) {

        const file = files[i];

        const result =
            await uploadImage(file.buffer);

        const image =
            await saveProductImage(

                productId,

                result.secure_url,

                result.public_id,

                maxDisplayOrder + i + 1

            );

        uploadedImages.push(image);

    }

    return uploadedImages;

};