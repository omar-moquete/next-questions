import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";

// Configure store
const store = configureStore({
  reducer: { auth: authSlice.reducer },
});

export default store;
