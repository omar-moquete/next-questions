import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // A user object constructed from the logged in user firebase data. Stores displayable user data.
  user: null,
  // Allows for a more accurate authentiation state check. Possible values: NOT_INITIALIZED, LOADED, LOADING
  authStatus: "NOT_INITIALIZED",
  authStatusNames: {
    notInitialized: "NOT_INITIALIZED",
    loading: "LOADING",
    loaded: "LOADED",
    notLoaded: "NOT_LOADED",
    error: "ERROR",
  },
  listenerActive: false,
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
      if (payload === state.authStatusNames.loaded)
        state.authStatus = state.authStatusNames.loaded;
      else if (payload === state.authStatusNames.loading)
        state.authStatus = state.authStatusNames.loading;
      else if (payload === state.authStatusNames.notLoaded)
        state.authStatus = state.authStatusNames.notLoaded;
      else if (payload === state.authStatusNames.error)
        state.authStatus = state.authStatusNames.error;
      else return;
    },

    setListenerActive(state) {
      state.listenerActive = true;
    },
  },
});

export const { actions: authActions } = authSlice;
export default authSlice;
