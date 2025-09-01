const Cart = require('../models/cart');
const Product = require('../models/product');

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ userId });
  if (!cart) cart = await Cart.create({ userId, items: [] });
  return cart;
}

// GET Cart
exports.getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await getOrCreateCart(userId);

    const ids = cart.items.map(i => i.productId);
    const products = await Product.find({ id: { $in: ids } }).lean();
    const productMap = new Map(products.map(p => [p.id, p]));

    const detailedItems = cart.items.map(i => ({
      product: productMap.get(i.productId),
      quantity: i.quantity,
      lineTotal: (productMap.get(i.productId)?.price || 0) * i.quantity,
    }));

    const total = detailedItems.reduce((sum, i) => sum + i.lineTotal, 0);

    res.json({ userId, items: detailedItems, total });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

// ADD item to cart
exports.addToCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity = 1 } = req.body;
    if (!productId) return res.status(400).json({ error: 'productId required' });

    const cart = await getOrCreateCart(userId);
    const idx = cart.items.findIndex(i => i.productId === Number(productId));

    if (idx > -1) {
      cart.items[idx].quantity += Number(quantity);
    } else {
      cart.items.push({ productId: Number(productId), quantity: Number(quantity) });
    }

    await cart.save();
    res.json(cart);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
};

// UPDATE item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity } = req.body;
    if (!productId) return res.status(400).json({ error: 'productId required' });
    if (quantity == null || quantity < 0) return res.status(400).json({ error: 'quantity required and must be >= 0' });

    const cart = await getOrCreateCart(userId);
    const idx = cart.items.findIndex(i => i.productId === Number(productId));
    if (idx === -1) return res.status(404).json({ error: 'Product not in cart' });

    if (quantity === 0) {
      cart.items.splice(idx, 1);
    } else {
      cart.items[idx].quantity = Number(quantity);
    }

    await cart.save();
    res.json(cart);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to update cart' });
  }
};

// REMOVE item from cart
exports.removeCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const cart = await getOrCreateCart(userId);

    const idx = cart.items.findIndex(i => i.productId === Number(productId));
    if (idx === -1) return res.status(404).json({ error: 'Product not in cart' });

    cart.items.splice(idx, 1);
    await cart.save();
    res.json(cart);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
};
