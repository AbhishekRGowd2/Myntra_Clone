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


const ProductSchema = new mongoose.Schema({
// Keep a numeric `id` so your frontend can keep using product.id
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
}, { timestamps: true });


module.exports = mongoose.model('Product', ProductSchema);