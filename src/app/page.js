"use client";
/**
 * Assumptions:
 * No decimal balance value
 * Changing currency will reset denominator count
 * Removing a denominator will remove it from the total balance as well
 */

// TODO:
// Fix the column spacing
// Position and Style the select box
// Show loading for conversion to be done
// Input on the bottom to add denominator
// X mark to remove denominator
// Changing Currency should prompt the user, "Are you sure you want to switch currencies? You will lose count of your notes." then another prompt, "Do you want to convert your current balance to BDT/USD/EUR or start from 0 balance?"
// Persistance using local storage
// add the denominators in local storage as well
// scan the file for other comments
// adding notes to new balance should not start from 0
// remove the built in alerts with the Swal fire

import { useState, useEffect } from "react";
import { IoWalletSharp } from "react-icons/io5";
import Swal from "sweetalert2";
import {
  defaultUSDDenominators,
  defaultEURDenominators,
  defaultBDTDenominators,
  addCommasToNumber,
} from "../utils/utils";
import {
  loadData,
  populateLocalDenominatorsWithDefaultValues,
  saveWalletData,
  updateActiveCurrencyDenominator,
} from "../utils/storage";

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

  const setActiveCurrency = (currencyType) => {
    setCurrencies((prevCurrencies) =>
      prevCurrencies.map((currency) => {
        currency.active = currency.type == currencyType;
        if (currency.active) {
          const updatedNotes = setDenominatorNotes(currency.denominators);

          updateActiveCurrencyDenominator(currency.type, currency.denominators);
          saveWalletData(totalBalance, updatedNotes, currency.type);
        }

        return currency;
      })
    );
  };

  const getActiveCurrency = () =>
    currencies.find((currency) => currency.active);

  const setDenominatorNotes = (denominators) => {
    const notesObj = {};

    denominators.forEach((denominator) => (notesObj[denominator] = 0));

    setNotes(notesObj);

    return notesObj;
  };

  const [inputNumber, setInputNumber] = useState("");

  const handleAddDenominator = () => {
    const activeCurrency = getActiveCurrency();

    // Check if the inputNumber is a valid number and not already in the denominators array
    const newDenominator = parseInt(inputNumber, 10);
    if (
      !isNaN(newDenominator) &&
      !activeCurrency.denominators.includes(newDenominator)
    ) {
      const updatedDenominators = [
        ...activeCurrency.denominators,
        newDenominator,
      ];
      const sortedDenominators = updatedDenominators.sort((a, b) => a - b); // Sort the array in ascending order
      // activeCurrency.denominators = sortedDenominators; // Update the denominators array
      setCurrencies((prevCurrencies) =>
        prevCurrencies.map((currency) => ({
          ...currency,
          denominators: currency.active
            ? sortedDenominators
            : currency.denominators,
        }))
      );
      setInputNumber(""); // Clear the input field
      // setCurrencies([...currencies]); // Update the currencies state to trigger a re-render
      const newNotes = { ...notes, [newDenominator]: 0 };
      setNotes(newNotes);

      updateActiveCurrencyDenominator(activeCurrency.type, sortedDenominators);
      saveWalletData(totalBalance, newNotes, activeCurrency.type);
    } else {
      // Handle duplicate or invalid input
      alert("Please enter a unique valid number.");
    }
  };

  const handleRemoveDenominator = async (note) => {
    const result = await Swal.fire({
      title: "Are you sure you want to delete the denominator?",
      text: "Deleting denominator will also remove its count from total balance!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      // User clicked "Yes, delete it!" button
      Swal.fire({
        title: "Deleted!",
        text: "Denominator has been deleted.",
        icon: "success",
      });

      // If user confirmed, proceed with removal

      const updatedNotes = { ...notes };
      const removedValue = updatedNotes[note];

      // Delete the selected denominator from notes
      delete updatedNotes[note];
      setNotes(updatedNotes);

      // Calculate the amount to subtract from total balance
      const amountToSubtract = removedValue * parseFloat(note); // Convert to number if needed
      const newBalance = totalBalance - amountToSubtract;
      setTotalBalance(newBalance);

      let { denominators, type } = getActiveCurrency();
      const newDenominators = denominators.filter(
        (denominator) => denominator != note
      );

      const newCurrencies = [...currencies].map((currency) => {
        if (currency.active) currency.denominators = newDenominators;
        return currency;
      });

      setCurrencies(newCurrencies);

      updateActiveCurrencyDenominator(type, newDenominators);
      saveWalletData(newBalance, updatedNotes, type);
    } else {
      // If user canceled, do nothing
      Swal.fire("Cancelled", "Your operation has been cancelled :)", "error");
      return;
    }
  };

  const [notes, setNotes] = useState({});

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
      const resetNotes = resetNoteCount();

      saveWalletData(toDesiredCurrency, resetNotes, toCurrency);

      return toDesiredCurrency;
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleAddNote = (note) => {
    const updatedNotes = {
      ...notes,
      [note]: notes[note] + 1,
    };
    setNotes(updatedNotes);
    const newBalance = totalBalance + parseInt(note);
    setTotalBalance(newBalance);

    saveWalletData(newBalance, updatedNotes, getActiveCurrency().type);
  };

  const handleRemoveNote = (note) => {
    // Check if the value is greater than 0
    if (notes[note] > 0) {
      const updatedNotes = {
        ...notes,
        [note]: notes[note] - 1,
      };
      setNotes(updatedNotes);
      const newBalance = totalBalance - parseInt(note);
      setTotalBalance(newBalance);

      setErrorMessage(""); // Clear error message on valid action
      saveWalletData(newBalance, updatedNotes, getActiveCurrency().type);
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
    return notesCopy;
  };

  const handleChangeCurrency = async (event) => {
    // Show the first confirmation dialog
    // const firstConfirmation = await Swal.fire({
    //   title: "Are you sure?",
    //   text: "You will lose count of your notes.",
    //   icon: "warning",
    //   showCancelButton: true,
    //   confirmButtonColor: "#3085d6",
    //   cancelButtonColor: "#d33",
    //   confirmButtonText: "Yes, switch currencies!",
    // });
    const selectedCurrency = event.target.value;
    if (/* firstConfirmation.isConfirmed */ true) {
      // Show the second confirmation dialog
      // const secondConfirmation = await Swal.fire({
      //   title:
      //     "Do you want to convert your current balance to " +
      //     selectedCurrency +
      //     "?",
      //   text: 'Press "Yes" to convert your balance or "Cancel" to start from 0 balance.',
      //   icon: "question",
      //   showCancelButton: true,
      //   confirmButtonColor: "#3085d6",
      //   cancelButtonColor: "#d33",
      //   confirmButtonText: "Yes",
      // });

      if (/* secondConfirmation.isConfirmed */ true) {
        // Perform the conversion logic here, for example:
        convertCurrency(getActiveCurrency().type, event.target.value);
        setActiveCurrency(event.target.value);
        // Show success message or perform other actions if needed
        Swal.fire("Converted!", "Your balance has been converted.", "success");
      } else {
        // Start from 0 balance logic here
        setActiveCurrency(event.target.value);
        // Show a message or perform other actions if needed
        Swal.fire(
          "Switched!",
          "You are now using " + event.target.value,
          "success"
        );
      }
    } else {
      // User canceled the first confirmation dialog
      // You can show a message or perform other actions if needed
      Swal.fire("Cancelled", "Currency change cancelled.", "error");
    }
  };

  useEffect(() => {
    const denominators = loadData("denominators");
    const walletData = loadData("walletData");

    if (!denominators || !walletData) {
      setActiveCurrency("USD");
      populateLocalDenominatorsWithDefaultValues();
    } else if (denominators && walletData) {
      const { balance, notes, activeCurrency } = walletData;

      setTotalBalance(balance);
      setNotes(notes);
      setCurrencies((prev) =>
        prev.map((data) => {
          data.active = data.type == activeCurrency;
          data.denominators = denominators[data.type];
          return data;
        })
      );
    }
  }, []);

  return (
    <div className="py-4 bg-gradient-to-r  from-[#6235f5] via-[#8e6df8] to-[#a994f5] pb-96 h-full">
      <header>
        <div className="flex flex-row mt-12 justify-center">
          <IoWalletSharp className="text-4xl mx-4" />
          <h1 className="text-center font-bold text-4xl ">Digital Wallet</h1>
        </div>
      </header>
      <main className="px-4">
        <div className="balance-section flex flex-row justify-center">
          <h2 className="font-semibold text-3xl text-center mt-6">
            Balance: {getActiveCurrency()?.symbol}
            {addCommasToNumber(totalBalance)}
          </h2>
          <select
            className="h-8 mt-7 mx-4 bg-gray-200 text-black rounded-md px-2"
            defaultValue="USD"
            value={getActiveCurrency()?.type}
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
            <div className="flex flex-row">
              <button
                className=" text-red-700 bg-white mt-6 px-3 py-1 text-md rounded-md mx-4"
                onClick={() => handleRemoveDenominator(note)}
              >
                X
              </button>
              <div className="mt-6 " key={note}>
                <span className="text-center">{note}</span>

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
          <div className="flex flex-row items-center">
            <input
              type="number"
              value={inputNumber}
              onChange={(e) => setInputNumber(e.target.value)}
              className="text-black rounded-md px-4 py-2 mt-8"
              placeholder="Add denominator"
            />
            <button
              onClick={handleAddDenominator}
              className="bg-[#a086f6] mt-8 h-12 md:px-6 px-4 py-1 md:mx-6 mx-2 border-2 rounded-lg border-[#6235f5]"
            >
              Add
            </button>
          </div>
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
