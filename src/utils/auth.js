export function getToken() {
  return localStorage.getItem('token') || '';
}

export function getUserData() {
  try {
    return JSON.parse(localStorage.getItem('userData') || '{}');
  } catch {
    return {};
  }
}

function parseBooleanLike(value) {
  if (value === true || value === false) return value;
  if (value == null) return false;
  const normalized = String(value).trim().toLowerCase();
  return normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === 'y';
}

export function getIsAdmin() {
  const lsIsAdminRaw = localStorage.getItem('isAdmin');
  const lsIsAdmin = parseBooleanLike(lsIsAdminRaw);
  const userData = getUserData();
  const userDataIsAdmin = parseBooleanLike(userData?.isAdmin);
  const role = (userData?.role || '').toString().toLowerCase();
  const roleIsAdmin = role === 'admin';
  return lsIsAdmin || userDataIsAdmin || roleIsAdmin;
}


