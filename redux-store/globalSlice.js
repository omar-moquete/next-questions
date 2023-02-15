import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // The user that's currently being visited. Used to check if authenticated usr === visited user and display private UI components.
  visitedUser: null,
  // When selected topic is null, there is no selected topic and questions with about user's favorite topics will be displayed
  selectedTopicUid: null,
  questionUI: {
    replyFormUnmounters: [],
    currentFollowedTopics: [],
  },
  searchParam: "",
};
const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setVisitedUser(state, { payload }) {
      state.visitedUser = payload;
    },

    setSelectedTopic(state, { payload }) {
      state.selectedTopicUid = payload;
    },
    setReplyFormUnmounter(state, { payload }) {
      state.questionUI.replyFormUnmounters.push(payload);
    },

    setSearchParam(state, { payload }) {
      state.searchParam = payload;
    },
    resetSearchParam(state) {
      state.searchParam = "";
    },

    setCurrentFollowedTopic(state, { payload }) {
      if (state.questionUI.currentFollowedTopics.includes(payload)) return;
      state.questionUI.currentFollowedTopics.push(payload);
    },

    removeCurrentFollowedTopic(state, { payload }) {
      const indexOfItemToDelete =
        state.questionUI.currentFollowedTopics.indexOf(payload);

      state.questionUI.currentFollowedTopics.splice(indexOfItemToDelete, 1);
    },
  },
});

export default globalSlice;
export const { actions: globalActions } = globalSlice;
