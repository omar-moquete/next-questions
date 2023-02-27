import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // A user object constructed from the logged in user firebase data. Stores displayable user data.
  user: null,
  // Allows for a more accurate authentiation state check. Possible values: NOT_INITIALIZED, LOADING, LOADED, NOT_LOADED,ERROR
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

    setImageUrl(state, { payload: newImageUrl }) {
      if (state.user === null) {
        console.error("User is null at store.auth.user");
        return;
      }
      state.user.imageUrl = newImageUrl;
    },
  },
});

export const { actions: authActions } = authSlice;
export default authSlice;
