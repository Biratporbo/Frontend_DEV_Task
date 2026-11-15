import { createSlice } from '@reduxjs/toolkit';

const AUTH_STORAGE_KEY = 'apexcart_auth_v1';

export const DEMO_USER = {
  id: 'usr_9421',
  name: 'Alex Turner',
  email: 'alex.turner@example.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  address: {
    fullName: 'Alex Turner',
    street: '742 Evergreen Terrace',
    city: 'Springfield',
    state: 'OR',
    zipCode: '97477',
    country: 'United States'
  }
};

function loadStoredAuth() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data && data.token && data.user) {
        return {
          isAuthenticated: true,
          user: data.user,
          token: data.token
        };
      }
    }
  } catch (e) {}
  return {
    isAuthenticated: false,
    user: null,
    token: null
  };
}

const savedAuth = loadStoredAuth();

const initialState = {
  isAuthenticated: savedAuth.isAuthenticated,
  user: savedAuth.user,
  token: savedAuth.token,
  isAuthModalOpen: false,
  authRedirectReason: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { email, name } = action.payload || {};
      const user = {
        id: `usr_${Date.now().toString().slice(-4)}`,
        name: name || (email ? email.split('@')[0] : 'Shopper'),
        email: email || 'shopper@example.com',
        avatar: DEMO_USER.avatar,
        address: DEMO_USER.address
      };
      const token = `sim_jwt_${btoa(user.email)}_${Date.now()}`;

      state.isAuthenticated = true;
      state.user = user;
      state.token = token;
      state.isAuthModalOpen = false;
      state.authRedirectReason = null;

      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, token }));
      } catch (e) {}
    },
    loginWithDemo: (state) => {
      const token = `sim_jwt_${btoa(DEMO_USER.email)}_demo`;
      state.isAuthenticated = true;
      state.user = DEMO_USER;
      state.token = token;
      state.isAuthModalOpen = false;
      state.authRedirectReason = null;

      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user: DEMO_USER, token }));
      } catch (e) {}
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.authRedirectReason = null;
      try {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      } catch (e) {}
    },
    openAuthModal: (state, action) => {
      state.isAuthModalOpen = true;
      state.authRedirectReason = action.payload?.reason || null;
    },
    closeAuthModal: (state) => {
      state.isAuthModalOpen = false;
      state.authRedirectReason = null;
    }
  }
});

export const {
  login,
  loginWithDemo,
  logout,
  openAuthModal,
  closeAuthModal
} = authSlice.actions;

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthToken = (state) => state.auth.token;
export const selectIsAuthModalOpen = (state) => state.auth.isAuthModalOpen;
export const selectAuthRedirectReason = (state) => state.auth.authRedirectReason;

export default authSlice.reducer;
