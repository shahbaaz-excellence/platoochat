import { put, call } from "redux-saga/effects";
import { getAllPollSuccess, getAllPollError } from "../action";
import axios from "axios";
// import axiosCall from "../services/index";
import { baseUrl } from "../../config/firebaseConfig";
import { subdomain } from "../../constants/constants";
import { customerData } from "../../constants/constants";

export function* GetAllPoll(action) {
  try {

    const url = `${baseUrl}/polling/getdetails/published/${subdomain}?published=true&email=${customerData.email}`

        const response = yield call(
            axios.get(url)
        );

    if (response) {
      yield put(getAllPollSuccess({ response: response }));
    } else {
      yield put(getAllPollError({ error: "Data not fetched" }));
    }
  } catch (error) {
    yield put(getAllPollError({ error: "Data not fetched" }));
  }
}