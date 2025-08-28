import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProducts = createAsyncThunk("product/fetch", async () => {
  const res = await axios.get("https://dummyjson.com/products"); // Replace with your API
  return res.data.products;
});

const productSlice = createSlice({
  name: "product",
  initialState: { products: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.products = action.payload;
    });
  },
});

export default productSlice.reducer;
