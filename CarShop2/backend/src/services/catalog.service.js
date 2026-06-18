import {
  getCatalogByUserId,
} from "../repositories/catalog.repository.js";

const fetchCatalog =
  async (userId) => {

    return await getCatalogByUserId(
      userId
    );

  };

export {
  fetchCatalog,
};