import { combineReducers } from "@reduxjs/toolkit";
import notificationReducer from "./notification.slice";

const rootReducer = combineReducers({
  notification: notificationReducer,
});

export default rootReducer;
