import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import globalSlice from "./globalSlice";
import newQuestionSlice from "./newQuestionSlice";

// Configure store
const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    global: globalSlice.reducer,
    newQuestion: newQuestionSlice.reducer,
  },
});

export default store;
