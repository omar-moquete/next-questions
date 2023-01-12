import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import globalSlice from "./globalSlice";

// Configure store
const store = configureStore({
  reducer: { auth: authSlice.reducer, global: globalSlice.reducer },
});

export default store;
