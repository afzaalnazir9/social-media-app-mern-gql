import { createSlice } from '@reduxjs/toolkit';
import jwtDecode from "jwt-decode";

const initialState = {
  loginResponse: null,
};

if (localStorage.getItem('token')) {
  const decodedToken = jwtDecode(localStorage.getItem('token'));
  if (decodedToken.exp * 1000 < Date.now()) {
    localStorage.removeItem('token');
  } else {
    initialState.loginResponse = decodedToken;
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoginResponse(state, action) {
      state.loginResponse = action.payload;
    },
    setLogout(state) {
      state.loginResponse = null;
    },
  },
});

export const { setLoginResponse, setLogout } = authSlice.actions;
export default authSlice.reducer;
