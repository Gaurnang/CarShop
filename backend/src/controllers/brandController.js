import {
  addBrand,
  editBrand,
  fetchBrand,
  fetchBrands,
  removeBrand,
} from "../services/brandService.js";

export const create = async (req, res) => {
  try {
    const { name } = req.body;

    const brand = await addBrand(name);

    res.status(201).json({
      success: true,
      data: brand,
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
    const brands = await fetchBrands();

    res.json({
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

export const getOne = async (req, res) => {
  try {
    const brand = await fetchBrand(req.params.id);

    res.json({
      success: true,
      data: brand,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const update = async (req, res) => {
  try {
    const brand = await editBrand(
      req.params.id,
      req.body.name
    );

    res.json({
      success: true,
      data: brand,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const remove = async (req, res) => {
  try {
    await removeBrand(req.params.id);

    res.json({
      success: true,
      message: "Brand deleted successfully",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};