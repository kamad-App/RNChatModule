import { combineReducers } from "redux";
import loginReducer from "./loginID";

const rootReducer = combineReducers({
    loginReducer,
});

const appReducer = (state, action) => {
 
  return rootReducer(state, action);
};

export default appReducer;