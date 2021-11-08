import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./saga/rootSaga";
import rootReducer from "./reducer/rootReducer";

// we need an initialState otherwise , store will freak out
const initialState = {};

const sagaMiddleware = createSagaMiddleware();

// redux sagas is a middleware that we apply to the store
export const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(sagaMiddleware)
);
sagaMiddleware.run(rootSaga);

export default store;