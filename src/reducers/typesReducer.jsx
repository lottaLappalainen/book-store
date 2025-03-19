const initialState = { types: [] };

const typesReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_TYPES_SUCCESS":
      return { ...state, types: action.payload };
    default:
      return state;
  }
};

export default typesReducer;
