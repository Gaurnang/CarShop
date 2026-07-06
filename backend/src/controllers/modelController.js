import {
  addModel,
  editModel,
  fetchModel,
  fetchModels,
  fetchModelsByBrand,
  removeModel,
} from "../services/modelService.js";

export const create = async (req, res) => {
  try {

    const { name, brandId } = req.body;

    const model =
      await addModel(name, brandId);

    res.status(201).json({
      success: true,
      data: model,
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

    const models =
      await fetchModels();

    res.json({
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

export const getOne = async (req, res) => {
  try {

    const model =
      await fetchModel(req.params.id);

    res.json({
      success: true,
      data: model,
    });

  } catch (error) {

    res.status(404).json({
      success: false,
      message: error.message,
    });

  }
};

export const getByBrand = async (
  req,
  res
) => {

  try {

    const models =
      await fetchModelsByBrand(
        req.params.brandId
      );

    res.json({
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

export const update = async (
  req,
  res
) => {

  try {

    const { name, brandId } = req.body;

    const model =
      await editModel(
        req.params.id,
        name,
        brandId
      );

    res.json({
      success: true,
      data: model,
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

    await removeModel(
      req.params.id
    );

    res.json({
      success: true,
      message:
        "Model deleted successfully",
    });

  } catch (error) {

    res.status(404).json({
      success: false,
      message: error.message,
    });

  }

};