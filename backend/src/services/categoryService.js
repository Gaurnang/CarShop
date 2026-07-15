import {
    createCategory,
    getCategories,
    getCategoryById,
    getCategoryByName,
    updateCategory,
    deleteCategory
} from "../repositories/categoryRepository.js";

export const createNewCategory = async (
    name
) => {

    const existingCategory =
        await getCategoryByName(name);

    if (existingCategory) {

        throw new Error(
            "Category already exists."
        );

    }

    return await createCategory(name);

};

export const fetchCategories = async () => {

    return await getCategories();

};

export const fetchCategoryById = async (
    id
) => {

    const category =
        await getCategoryById(id);

    if (!category) {

        throw new Error(
            "Category not found."
        );

    }

    return category;

};

export const editCategory = async (
    id,
    name
) => {

    const category =
        await getCategoryById(id);

    if (!category) {

        throw new Error(
            "Category not found."
        );

    }

    const existingCategory =
        await getCategoryByName(name);

    if (
        existingCategory &&
        existingCategory.id !== Number(id)
    ) {

        throw new Error(
            "Category already exists."
        );

    }

    return await updateCategory(
        id,
        name
    );

};

export const removeCategory = async (
    id
) => {

    const category =
        await getCategoryById(id);

    if (!category) {

        throw new Error(
            "Category not found."
        );

    }

    await deleteCategory(id);

};