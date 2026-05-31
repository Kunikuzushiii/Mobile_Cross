import { createSlice } from "@reduxjs/toolkit";

export interface NotificationState {
  successCount: number;
  failCount: number;
}

const initialState: NotificationState = {
  successCount: 0,
  failCount: 0,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    incrementSuccess(state) {
      state.successCount += 1;
    },
    incrementFail(state) {
      state.failCount += 1;
    },
  },
});

export const { incrementSuccess, incrementFail } = notificationSlice.actions;
export default notificationSlice.reducer;
