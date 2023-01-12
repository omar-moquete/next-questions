import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  // Allows for a more accurate authentiation state check. Possible values: "not-checked", "checking" and "checked".
  authStatus: "NOT_CHECKED",
  authStatusNames: {
    notChecked: "NOT_CHECKED",
    checking: "CHECKING",
    checked: "CHECKED",
  },
};

// Create slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    _setUser(state, { payload }) {
      state.user = payload;
    },

    setAuthStatus(state, { payload }) {
      if (payload === state.authStatusNames.checked)
        state.authStatus = state.authStatusNames.checked;
      else if (payload === state.authStatusNames.checking)
        state.authStatus = state.authStatusNames.checking;
      else return;
    },
  },
});

export const { actions: authActions } = authSlice;
export default authSlice;
