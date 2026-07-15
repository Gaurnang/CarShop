import * as catalogService from "../services/catalogService.js";

export const getCatalog = async (
    req,
    res
) => {

    try {

        const data = await catalogService.getCatalog(

            req.user?.id,

            req.query

        );

        res.status(200).json({

            success: true,

            data

        });

    }

    catch (error) {

        res.status(400).json({

            success: false,

            message: error.message

        });

    }

};

export const getCatalogProductById = async (
    req,
    res
) => {

    try {

        const product = await catalogService.getCatalogProductById(

            req.params.id

        );

        res.status(200).json({

            success: true,

            data: product

        });

    }

    catch (error) {

        res.status(404).json({

            success: false,

            message: error.message

        });

    }

};