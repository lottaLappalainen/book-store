export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';

export const REGISTER_REQUEST = 'REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'REGISTER_FAILURE';

export const loginUser = (email, password, navigate) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });

  try {
    const response = await fetch('http://tie-tkannat.it.tuni.fi:8069/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sposti: email, salasana: password })
    });

    if (!response.ok) {
      throw new Error("Väärä sähköposti tai salasana");
    }

    const result = await response.json();
    dispatch({ type: LOGIN_SUCCESS, payload: { email, role: result.kayttaja.rooli } });
    navigate("/books");

  } catch (error) {
    dispatch({ type: LOGIN_FAILURE, payload: error.message });
  }
};

export const registerUser = (formData, navigate) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });

  try {
    const response = await fetch('http://tie-tkannat.it.tuni.fi:8069/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nimi: formData.name,
        osoite: formData.address,
        sposti: formData.email,
        salasana: formData.password,
        puh: formData.phone,
        rooli: 'asiakas'
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Rekisteröinti epäonnistui");
    }

    dispatch({ type: REGISTER_SUCCESS });
    navigate("/login");

  } catch (error) {
    dispatch({ type: REGISTER_FAILURE, payload: error.message });
  }
};

export const logout = () => ({
  type: LOGOUT,
});
