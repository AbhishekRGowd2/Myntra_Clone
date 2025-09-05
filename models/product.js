const mongoose = require('mongoose');


const DimensionsSchema = new mongoose.Schema({
width: Number,
height: Number,
depth: Number,
}, { _id: false });


const MetaSchema = new mongoose.Schema({
barcode: String,
qrCode: String,
createdAt: Date,
updatedAt: Date,
}, { _id: false, strict: false });


const ReviewSchema = new mongoose.Schema({
    rating: Number,
    comment: String,
    date: Date,
    reviewerName: String,
    reviewerEmail: String,
  }, { _id: false, strict: false });
  
  const ProductSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true, index: true },
    title: String,
    description: String,
    price: Number,
    discountPercentage: Number,
    rating: Number,
    stock: Number,
    brand: String,
    category: String,
    thumbnail: String,
    images: [String],
    sku: String,
    weight: Number,
    dimensions: DimensionsSchema,
    warrantyInformation: String,
    shippingInformation: String,
    availabilityStatus: String,
    returnPolicy: String,
    minimumOrderQuantity: Number,
    meta: MetaSchema,
    tags: [String],
    reviews: [ReviewSchema],       // ✅ add this
  }, { timestamps: true });
  


module.exports = mongoose.model('Product', ProductSchema);