import ActionConstants from "../type/loginID";
export default function loginReducer(state = { loginKey: '' }, action) {
  switch (action.type) {
    case ActionConstants.LOGIN_ID: {
      return {
        ...state,
        loginKey: action.value,
      };
    }
    default:
      return { ...state };
  }
}