export const hasToken = (): boolean => {
  return !!localStorage.getItem('token') || !!sessionStorage.getItem('token');
};
