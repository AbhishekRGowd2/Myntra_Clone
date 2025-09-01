const express = require('express');
const router = express.Router();
const cartController = require('../controller/cartController');

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Cart management endpoints
 */

/**
 * @swagger
 * /cart/{userId}:
 *   get:
 *     summary: Get user cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User cart fetched successfully
 *       500:
 *         description: Failed to fetch cart
 */
router.get('/:userId', cartController.getCart);

/**
 * @swagger
 * /cart/{userId}/add:
 *   post:
 *     summary: Add product to cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: number
 *               quantity:
 *                 type: number
 *             required:
 *               - productId
 *     responses:
 *       200:
 *         description: Product added to cart
 *       400:
 *         description: Bad request
 */
router.post('/:userId/add', cartController.addToCart);

/**
 * @swagger
 * /cart/{userId}/update:
 *   put:
 *     summary: Update product quantity in cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: number
 *               quantity:
 *                 type: number
 *             required:
 *               - productId
 *               - quantity
 *     responses:
 *       200:
 *         description: Cart updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Product not in cart
 */
router.put('/:userId/update', cartController.updateCartItem);

/**
 * @swagger
 * /cart/{userId}/remove/{productId}:
 *   delete:
 *     summary: Remove product from cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: number
 *         description: Product ID to remove
 *     responses:
 *       200:
 *         description: Product removed from cart
 *       404:
 *         description: Product not in cart
 */
router.delete('/:userId/remove/:productId', cartController.removeCartItem);

module.exports = router;
