export const fetchTypes = () => async (dispatch) => {
    try {
      const response = await fetch(`http://tie-tkannat.it.tuni.fi:${import.meta.env.VITE_SERVER_PORT}/api/tyypit`);
      const data = await response.json();
      dispatch({ type: "FETCH_TYPES_SUCCESS", payload: data });
    } catch (error) {
      console.error("Error fetching types:", error);
    }
  };
  