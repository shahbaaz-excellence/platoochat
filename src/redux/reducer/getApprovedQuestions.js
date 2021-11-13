import * as actions from "../constant";

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
};

const getApprovedQuestions = (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_APPROVED_QUESTIONS_REQUEST:
      return {
        ...state,
        isLoading: true,
        isSuccess: false,
        isError: false,
      };
    case actions.GET_APPROVED_QUESTIONS_SUCCESS:
      return {
        isLoading: false,
        isSuccess: true,
        isError: false,
        approvedQuestionsList: action.payload.response,
      };
    case actions.GET_APPROVED_QUESTIONS_ERROR:
      return {
        isLoading: false,
        isSuccess: false,
        isError: true,
      };
    default:
      return state;
  }
};

export default getApprovedQuestions;