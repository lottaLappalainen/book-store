export const fetchCategories = () => async (dispatch) => {
    try {
      const response = await fetch("http://tie-tkannat.it.tuni.fi:8069/api/luokat");
      const data = await response.json();
      dispatch({ type: "FETCH_CATEGORIES_SUCCESS", payload: data });
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  