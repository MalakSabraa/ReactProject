export const hasToken = (): boolean => {
  const tokenFromLocalStorage = localStorage.getItem('token');
  if (tokenFromLocalStorage) return true;

  const cookies = document.cookie.split(';').map(c => c.trim());
  const tokenCookie = cookies.find(c => c.startsWith('token='));
  if (tokenCookie) return true;

  return false;
};
