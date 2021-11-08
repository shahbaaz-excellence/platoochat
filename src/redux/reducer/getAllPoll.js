import * as actions from "../constant";

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
};

const GetAllPoll = (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_ALL_POLL_REQUEST:
      return {
        ...state,
        isLoading: true,
        isSuccess: false,
        isError: false,
      };
    case actions.GET_ALL_POLL_SUCCESS:
      return {
        isLoading: false,
        isSuccess: true,
        isError: false,
        profileData: action.payload.response,
      };
    case actions.GET_ALL_POLL_ERROR:
      return {
        isLoading: false,
        isSuccess: false,
        isError: true,
      };
    default:
      return state;
  }
};

export default GetAllPoll;