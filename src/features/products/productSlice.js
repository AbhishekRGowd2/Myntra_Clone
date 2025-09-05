import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api";

// ✅ Fetch products with query params
export const fetchProducts = createAsyncThunk(
  "product/fetch",
  async ({ page = 1, limit = 20, sort = "relevance" } = {}) => {
    const res = await API.get(`/products?sort=${sort}&page=${page}&limit=${limit}`);
    return res.data.products || res.data || [];
  }
);

// ✅ fetch single product by ID
export const fetchProductById = createAsyncThunk(
  "product/fetchById",
  async (id) => {
    const res = await API.get(`/products/${id}`);
    return res.data;
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    selectedProduct: null,
    status: "idle",
    error: null,
    page: 1,
    limit: 20,
    sort: "relevance",
    totalPages: 1
  },
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSort: (state, action) => {
      state.sort = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchProductById.pending, (state) => {
        state.status = "loading";
        state.selectedProduct = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setPage, setSort } = productSlice.actions;
export default productSlice.reducer;
