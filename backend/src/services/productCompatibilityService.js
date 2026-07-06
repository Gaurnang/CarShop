import {
    addCompatibility,
    compatibilityExists,
    getCompatibleVariants,
    removeCompatibility
}
from "../repositories/productCompatibilityRepository.js";

import {
    getProductById
}
from "../repositories/productRepository.js";

import {
    getVariantById
}
from "../repositories/variantRepository.js";

export const assignCompatibility = async (
    productId,
    variantIds
) => {

    const product =
        await getProductById(productId);

    if(!product){
        throw new Error("Product not found");
    }

    for(const variantId of variantIds){

        const variant =
            await getVariantById(variantId);

        if(!variant){
            throw new Error(
                `Variant ${variantId} not found`
            );
        }

        const exists =
            await compatibilityExists(
                productId,
                variantId
            );

        if(!exists){

            await addCompatibility(
                productId,
                variantId
            );

        }

    }

};

export const fetchCompatibility = async (
    productId
) => {

    const product =
        await getProductById(productId);

    if(!product){
        throw new Error("Product not found");
    }

    return await getCompatibleVariants(
        productId
    );

};

export const deleteCompatibility = async (
    productId,
    variantId
) => {

    await removeCompatibility(
        productId,
        variantId
    );

};