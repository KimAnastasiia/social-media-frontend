
import { combineReducers } from "redux";
import reducerLogin from "./reducerLogin";
import reducerEmail from "./reducerEmail";
const combineReducer = combineReducers({
    reducerLogin,
    reducerEmail
});

export default combineReducer;