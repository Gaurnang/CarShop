import {
  addVariant,
  editVariant,
  fetchVariant,
  fetchVariants,
  fetchVariantsByModel,
  removeVariant,
} from "../services/variantService.js";

export const create = async (req, res) => {
  try {

    const { name, modelId } = req.body;

    const variant =
      await addVariant(
        name,
        modelId
      );

    res.status(201).json({
      success: true,
      data: variant,
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};

export const getAll = async (req, res) => {
  try {

    const variants =
      await fetchVariants();

    res.json({
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

export const getOne = async (req, res) => {
  try {

    const variant =
      await fetchVariant(
        req.params.id
      );

    res.json({
      success: true,
      data: variant,
    });

  } catch (error) {

    res.status(404).json({
      success: false,
      message: error.message,
    });

  }
};

export const getByModel = async (
  req,
  res
) => {

  try {

    const variants =
      await fetchVariantsByModel(
        req.params.modelId
      );

    res.json({
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

export const update = async (
  req,
  res
) => {

  try {

    const { name, modelId } =
      req.body;

    const variant =
      await editVariant(
        req.params.id,
        name,
        modelId
      );

    res.json({
      success: true,
      data: variant,
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }

};

export const remove = async (
  req,
  res
) => {

  try {

    await removeVariant(
      req.params.id
    );

    res.json({
      success: true,
      message:
        "Variant deleted successfully",
    });

  } catch (error) {

    res.status(404).json({
      success: false,
      message: error.message,
    });

  }

};