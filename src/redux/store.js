import { legacy_createStore, combineReducers, applyMiddleware } from "redux";
import {thunk} from "redux-thunk";
import notificationReducer from "../reducers/notificationReducer";
import orderReducer from "../reducers/orderReducer";
import userReducer from "../reducers/userReducer";

import { composeWithDevTools } from "@redux-devtools/extension";

export const reducers = combineReducers({
  notification: notificationReducer,
  order: orderReducer,
  user: userReducer
});


export default legacy_createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunk))
);