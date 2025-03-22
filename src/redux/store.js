import { legacy_createStore, combineReducers, applyMiddleware } from "redux";
import {thunk} from "redux-thunk";
import notificationReducer from "../reducers/notificationReducer";
import orderReducer from "../reducers/orderReducer";
import userReducer from "../reducers/userReducer";
import booksReducer from "../reducers/booksReducer";
import typesReducer from "../reducers/typesReducer";
import categoriesReducer from "../reducers/categoriesReducer";
import { composeWithDevTools } from "@redux-devtools/extension";


export const reducers = combineReducers({
  notification: notificationReducer,
  order: orderReducer,
  user: userReducer,
  books: booksReducer,
  types: typesReducer,
  categories: categoriesReducer,
});


export default legacy_createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunk))
);