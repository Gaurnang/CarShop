import {
    assignCompatibility,
    fetchCompatibility,
    deleteCompatibility
}
from "../services/productCompatibilityService.js";

export const addVariants = async (
    req,
    res
) => {

    try{

        const { variantIds } = req.body;

        await assignCompatibility(
            req.params.productId,
            variantIds
        );

        res.json({
            success:true,
            message:
                "Compatibility added successfully"
        });

    }
    catch(error){

        res.status(400).json({
            success:false,
            message:error.message
        });

    }

};

export const getVariants = async (
    req,
    res
) => {

    try{

        const data =
            await fetchCompatibility(
                req.params.productId
            );

        res.json({
            success:true,
            data
        });

    }
    catch(error){

        res.status(404).json({
            success:false,
            message:error.message
        });

    }

};

export const removeVariant = async (
    req,
    res
) => {

    try{

        await deleteCompatibility(
            req.params.productId,
            req.params.variantId
        );

        res.json({
            success:true,
            message:
            "Compatibility removed"
        });

    }
    catch(error){

        res.status(400).json({
            success:false,
            message:error.message
        });

    }

};