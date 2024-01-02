"use client";

import { useState, useEffect } from "react";
import { IoWalletSharp } from "react-icons/io5";
import Swal from "sweetalert2";
import {
  defaultBDTDenominators,
  defaultEURDenominators,
  defaultUSDDenominators,
  addCommasToNumber,
} from "../utils/utils";

// put this in env
const openExchangeRatesAPIKey = "9f1a3da775aa4c48aa3af26c7dde12e3";

export default function WalletApp() {
  const [currencies, setCurrencies] = useState([
    {
      type: "USD",
      symbol: "$",
      active: true,
      denominators: defaultUSDDenominators,
    },
    {
      type: "EUR",
      symbol: "€",
      active: false,
      denominators: defaultEURDenominators,
    },
    {
      type: "BDT",
      symbol: "৳",
      active: false,
      denominators: defaultBDTDenominators,
    },
  ]);

  const setActiveCurrency = (currencyType) =>
    setCurrencies((prevCurrencies) =>
      prevCurrencies.map((currency) => ({
        ...currency,
        active: currency.type == currencyType,
      }))
    );

  const getActiveCurrency = () =>
    currencies.find((currency) => currency.active);

  const populateNotes = () => {
    const { denominators } = getActiveCurrency();
    const notesObj = {};

    denominators.forEach((denominator) => (notesObj[denominator] = 0));

    return notesObj;
  };

  const [notes, setNotes] = useState(populateNotes);

  const calculateNotes = () => {
    let balance = 0;
    for (const noteKey in notes) {
      if (Object.hasOwn(notes, noteKey)) {
        const noteValue = notes[noteKey];
        balance += noteValue * noteKey;
      }
    }
    return balance;
  };

  const [totalBalance, setTotalBalance] = useState(0);

  const [errorMessage, setErrorMessage] = useState("");

  const convertCurrency = async (fromCurrency, toCurrency) => {
    try {
      // const response = await fetch(
      // 	`https://openexchangerates.org/api/latest.json?symbols=BDT,EUR,USD&app_id=${openExchangeRatesAPIKey}`
      // );

      // if (!response.ok) {
      // 	throw new Error(`Error fetching exchange rates: ${response.statusText}`);
      // }

      // const data = await response.json();
      // const exchangeRates = data.rates;

      const exchangeRates = {
        BDT: 109.786795,
        EUR: 0.912147,
        USD: 1,
      };

      const toUSD = totalBalance / exchangeRates[fromCurrency];

      const toDesiredCurrency = Math.floor(toUSD * exchangeRates[toCurrency]);

      setTotalBalance(toDesiredCurrency);
      resetNoteCount();

      return toDesiredCurrency;
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleAddNote = (note) => {
    setNotes({
      ...notes,
      [note]: notes[note] + 1,
    });
    setTotalBalance(totalBalance + parseInt(note));
  };

  const handleRemoveNote = (note) => {
    // Check if the value is greater than 0
    if (notes[note] > 0) {
      setNotes({
        ...notes,
        [note]: notes[note] - 1,
      });
      setTotalBalance(totalBalance - parseInt(note));

      setErrorMessage(""); // Clear error message on valid action
    } else {
      setErrorMessage("Request invalid");
      Swal.fire("Request invalid!");
    }
  };

  const resetNoteCount = () => {
    const notesCopy = { ...notes };
    for (const noteKey in notesCopy) {
      if (Object.hasOwn(notesCopy, noteKey)) {
        notesCopy[noteKey] = 0;
      }
    }
    setNotes(notesCopy);
  };

  const handleChangeCurrency = (event) => {
    const selectedCurrency = event.target.value;
    convertCurrency(getActiveCurrency().type, selectedCurrency);
    setActiveCurrency(selectedCurrency);
  };
  // const handleRemoveDenominator = (note) => {
  //   const updatedNotes = { ...notes };
  //   const removedValue = updatedNotes[note];

  //   // Delete the selected denominator from notes
  //   delete updatedNotes[note];
  //   setNotes(updatedNotes);

  //   // Calculate the amount to subtract from total balance
  //   const amountToSubtract = removedValue * parseFloat(note); // Convert to number if needed
  //   setTotalBalance((prevBalance) => prevBalance - amountToSubtract);
  // };

  // useEffect(() => {
  //   setTotalBalance(calculateNotes());
  // }, [notes]);

  return (
    <div className="py-4 bg-gradient-to-r  from-[#6235f5] via-[#8e6df8] to-[#a994f5] md:h-screen pb-96 h-full">
      <header>
        <div className="flex flex-row mt-12 justify-center">
          <IoWalletSharp className="text-4xl mx-4" />
          <h1 className="text-center font-bold text-4xl ">Digital Wallet</h1>
        </div>
      </header>
      <main className="px-4">
        <div className="balance-section flex flex-row justify-center">
          <h2 className="font-semibold text-3xl text-center mt-6">
            Balance: {getActiveCurrency().symbol}
            {addCommasToNumber(totalBalance)}
          </h2>
          <select
            className="h-8 mt-7 mx-4 bg-gray-200 text-black rounded-md px-2"
            defaultValue="USD"
            value={getActiveCurrency().type}
            onChange={handleChangeCurrency}
          >
            <option value="BDT">BDT</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
        <div className="notes-input-section flex flex-col items-center">
          {/* the columns should be aligned, it does not look good with different horizontal spacing */}
          {Object.keys(notes).map((note) => (
            <div key={key}>
              {/* <button
                className="bg-red-500 text-white px-2 py-1 rounded-md mr-2"
                onClick={() => handleRemoveDenominator(note)}
              >
                X
              </button> */}
              <div className="mt-6" key={note}>
                <span className="">{note}</span>
                <button
                  className="bg-[#a086f6] md:px-6 px-4 py-1 md:mx-6 mx-2 border-2 rounded-lg border-[#6235f5]"
                  onClick={() => {
                    // DRY it
                    handleRemoveNote(note);
                  }}
                >
                  Remove
                </button>
                <button
                  className="bg-[#a086f6] md:px-6 px-4 py-1 md:mx-6 mx-2 border-2 rounded-lg border-[#6235f5]"
                  onClick={() => {
                    // DRY it
                    handleAddNote(note);
                  }}
                >
                  Add
                </button>
                <span>Currently In Wallet: {notes[note]}</span>
              </div>
            </div>
          ))}
        </div>

        {/* <div className='buttons-section flex justify-center mt-6'>
					<button
						className='bg-[#6235f5] px-6 py-2 border-2 border-[#a792f5] rounded-lg'
						onClick={handleReset}
					>
						Reset
					</button>
				</div> */}
      </main>
    </div>
  );
}
