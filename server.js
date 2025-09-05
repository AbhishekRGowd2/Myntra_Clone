require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');


const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');


const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));



const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger config
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Myntra Clone API",
      version: "1.0.0",
      description: "API documentation for Myntra Clone backend",
    },
    servers: [
      {
        url: "https://myntra-clone-ulcv.onrender.com/api", // deployed on Render
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to your route files
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/", (req, res) => {
  res.send("✅ Myntra Clone Backend is running!");
});

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);


const PORT = process.env.PORT || 5000;
connectDB(process.env.MONGO_URI).then(() => {
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
});
