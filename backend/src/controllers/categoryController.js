import * as categoryService from "../services/categoryService.js";

export const createCategory = async (
    req,
    res
) => {

    try {

        const { name } = req.body;

        const category =
            await categoryService.createNewCategory(
                name
            );

        res.status(201).json({

            success: true,

            message: "Category created successfully.",

            data: category

        });

    }

    catch (error) {

        res.status(400).json({

            success: false,

            message: error.message

        });

    }

};

export const getCategories = async (
    req,
    res
) => {

    try {

        const categories =
            await categoryService.fetchCategories();

        res.status(200).json({

            success: true,

            data: categories

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

export const getCategoryById = async (
    req,
    res
) => {

    try {

        const category =
            await categoryService.fetchCategoryById(
                req.params.id
            );

        res.status(200).json({

            success: true,

            data: category

        });

    }

    catch (error) {

        res.status(404).json({

            success: false,

            message: error.message

        });

    }

};

export const updateCategory = async (
    req,
    res
) => {

    try {

        const { name } = req.body;

        const category =
            await categoryService.editCategory(

                req.params.id,

                name

            );

        res.status(200).json({

            success: true,

            message: "Category updated successfully.",

            data: category

        });

    }

    catch (error) {

        res.status(400).json({

            success: false,

            message: error.message

        });

    }

};

export const deleteCategory = async (
    req,
    res
) => {

    try {

        await categoryService.removeCategory(
            req.params.id
        );

        res.status(200).json({

            success: true,

            message: "Category deleted successfully."

        });

    }

    catch (error) {

        res.status(404).json({

            success: false,

            message: error.message

        });

    }

};