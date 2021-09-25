import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { useDispatch } from "react-redux";

let enableDevTools = true;
if (process.env.REACT_APP_TARGET === "production") {
  enableDevTools = false;
}

const store = configureStore({
  reducer: rootReducer,
  devTools: enableDevTools,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const useAppDispatch = () => useDispatch();
export default store;