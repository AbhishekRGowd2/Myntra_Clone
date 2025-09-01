require('dotenv').config();
const axios = require("axios");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Product = require("../models/product"); // adjust path
const connectDB = require("../config/db");
const BASE = 'https://dummyjson.com/products';
const BATCH_SIZE = 100; // DummyJSON supports limit/skip; total is ~194


function mapProduct(p) {
return {
id: p.id,
title: p.title,
description: p.description,
price: p.price,
discountPercentage: p.discountPercentage,
rating: p.rating,
stock: p.stock,
brand: p.brand,
category: p.category,
thumbnail: p.thumbnail,
images: p.images || [],
sku: p.sku,
weight: p.weight,
dimensions: p.dimensions,
warrantyInformation: p.warrantyInformation,
shippingInformation: p.shippingInformation,
availabilityStatus: p.availabilityStatus,
returnPolicy: p.returnPolicy,
minimumOrderQuantity: p.minimumOrderQuantity,
meta: p.meta,
};
}


async function fetchBatch(skip) {
const { data } = await axios.get(`${BASE}?limit=${BATCH_SIZE}&skip=${skip}`);
return { products: data.products || [], total: data.total || 0 };
}


async function run() {
await connectDB(process.env.MONGO_URI);


let skip = 0;
let upserts = 0;
let total = Infinity;


while (skip < total) {
const { products, total: t } = await fetchBatch(skip);
total = t || products.length; // fallback


for (const p of products) {
const doc = mapProduct(p);
const result = await Product.updateOne(
{ id: doc.id },
{ $set: doc },
{ upsert: true }
);
if (result.upsertedCount || result.modifiedCount) upserts++;
}


console.log(`Processed batch skip=${skip}, cumulative upserts/updates=${upserts}`);
skip += BATCH_SIZE;
}


console.log(`✅ Seeding complete. Upserts/updates: ${upserts}`);
process.exit(0);
}


run().catch((e) => {
console.error('❌ Seed error:', e);
process.exit(1);
});