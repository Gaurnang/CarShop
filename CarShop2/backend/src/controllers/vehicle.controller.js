import {
  fetchBrands,
  fetchModelsByBrandId,
  fetchVariantsByModelId,
} from "../services/vehicle.service.js";

import {
  addBrand,
  editBrand,
  removeBrand,

  addModel,
  editModel,
  removeModel,

  addVariant,
  editVariant,
  removeVariant,
} from "../services/vehicle.service.js";

export const getBrands = async (req, res) => {
  try {
    const brands = await fetchBrands();

    res.status(200).json({
      success: true,
      data: brands,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getModelsByBrandId = async (req, res) => {
  try {
    const { brandId } = req.params;

    const models = await fetchModelsByBrandId(brandId);

    res.status(200).json({
      success: true,
      data: models,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getVariantsByModelId = async (
  req,
  res
) => {
  try {
    const { modelId } = req.params;

    const variants =
      await fetchVariantsByModelId(modelId);

    res.status(200).json({
      success: true,
      data: variants,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createBrand = async (
  req,
  res
) => {

  try {

    const { name } =
      req.body;

    const brand =
      await addBrand(name);

    res.status(201).json({
      success: true,
      data: brand,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const updateBrand = async (
  req,
  res
) => {

  try {

    const { brandId } =
      req.params;

    const { name } =
      req.body;

    const brand =
      await editBrand(
        brandId,
        name
      );

    res.status(200).json({
      success: true,
      data: brand,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const deleteBrand = async (
  req,
  res
) => {

  try {

    await removeBrand(
      req.params.brandId
    );

    res.status(200).json({
      success: true,
      message:
        "Brand deleted",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const createModel = async (
  req,
  res
) => {

  try {

    const { brandId } =
      req.params;

    const { name } =
      req.body;

    const model =
      await addModel(
        brandId,
        name
      );

    res.status(201).json({
      success: true,
      data: model,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

export const updateModel = async (
  req,
  res
) => {

  try {

    const { modelId } =
      req.params;

    const { name } =
      req.body;

    const model =
      await editModel(
        modelId,
        name
      );

    res.status(200).json({
      success: true,
      data: model,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

export const deleteModel = async (
  req,
  res
) => {

  try {

    await removeModel(
      req.params.modelId
    );

    res.status(200).json({
      success: true,
      message:
        "Model deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

export const createVariant = async (
  req,
  res
) => {

  try {

    const { modelId } =
      req.params;

    const { name } =
      req.body;

    const variant =
      await addVariant(
        modelId,
        name
      );

    res.status(201).json({
      success: true,
      data: variant,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

export const updateVariant = async (
  req,
  res
) => {

  try {

    const { variantId } =
      req.params;

    const { name } =
      req.body;

    const variant =
      await editVariant(
        variantId,
        name
      );

    res.status(200).json({
      success: true,
      data: variant,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

export const deleteVariant = async (
  req,
  res
) => {

  try {

    await removeVariant(
      req.params.variantId
    );

    res.status(200).json({
      success: true,
      message:
        "Variant deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

