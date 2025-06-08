export const login = (email: string, password: string) => {
  localStorage.setItem('isLoggedIn', 'true');
};

export const logout = () => {
  localStorage.removeItem('isLoggedIn');
};

export const checkIsLoggedIn = () => {
  return localStorage.getItem('isLoggedIn') === 'true';
};
