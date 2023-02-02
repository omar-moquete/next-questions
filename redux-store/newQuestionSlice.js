import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  questionData: {
    existingTopic: null,
    newTopic: { text: "", description: "" },
    currentStep: 1, // 1 === topic form
    isNewTopic: false,
  },
};
const newQuestionSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setExistingTopic(state, { payload }) {
      state.questionData.existingTopic = payload;
    },

    setNewTopicText(state, { payload }) {
      state.questionData.newTopic.text = payload;
    },

    setNewTopicDescription(state, { payload }) {
      state.questionData.newTopic.description = payload;
    },

    setIsNewTopic(state, { payload }) {
      state.questionData.isNewTopic = payload;
    },

    resetNewTopic(state) {
      state.questionData.newTopic = { text: "", description: "" };
      state.questionData.isNewTopic = false;
    },

    step1(state) {
      state.questionData.currentStep = 1;
    },
    step2(state) {
      state.questionData.currentStep = 2;
    },
  },
});

export default newQuestionSlice;
export const { actions: newQuestionActions } = newQuestionSlice;
