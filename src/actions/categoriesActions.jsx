export const fetchCategories = () => async (dispatch) => {
    try {
      const response = await fetch(`http://tie-tkannat.it.tuni.fi:${import.meta.env.VITE_SERVER_PORT}/api/luokat`);
      const data = await response.json();
      dispatch({ type: "FETCH_CATEGORIES_SUCCESS", payload: data });
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  