import { put, call } from "redux-saga/effects";
import { getAllPollSuccess, getAllPollError } from "../action";
import axios from "axios";
// import axiosCall from "../services/index";
import { baseUrl } from "../../config/firebaseConfig";
import { subdomain } from "../../constants/constants";
import { customerData } from "../../constants/constants";

export function* GetAllPoll(action) {
  try {

        let response = yield call(
          axios.get,
          `${baseUrl}/polling/getdetails/published/${subdomain}?published=true&email=${customerData.email}`,
          action.payload
        );

    if (response?.data?.data?.polls) {
      yield put(getAllPollSuccess({ response: response.data.data.polls }));
    } else {
      yield put(getAllPollError({ error: "Data not fetched" }));
    }
  } catch (error) {
    yield put(getAllPollError({ error: "Data not fetched" }));
  }
}