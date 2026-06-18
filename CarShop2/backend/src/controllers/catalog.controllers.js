import {
  fetchCatalog,
} from "../services/catalog.service.js";

const getCatalog =
  async (req, res) => {

    try {

      const { userId } =
        req.params;

      const products =
        await fetchCatalog(userId);

      res.status(200).json({
        success: true,
        count: products.length,
        data: products,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  };

export {
  getCatalog,
};