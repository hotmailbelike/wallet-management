import {
  defaultBDTDenominators,
  defaultUSDDenominators,
  defaultEURDenominators,
} from "./utils";

export const saveNotes = (notes) => {
  localStorage.setItem("walletNotes", JSON.stringify(notes));
};

export const loadNotes = () => {
  const notes = localStorage.getItem("walletNotes");
  return notes ? JSON.parse(notes) : null;
};

// dataTypes: "denominators", "walletData"
export const loadData = (dataType) => {
  const data = localStorage.getItem(dataType);
  if (data) return JSON.parse(data);
  return null;
};

/**
 * denominators in localstorage
 * {
 *  USD: [],
 *  BDT: [],
 *  EUR: []
 * }
 */
export const populateLocalDenominatorsWithDefaultValues = () => {
  localStorage.setItem(
    "denominators",
    JSON.stringify({
      BDT: defaultBDTDenominators,
      USD: defaultUSDDenominators,
      EUR: defaultEURDenominators,
    })
  );
};

export const updateActiveCurrencyDenominator = (type, denominatorsArray) => {
  let denominators = localStorage.getItem("denominators");
  if (denominators) {
    const parsedData = JSON.parse(denominators);
    parsedData[type] = denominatorsArray;
    localStorage.setItem("denominators", JSON.stringify(parsedData));
  }
};

export const saveWalletData = (balance, notes, activeCurrency) => {
  localStorage.setItem(
    "walletData",
    JSON.stringify({
      balance,
      notes,
      activeCurrency,
    })
  );
};
