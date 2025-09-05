const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");

const productController = require("../controller/productController");

// Mock model
jest.mock("../models/product");

const Product = require("../models/product");

const app = express();
app.use(bodyParser.json());

// Routes for testing
app.get("/api/products", productController.getProducts);
app.get("/api/products/:id", productController.getProductById);

describe("Product Controller", () => {
    let mockProducts;
    let mockQuery;
    let mockFindOneQuery;

    beforeEach(() => {
        console.log('Setting up mocks...');

        // Mock product data
        mockProducts = [
            {
                id: 1,
                title: "Test Product 1",
                price: 100,
                category: "electronics",
                brand: "test-brand",
                rating: 4.5,
                createdAt: "2025-09-05T05:41:47.844Z",
            },
            {
                id: 2,
                title: "Test Product 2",
                price: 200,
                category: "clothing",
                brand: "test-brand-2",
                rating: 3.8,
                createdAt: "2025-09-05T05:41:47.844Z",
            },
        ];

        // Create a mock query object with chainable methods for find
        mockQuery = {
            sort: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue(mockProducts),
        };

        // Create a mock query object with chainable methods for findOne
        mockFindOneQuery = {
            lean: jest.fn().mockResolvedValue(mockProducts[0]),
        };

        // Mock the Product methods
        Product.find.mockReturnValue(mockQuery);
        Product.countDocuments.mockResolvedValue(2);
        Product.findOne.mockReturnValue(mockFindOneQuery);

        console.log('Mocks set up complete');
    });


    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /api/products", () => {
        test("should return products with default parameters", async () => {
            console.log('Product.find mock implementation:', Product.find.getMockImplementation?.());
            console.log('Product.countDocuments mock implementation:', Product.countDocuments.getMockImplementation?.());

            const res = await request(app).get("/api/products");

            console.log('Response status:', res.status);
            console.log('Response body:', JSON.stringify(res.body, null, 2));

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                page: 1,
                limit: 20,
                total: 2,
                products: mockProducts,
            });
        });

        test("should filter products by search query", async () => {
            const filteredProducts = [mockProducts[0]];
            mockQuery.lean.mockResolvedValueOnce(filteredProducts);
            Product.countDocuments.mockResolvedValueOnce(1);

            const res = await request(app).get("/api/products?q=test");

            expect(res.status).toBe(200);
            expect(res.body.products).toHaveLength(1);
        });

        test("should filter products by category", async () => {
            const filteredProducts = [mockProducts[0]];
            mockQuery.lean.mockResolvedValueOnce(filteredProducts);
            Product.countDocuments.mockResolvedValueOnce(1);

            const res = await request(app).get("/api/products?category=electronics");

            expect(res.status).toBe(200);
            expect(res.body.products).toHaveLength(1);
        });

        test("should filter products by price range", async () => {
            const filteredProducts = [mockProducts[0]];
            mockQuery.lean.mockResolvedValueOnce(filteredProducts);
            Product.countDocuments.mockResolvedValueOnce(1);

            const res = await request(app).get("/api/products?minPrice=50&maxPrice=150");

            expect(res.status).toBe(200);
            expect(res.body.products).toHaveLength(1);
        });

        test("should sort products by price descending", async () => {
            const res = await request(app).get("/api/products?sort=price_desc");

            expect(res.status).toBe(200);
            expect(res.body.products).toHaveLength(2);
            expect(mockQuery.sort).toHaveBeenCalledWith({ price: -1 });
        });

        test("should handle pagination", async () => {
            const singleProduct = [mockProducts[0]];
            mockQuery.lean.mockResolvedValueOnce(singleProduct);
            Product.countDocuments.mockResolvedValueOnce(21);

            const res = await request(app).get("/api/products?page=2&limit=20");

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                page: 2,
                limit: 20,
                total: 21,
                products: singleProduct,
            });
            expect(mockQuery.skip).toHaveBeenCalledWith(20);
            expect(mockQuery.limit).toHaveBeenCalledWith(20);
        });

        test("should handle database errors", async () => {
            mockQuery.lean.mockRejectedValueOnce(new Error("Database error"));

            const res = await request(app).get("/api/products");

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: "Failed to fetch products", details: "Database error" });
        });
    });

    describe("GET /api/products/:id", () => {
        test("should return product by id", async () => {
            const res = await request(app).get("/api/products/1");

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockProducts[0]);
            expect(Product.findOne).toHaveBeenCalledWith({ id: 1 });
        });

        test("should return 404 for non-existent product", async () => {
            // Mock findOne to return null
            mockFindOneQuery.lean.mockResolvedValueOnce(null);

            const res = await request(app).get("/api/products/999");

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: "Product not found" });
        });

        test("should handle database errors", async () => {
            // Mock findOne to reject
            mockFindOneQuery.lean.mockRejectedValueOnce(new Error("Database error"));

            const res = await request(app).get("/api/products/1");

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: "Failed to fetch product", details: "Database error" });
        });

        test("should handle invalid id parameter", async () => {
            // Mock findOne to return null for invalid IDs
            Product.findOne.mockImplementationOnce((query) => {
                if (isNaN(query.id)) {
                    return {
                        lean: jest.fn().mockResolvedValue(null)
                    };
                }
                return mockFindOneQuery;
            });

            const res = await request(app).get("/api/products/invalid");

            expect(res.status).toBe(404); // Should be 404, not 500
            expect(res.body).toEqual({ error: "Product not found" });
        });
    });
});