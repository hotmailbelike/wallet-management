export const defaultBDTDenominators = [1, 2, 5, 10, 50, 100, 200, 500, 1000];
export const defaultUSDDenominators = [1, 2, 5, 10, 20, 50, 100];
export const defaultEURDenominators = [1, 2, 5, 10, 20, 50, 100, 500];

export const addCommasToNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
