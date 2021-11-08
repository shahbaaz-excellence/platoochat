import { combineReducers } from 'redux';
import GetAllPoll from './getAllPoll';

const rootReducer = combineReducers({
  GetAllPoll: GetAllPoll,
});

export default rootReducer;