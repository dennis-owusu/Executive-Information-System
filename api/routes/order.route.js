import express from 'express'

const router = express.Router()

import { createOrder, getOrders, getOrder, updateOrder, deleteOrder, getOrdersByUser, getOutletOrders, verifyMomoPayment, verifyPayment, getMyOrders } from '../controllers/order.controller.js'
import { verifyToken } from '../utils/verifyUser.js'

router.post('/createOrder', createOrder);
router.post('/verify-payment', verifyToken, verifyPayment);
router.get('/getOrders', getOrders);
router.get('/getOrder/:id', getOrder);
router.put('/updateOrder/:id', updateOrder);
router.delete('/deleteOrder/:id', deleteOrder);
router.get('/getOrdersByUser/:id', getOrdersByUser);
router.get('/getMyOrders', verifyToken, getMyOrders);
router.get('/getOutletOrders/:outletId', getOutletOrders);
router.post('/verify-momo-payment/:transactionId', verifyMomoPayment);


export default router