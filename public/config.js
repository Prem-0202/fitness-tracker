// When served by Express (merged project), use relative path.
// Falls back to absolute URL only if opened standalone.
const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname !== '')
  ? ''   // same-server: use relative paths like /api/auth/login
  : 'https://fitness-tracker-x15u.onrender.com';
