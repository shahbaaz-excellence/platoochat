import { all,takeLatest } from "redux-saga/effects";
import * as actions from '../action/index';
import { GetAllPoll } from "./getAllPoll";
import { getApprovedQuestions } from "./getApprovedQuestions";
import { questionApprove } from "./questionApprove";

function* watchAllSaga(){
  yield takeLatest(actions.getAllPollRequest,GetAllPoll)
  yield takeLatest(actions.getApprovedQuestionsRequest,getApprovedQuestions)
  yield takeLatest(actions.questionApproveRequest,questionApprove)
}

export default function* rootSaga(){
  yield all ([watchAllSaga()]);
}