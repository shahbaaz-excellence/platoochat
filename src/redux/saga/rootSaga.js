import { all,takeLatest } from "redux-saga/effects";
import * as actions from '../action/index';
import { GetAllPoll } from "./getAllPoll";

function* watchAllSaga(){
  yield takeLatest(actions.getAllPollRequest,GetAllPoll)
}

export default function* rootSaga(){
  yield all ([watchAllSaga()]);
}