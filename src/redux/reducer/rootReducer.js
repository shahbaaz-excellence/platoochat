import { combineReducers } from 'redux';
import GetAllPoll from './getAllPoll';
import getApprovedQuestions from './getApprovedQuestions';
import questionApprove from './questionApprove';

const rootReducer = combineReducers({
  GetAllPoll: GetAllPoll,
  getApprovedQuestions:getApprovedQuestions,
  questionApprove:questionApprove,
});

export default rootReducer;