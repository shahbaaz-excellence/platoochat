import { combineReducers } from "redux";
import loginSlice from "./slices/loginSlice";
import allAttendeesSlice from "./slices/attendeeSlice";

const rootReducer = combineReducers({
  user: loginSlice,
  allAttendees: allAttendeesSlice,
});
export default rootReducer;