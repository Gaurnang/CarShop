import {
    getCatalogProducts,
    countCatalogProducts,
    getCatalogProductById as getCatalogProductByIdRepo
} from "../repositories/catalogRepository.js";

import {
    getVariantIdsFromSavedCars
} from "../repositories/savedCarRepository.js";

export const getCatalog = async (
    userId,
    filters
) => {

    let variantIds = [];

    // Apply compatibility filtering based on savedCarId OR explicit variantId
    if (filters.variantId) {
        variantIds.push(Number(filters.variantId));
    } else if (userId && filters.savedCarId) {

        const savedCarIds = filters.savedCarId

            .split(",")

            .map(id => Number(id.trim()))

            .filter(id => !Number.isNaN(id));

        variantIds = await getVariantIdsFromSavedCars(

            userId,

            savedCarIds

        );

        // Optional: reject invalid savedCarIds
        if (

            savedCarIds.length > 0 &&

            variantIds.length === 0

        ) {

            throw new Error(

                "Invalid saved car."

            );

        }

    }

    const products = await getCatalogProducts(

        filters,

        variantIds

    );

    const total = await countCatalogProducts(

        filters,

        variantIds

    );

    const page = Number(

        filters.page || 1

    );

    const limit = Number(

        filters.limit || 10

    );

    return {

        products,

        pagination: {

            page,

            limit,

            total,

            totalPages: Math.ceil(

                total / limit

            )

        }

    };

};

export const getCatalogProductById = async (
    id
) => {

    const product = await getCatalogProductByIdRepo(id);

    if (!product) {

        throw new Error(

            "Product not found."

        );

    }

    return product;

};