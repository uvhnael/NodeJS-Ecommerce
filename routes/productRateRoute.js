import express from 'express';
import { getOrderItemIdByCustomer, addRate, getRate, getRateByCustomer } from '../controller/productRateController.js';

const route = express.Router();

route.post('', addRate); // Corrected line
route.get('/:product_id', getRate);
route.get('/getOrderItemIdByCustomer/:customer_id', getOrderItemIdByCustomer);
route.get('/getRateByCustomer/:customer_id', getRateByCustomer);

export default route;
