import {
  fetchCatalog,
  fetchCatalogForCar,
} from "../services/catalogService.js";

export const getAllProducts = async (
  req,
  res
) => {

  try {

    const products =
      await fetchCatalog(
        req.user.id
      );

    res.json({
      success: true,
      data: products,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

export const getProductsBySavedCar = async (
  req,
  res
) => {

  try {

    const products =
      await fetchCatalogForCar(
        req.user.id,
        req.params.savedCarId
      );

    res.json({
      success: true,
      data: products,
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }

};