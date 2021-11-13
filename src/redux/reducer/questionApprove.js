import * as actions from "../constant";

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
};

const questionApprove = (state = initialState, action) => {
  switch (action.type) {
    case actions.QUESTION_APPROVE_REQUEST:
      return {
        ...state,
        isLoading: true,
        isSuccess: false,
        isError: false,
      };
    case actions.QUESTION_APPROVE_SUCCESS:
      return {
        isLoading: false,
        isSuccess: true,
        isError: false,
        questionApproval: action.payload.response,
      };
    case actions.QUESTION_APPROVE_ERROR:
      return {
        isLoading: false,
        isSuccess: false,
        isError: true,
      };
    default:
      return state;
  }
};

export default questionApprove;