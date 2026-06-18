import express from "express";

import {
  addSavedCar,
  getSavedCars,
  removeSavedCar,
} from "../controllers/userSavedCar.controller.js";

const router = express.Router();

router.post("/:userId/saved-cars", addSavedCar);

router.get( "/:userId/saved-cars", getSavedCars);

router.delete( "/saved-cars/:savedCarId", removeSavedCar);

export default router;