import { put, call } from "redux-saga/effects";
import { getApprovedQuestionsSuccess, getApprovedQuestionsError } from "../action";
import axios from "axios";
import { baseUrl } from "../../config/firebaseConfig";
import { subdomain } from "../../constants/constants";

export function* getApprovedQuestions(action) {
  try {

        let response = yield call(
          axios.get,
          `${baseUrl}/question/get/${subdomain}/true`,
          action.payload
        );

        // console.log(response.data.data,"rrrrrrrrrr");

    if (response.data.data) {
      yield put(getApprovedQuestionsSuccess({ response: response.data.data }));
    } else {
      yield put(getApprovedQuestionsError({ error: "Data not fetched" }));
    }
  } catch (error) {
    yield put(getApprovedQuestionsError({ error: "Data not fetched" }));
  }
}