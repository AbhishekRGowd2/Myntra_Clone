const mongoose = require('mongoose');


async function connectDB(uri) {
mongoose.set('strictQuery', true);
await mongoose.connect(uri, { dbName: 'myntra' });
console.log('✅ MongoDB connected');
}


module.exports = connectDB;