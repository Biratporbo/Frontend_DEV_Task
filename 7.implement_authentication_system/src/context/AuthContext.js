import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateToken, isTokenValid, decodeToken } from '../services/jwtService';

const AuthContext = createContext();

const STORAGE_KEYS = {
  TOKEN_LOCAL: 'authguard_token_local',
  TOKEN_SESSION: 'authguard_token_session',
  REMEMBER_USER: 'authguard_remember_username',
};

export const AuthProvider = ({ children }) => {
  // Check localStorage first, then sessionStorage
  const [token, setToken] = useState(() => {
    const local = localStorage.getItem(STORAGE_KEYS.TOKEN_LOCAL);
    if (local && isTokenValid(local)) return local;

    const session = sessionStorage.getItem(STORAGE_KEYS.TOKEN_SESSION);
    if (session && isTokenValid(session)) return session;

    return null;
  });

  const [user, setUser] = useState(() => {
    if (!token) return null;
    const decoded = decodeToken(token);
    return decoded ? decoded.payload : null;
  });

  const [rememberedUsername, setRememberedUsername] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.REMEMBER_USER) || '';
  });

  const [sessionExpiredNotice, setSessionExpiredNotice] = useState(false);

  // Periodic token expiration verification (every 5 seconds)
  useEffect(() => {
    if (!token) return;

    const checkExpiration = () => {
      if (!isTokenValid(token)) {
        logout(true); // Token expired!
      }
    };

    const interval = setInterval(checkExpiration, 5000);
    return () => clearInterval(interval);
  }, [token]);

  /**
   * Authenticate user, generate simulated JWT token, and store according to rememberMe preference
   */
  const login = ({ username, password, rememberMe = false }) => {
    const dummyUser = {
      id: `usr_${username.toLowerCase()}`,
      username: username.trim(),
      name: username.charAt(0).toUpperCase() + username.slice(1),
      email: `${username.toLowerCase()}@workspace.io`,
      role: username.toLowerCase() === 'admin' ? 'Administrator' : 'Team Member',
    };

    // Generate simulated 3-part Base64 JWT token (valid for 60 minutes)
    const newToken = generateToken(dummyUser, 60);

    if (rememberMe) {
      localStorage.setItem(STORAGE_KEYS.TOKEN_LOCAL, newToken);
      localStorage.setItem(STORAGE_KEYS.REMEMBER_USER, username.trim());
      sessionStorage.removeItem(STORAGE_KEYS.TOKEN_SESSION);
      setRememberedUsername(username.trim());
    } else {
      sessionStorage.setItem(STORAGE_KEYS.TOKEN_SESSION, newToken);
      localStorage.removeItem(STORAGE_KEYS.TOKEN_LOCAL);
      localStorage.removeItem(STORAGE_KEYS.REMEMBER_USER);
      setRememberedUsername('');
    }

    setToken(newToken);
    setUser(dummyUser);
    setSessionExpiredNotice(false);
    return true;
  };

  /**
   * Log out user, purge tokens, and redirect
   */
  const logout = (dueToExpiry = false) => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN_LOCAL);
    sessionStorage.removeItem(STORAGE_KEYS.TOKEN_SESSION);
    setToken(null);
    setUser(null);

    if (dueToExpiry) {
      setSessionExpiredNotice(true);
    }
  };

  /**
   * Test helper to invalidate token and verify route protection
   */
  const invalidateToken = () => {
    logout(true);
  };

  const isAuthenticated = Boolean(token && isTokenValid(token));

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        rememberedUsername,
        sessionExpiredNotice,
        login,
        logout,
        invalidateToken,
        setSessionExpiredNotice,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

