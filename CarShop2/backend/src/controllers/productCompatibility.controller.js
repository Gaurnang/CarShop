import {
  createCompatibility,
  fetchCompatibility,
} from "../services/productCompatibility.service.js";

const addProductCompatibility = async (
  req,
  res
) => {
  try {
    const { productId } = req.params;

    const { variantIds } = req.body;

    const compatibility =
      await createCompatibility(
        productId,
        variantIds
      );

    res.status(201).json({
      success: true,
      data: compatibility,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProductCompatibility = async (
  req,
  res
) => {
  try {
    const { productId } = req.params;

    const compatibility =
      await fetchCompatibility(
        productId
      );

    res.status(200).json({
      success: true,
      data: compatibility,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  addProductCompatibility,
  getProductCompatibility,
};