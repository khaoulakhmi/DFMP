import { Router } from "express";
import { LotController } from "./lot.controller";


const LotRouter = Router();


LotRouter.post('/', LotController.createLot);
LotRouter.put('/:id', LotController.updateLot);
LotRouter.delete('/:id', LotController.deleteLot);
LotRouter.get('/:id', LotController.getLotById);
LotRouter.get('/', LotController.getAllLots);

export default LotRouter;