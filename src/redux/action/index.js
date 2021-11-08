import { createAction } from "redux-actions";
import * as constant from "../constant";

export const getAllPollRequest = createAction(constant.GET_ALL_POLL_REQUEST);
export const getAllPollSuccess = createAction(constant.GET_ALL_POLL_SUCCESS);
export const getAllPollError = createAction(constant.GET_ALL_POLL_ERROR);