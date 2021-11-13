import { put, call } from "redux-saga/effects";
import { questionApproveSuccess, questionApproveError } from "../action";
import axios from "axios";
import { baseUrl } from "../../config/firebaseConfig";
import { subdomain } from "../../constants/constants";

export function* questionApprove(action) {
  try {

        let response = yield call(
          axios.post,
          `${baseUrl}/question/create`,
          action.payload
        );

        console.log(response.data.data,"rrrrrrrrrr");

    if (response.data.data.message) {
      yield put(questionApproveSuccess({ response: response.data.data.message }));
    } else {
      yield put(questionApproveError({ error: "Data not fetched" }));
    }
  } catch (error) {
    yield put(questionApproveError({ error: "Data not fetched" }));
  }
}