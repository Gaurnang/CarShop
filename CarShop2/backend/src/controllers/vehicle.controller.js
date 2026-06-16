import {
  fetchBrands,
  fetchModelsByBrandId,
  fetchVariantsByModelId,
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