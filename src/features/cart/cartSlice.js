// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import API from "../../api";

// // ✅ Fetch user cart
// export const fetchCart = createAsyncThunk("cart/fetch", async (userId) => {
//   const res = await API.get(`/cart/${userId}`);
//   return res.data;
// });

// // ✅ Add product to cart
// export const addToCartAPI = createAsyncThunk(
//   "cart/add",
//   async ({ userId, product }) => {
//     const res = await API.post(`/cart/${userId}/add`, { productId: product.id });
//     return res.data;
//   }
// );

// // ✅ Update cart (quantity changes)
// export const updateCartAPI = createAsyncThunk(
//   "cart/update",
//   async ({ userId, productId, quantity }) => {
//     const res = await API.put(`/cart/${userId}/update`, { productId, quantity });
//     return res.data;
//   }
// );

// // ✅ Remove product
// export const removeFromCartAPI = createAsyncThunk(
//   "cart/remove",
//   async ({ userId, productId }) => {
//     await API.delete(`/cart/${userId}/remove/${productId}`);
//     return productId;
//   }
// );

// const cartSlice = createSlice({
//   name: "cart",
//   initialState: { items: [] },
//   reducers: {
//     // ✅ Local updates for immediate UI feedback
//     addToCartLocal: (state, action) => {
//       const product = action.payload.product;
//       const exists = state.items.find((i) => i.id === product.id);
//       if (exists) {
//         exists.quantity += 1;
//       } else {
//         state.items.push({ ...product, quantity: 1 });
//       }
//     },
//     updateCartLocal: (state, action) => {
//       const { productId, quantity } = action.payload;
//       const item = state.items.find((i) => i.id === productId);
//       if (item) item.quantity = quantity;
//     },
//     removeFromCartLocal: (state, action) => {
//       const productId = action.payload;
//       state.items = state.items.filter((i) => i.id !== productId);
//     },
//     incrementQuantity: (state, action) => {},
//     decrementQuantity: (state, action) => {},
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchCart.fulfilled, (state, action) => {
//         state.items = action.payload.items || [];
//       })
//       .addCase(addToCartAPI.fulfilled, (state, action) => {
//         state.items = action.payload.items;
//       })
//       .addCase(updateCartAPI.fulfilled, (state, action) => {
//         state.items = action.payload.items;
//       })
//       .addCase(removeFromCartAPI.fulfilled, (state, action) => {
//         state.items = state.items.filter((i) => i.id !== action.payload);
//       });
//   },
// });

// // ✅ Export actions
// export const {
//   incrementQuantity,
//   decrementQuantity,
//   addToCartLocal,
//   updateCartLocal,
//   removeFromCartLocal,
// } = cartSlice.actions;

// export default cartSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api";

// ✅ Async Thunks

// Fetch cart and enrich items with full product objects if missing
export const fetchCart = createAsyncThunk("cart/fetch", async (userId) => {
  const res = await API.get(`/cart/${userId}`);
  const cart = res.data;

  const items = await Promise.all(
    cart.items.map(async (item) => {
      if (item.product) return item; // already has product object
      // fetch product by productId
      const prodRes = await API.get(`/products/${item.productId}`);
      return { product: prodRes.data, quantity: item.quantity };
    })
  );

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return { items, total };
});

// Add to cart API
export const addToCartAPI = createAsyncThunk(
  "cart/add",
  async ({ userId, product }) => {
    const res = await API.post(`/cart/${userId}/add`, { productId: product.id });
    const cart = res.data;

    // Enrich items with product objects if missing
    const items = await Promise.all(
      cart.items.map(async (item) => {
        if (item.product) return item;
        const prodRes = await API.get(`/products/${item.productId}`);
        return { product: prodRes.data, quantity: item.quantity };
      })
    );

    const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    return { items, total };
  }
);

// Update cart API
export const updateCartAPI = createAsyncThunk(
  "cart/update",
  async ({ userId, productId, quantity }) => {
    const res = await API.put(`/cart/${userId}/update`, { productId, quantity });
    const cart = res.data;

    const items = await Promise.all(
      cart.items.map(async (item) => {
        if (item.product) return item;
        const prodRes = await API.get(`/products/${item.productId}`);
        return { product: prodRes.data, quantity: item.quantity };
      })
    );

    const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    return { items, total };
  }
);

// Remove from cart API
export const removeFromCartAPI = createAsyncThunk(
  "cart/remove",
  async ({ userId, productId }) => {
    const res = await API.delete(`/cart/${userId}/remove/${productId}`);
    const cart = res.data;

    const items = await Promise.all(
      cart.items.map(async (item) => {
        if (item.product) return item;
        const prodRes = await API.get(`/products/${item.productId}`);
        return { product: prodRes.data, quantity: item.quantity };
      })
    );

    const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    return { items, total };
  }
);

// ✅ Slice
const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], total: 0 },
  reducers: {
    addToCartLocal: (state, action) => {
      const product = action.payload.product;
      const exists = state.items.find((i) => i.product.id === product.id);
      if (exists) {
        exists.quantity += 1;
      } else {
        state.items.push({ product, quantity: 1 });
      }
      state.total = state.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    },
    updateCartLocal: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((i) => i.product.id === productId);
      if (item) item.quantity = quantity;
      state.total = state.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    },
    removeFromCartLocal: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((i) => i.product.id !== productId);
      state.total = state.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.total = action.payload.total || 0;
      })
      .addCase(addToCartAPI.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.total = action.payload.total || 0;
      })
      .addCase(updateCartAPI.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.total = action.payload.total || 0;
      })
      .addCase(removeFromCartAPI.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.total = action.payload.total || 0;
      });
  },
});

export const { addToCartLocal, updateCartLocal, removeFromCartLocal, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
