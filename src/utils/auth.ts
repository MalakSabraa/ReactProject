export const hasToken = (): boolean => {
  return localStorage.getItem('token') !== null;
};
