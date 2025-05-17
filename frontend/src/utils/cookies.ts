import Cookies from 'js-cookie';

export const getStoredUser = () => {
  const userData = Cookies.get('userData');
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  }
  return null;
};

export const setStoredUser = (userData: any) => {
  Cookies.set('userData', JSON.stringify(userData), { expires: 7 }); // Expires in 7 days
};

export const removeStoredUser = () => {
  Cookies.remove('userData');
}; 