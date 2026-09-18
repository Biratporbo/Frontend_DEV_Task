/**
 * JWT Simulation and Validation Service
 * Generates and validates standard 3-part Base64Url JWT tokens:
 * [header].[payload].[signature]
 */

// Helper to base64url encode a string
const base64UrlEncode = (str) => {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

// Helper to base64url decode a string
const base64UrlDecode = (str) => {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  try {
    return decodeURIComponent(escape(atob(base64)));
  } catch (e) {
    return atob(base64);
  }
};

/**
 * Generate a simulated JWT token for a user
 * @param {Object} user - User details (id, username, email, name, role)
 * @param {number} expiresInMinutes - Expiry duration (default 60 minutes)
 * @returns {string} Encoded JWT token
 */
export const generateToken = (user, expiresInMinutes = 60) => {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + expiresInMinutes * 60;

  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const payload = {
    sub: user.id || `usr-${Date.now()}`,
    username: user.username,
    name: user.name || user.username,
    email: user.email || `${user.username.toLowerCase()}@example.com`,
    role: user.role || 'Member',
    iss: 'authguard-security-issuer',
    iat,
    exp,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));

  // Generate simulated cryptographic HMAC-SHA256 signature hash
  const signatureData = `${encodedHeader}.${encodedPayload}`;
  let hash = 0;
  for (let i = 0; i < signatureData.length; i++) {
    hash = (hash << 5) - hash + signatureData.charCodeAt(i);
    hash |= 0;
  }
  const signature = base64UrlEncode(`sig_sha256_${Math.abs(hash)}_${Date.now().toString(36)}`);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

/**
 * Decode a simulated JWT token into its component parts
 * @param {string} token
 * @returns {Object|null} Decoded token object or null
 */
export const decodeToken = (token) => {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const headerStr = base64UrlDecode(parts[0]);
    const payloadStr = base64UrlDecode(parts[1]);

    const header = JSON.parse(headerStr);
    const payload = JSON.parse(payloadStr);

    return {
      header,
      payload,
      signature: parts[2],
      raw: token,
    };
  } catch (err) {
    console.error('Failed to decode JWT token:', err);
    return null;
  }
};

/**
 * Validate token structure and check whether it has expired
 * @param {string} token
 * @returns {boolean}
 */
export const isTokenValid = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.payload || !decoded.payload.exp) {
    return false;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.payload.exp > currentTime;
};

/**
 * Get remaining validity time in seconds
 * @param {string} token
 * @returns {number}
 */
export const getTimeRemaining = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.payload || !decoded.payload.exp) return 0;

  const current = Math.floor(Date.now() / 1000);
  const diff = decoded.payload.exp - current;
  return diff > 0 ? diff : 0;
};

