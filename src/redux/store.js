import { legacy_createStore, combineReducers, applyMiddleware } from "redux";
import {thunk} from "redux-thunk";
import notificationReducer from "../reducers/notificationReducer";
import basketReducer from "../reducers/basketReducer";
import userReducer from "../reducers/userReducer";
import booksReducer from "../reducers/booksReducer";
import typesReducer from "../reducers/typesReducer";
import categoriesReducer from "../reducers/categoriesReducer";
import { composeWithDevTools } from "@redux-devtools/extension";

export const reducers = combineReducers({
  notification: notificationReducer,
  basket: basketReducer,
  user: userReducer,
  books: booksReducer,
  types: typesReducer,
  categories: categoriesReducer,
});


export default legacy_createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunk))
);