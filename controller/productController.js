// const Product = require('../models/product');

// // GET /api/products
// exports.getProducts = async (req, res) => {
//   try {
//     const {
//       q,
//       category,
//       brand,
//       minPrice,
//       maxPrice,
//       sort = 'relevance',
//       page = 1,
//       limit = 20,
//     } = req.query;

//     const filter = {};
//     if (q) filter.title = { $regex: q, $options: 'i' };
//     if (category) filter.category = category;
//     if (brand) filter.brand = brand;
//     if (minPrice || maxPrice) {
//       filter.price = {};
//       if (minPrice) filter.price.$gte = Number(minPrice);
//       if (maxPrice) filter.price.$lte = Number(maxPrice);
//     }

//     const sortMap = {
//       price_asc: { price: 1 },
//       price_desc: { price: -1 },
//       rating_desc: { rating: -1 },
//       newest: { createdAt: -1 },
//       relevance: {},
//     };

//     const skip = (Number(page) - 1) * Number(limit);

//     const [items, total] = await Promise.all([
//       Product.find(filter)
//         .sort(sortMap[sort] || {})
//         .skip(skip)
//         .limit(Number(limit))
//         .lean(),
//       Product.countDocuments(filter),
//     ]);

//     const products = items.map(({ _id, __v, ...rest }) => rest);

//     res.json({
//       page: Number(page),
//       limit: Number(limit),
//       total,
//       products,
//     });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: 'Failed to fetch products' });
//   }
// };

// // GET /api/products/:id
// exports.getProductById = async (req, res) => {
//   try {
//     const id = Number(req.params.id);
//     const p = await Product.findOne({ id }).lean();
//     if (!p) return res.status(404).json({ error: 'Product not found' });

//     const { _id, __v, ...rest } = p;
//     res.json(rest);
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: 'Failed to fetch product' });
//   }
// };



const Product = require('../models/product');

// GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const {
      q,
      category,
      brand,
      minPrice,
      maxPrice,
      sort = 'relevance',
      page = 1,
      limit = 20,
    } = req.query;

    console.log('GET /api/products query params:', req.query);

    const filter = {};
    if (q) filter.title = { $regex: q, $options: 'i' };
    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    console.log('Applied filter:', filter);

    const sortMap = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      rating_desc: { rating: -1 },
      newest: { createdAt: -1 },
      relevance: {},
    };

    const sortOption = sortMap[sort] || {};
    console.log('Sort option:', sortOption);

    const skip = (Number(page) - 1) * Number(limit);
    console.log('Pagination - skip:', skip, 'limit:', Number(limit));

    const [items, total] = await Promise.all([
      Product.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Product.countDocuments(filter),
    ]);

    console.log('Found items:', items);
    console.log('Total count:', total);

    const products = items.map(({ _id, __v, ...rest }) => rest);

    res.json({
      page: Number(page),
      limit: Number(limit),
      total,
      products,
    });
  } catch (e) {
    console.error('Error in getProducts:', e);
    console.error('Error stack:', e.stack);
    res.status(500).json({ error: 'Failed to fetch products', details: e.message });
  }
};

// GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    console.log('GET /api/products/:id - id:', id, 'type:', typeof id);

    const p = await Product.findOne({ id }).lean();
    console.log('Found product:', p);

    if (!p) {
      console.log('Product not found for id:', id);
      return res.status(404).json({ error: 'Product not found' });
    }

    const { _id, __v, ...rest } = p;
    console.log('Returning product:', rest);
    
    res.json(rest);
  } catch (e) {
    console.error('Error in getProductById:', e);
    console.error('Error stack:', e.stack);
    res.status(500).json({ error: 'Failed to fetch product', details: e.message });
  }
};