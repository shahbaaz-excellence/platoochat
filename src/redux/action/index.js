import { createAction } from "redux-actions";
import * as constant from "../constant";

export const getAllPollRequest = createAction(constant.GET_ALL_POLL_REQUEST);
export const getAllPollSuccess = createAction(constant.GET_ALL_POLL_SUCCESS);
export const getAllPollError = createAction(constant.GET_ALL_POLL_ERROR);

export const getApprovedQuestionsRequest = createAction(constant.GET_APPROVED_QUESTIONS_REQUEST);
export const getApprovedQuestionsSuccess = createAction(constant.GET_APPROVED_QUESTIONS_SUCCESS);
export const getApprovedQuestionsError = createAction(constant.GET_APPROVED_QUESTIONS_ERROR);

export const questionApproveRequest = createAction(constant.QUESTION_APPROVE_REQUEST);
export const questionApproveSuccess = createAction(constant.QUESTION_APPROVE_SUCCESS);
export const questionApproveError = createAction(constant.QUESTION_APPROVE_ERROR);