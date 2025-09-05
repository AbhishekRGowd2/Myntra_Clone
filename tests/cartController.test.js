const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");

const cartController = require("../controller/cartController");

// Mock models
jest.mock("../models/cart");
jest.mock("../models/product");

const Cart = require("../models/cart");
const Product = require("../models/product");

const app = express();
app.use(bodyParser.json());

// Routes for testing
app.get("/cart/:userId", cartController.getCart);
app.post("/cart/:userId/add", cartController.addToCart);
app.put("/cart/:userId/update", cartController.updateCartItem);
app.delete("/cart/:userId/remove/:productId", cartController.removeCartItem);

describe("Cart Controller", () => {
  let mockCart;

  beforeEach(() => {
    mockCart = {
      userId: "123",
      items: [],
      total: 0,
      save: jest.fn().mockResolvedValue(true),
    };

    // Mock Product.find to return an object with lean() method
    Product.find.mockImplementation(() => ({
      lean: jest.fn().mockResolvedValue([]) // lean() returns a promise with empty array
    }));
    
    // Mock Cart.findOne to return null (no cart found)
    Cart.findOne.mockResolvedValue(null);
    
    // Mock Cart.create to return a proper cart object
    Cart.create.mockImplementation((data) => {
      return Promise.resolve({
        ...data, // Include the userId and items from the creation data
        save: jest.fn().mockResolvedValue(true),
        _id: 'mock-cart-id'
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("GET /cart/:userId should return empty cart", async () => {
    const res = await request(app).get("/cart/123");

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      userId: "123",
      items: [],
      total: 0,
    });
  });

  test("POST /cart/:userId should add item", async () => {
    // For POST, we need to mock Cart.findOne to return the mockCart
    Cart.findOne.mockResolvedValueOnce(mockCart);
    
    const res = await request(app)
      .post("/cart/123/add")
      .send({ productId: 1, quantity: 2 });
  
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(1);
  });
  
  test("PUT /cart/:userId should update item quantity", async () => {
    mockCart.items = [{ productId: 1, quantity: 1 }];
    Cart.findOne.mockResolvedValueOnce(mockCart);
  
    const res = await request(app)
      .put("/cart/123/update")
      .send({ productId: 1, quantity: 5 });
  
    expect(res.status).toBe(200);
    expect(res.body.items[0].quantity).toBe(5);
  });
  
  test("DELETE /cart/:userId/:productId should remove item", async () => {
    mockCart.items = [{ productId: 1, quantity: 2 }];
    Cart.findOne.mockResolvedValueOnce(mockCart);
  
    const res = await request(app).delete("/cart/123/remove/1");
  
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(0);
  });
});
