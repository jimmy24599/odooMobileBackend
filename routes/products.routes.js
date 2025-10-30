import express from 'express';
import { getProducts } from '../controllers/products.controller.js';
import { getWarehouses } from '../controllers/warehouses.controller.js';
import { getQuants } from '../controllers/quants.controller.js';
import { getPickings } from '../controllers/pickings.controller.js';
import { getStockMoves } from '../controllers/stockMoves.controller.js';
import { getStockMoveLines } from '../controllers/moveLines.controller.js';
import { getUom } from '../controllers/uom.controller.js';
import { getCategories } from '../controllers/categories.controller.js';
import { getStockPickingTypes } from '../controllers/pickingTypes.controller.js';
import { getLots } from '../controllers/lots.controller.js';
import { getInventory } from '../controllers/inventory.controller.js';
import { getInventoryLine } from '../controllers/inventoryLines.controller.js';
import { getLandedCosts } from '../controllers/landedCosts.controller.js';
import { getStockRules } from '../controllers/stockRules.controller.js';

const router = express.Router();

router.post('/get-products', getProducts);
router.post('/get-warehouses',getWarehouses);
router.post('/get-quants',getQuants);
router.post('/get-pickings',getPickings);
router.post('/stock-moves',getStockMoves);
router.post('/stock-move-lines',getStockMoveLines);
router.post('/get-uom',getUom);
router.post('/product-categories',getCategories);
router.post('/get-stock-picking',getStockPickingTypes);
router.post('/get-lots',getLots);
router.post('/get-inventory',getInventory);
router.post('/get-inventory-lines',getInventoryLine);
router.post('/landed-costs', getLandedCosts);
router.post('/stock-rules', getStockRules);



export default router;