import { combineReducers } from "redux";
import loginSlice from "./slices/loginSlice";

const rootReducer = combineReducers({
  user: loginSlice,
});
export default rootReducer;