"use client";

import { useState } from "react";
import { IoWalletSharp } from "react-icons/io5";
import Swal from "sweetalert2";
export default function WalletApp() {
  const [notes, setNotes] = useState({
    $1: 0,
    $2: 0,
    $5: 0,
    $10: 0,
    $50: 0,
    $100: 0,
    $500: 0,
    $1000: 0,
  });
  const [errorMessage, setErrorMessage] = useState("");

  const totalBalance = Object.keys(notes).reduce((total, note) => {
    return total + notes[note] * parseInt(note.slice(1), 10);
  }, 0);

  const handleAddNote = (note) => {
    setNotes({
      ...notes,
      [note]: notes[note] + 1,
    });
  };
  const handleRemoveNote = (note) => {
    if (notes[note] > 0) {
      // Check if the value is greater than 0
      setNotes({
        ...notes,
        [note]: notes[note] - 1,
      });
      setErrorMessage(""); // Clear error message on valid action
    } else {
      setErrorMessage("Request invalid");
      Swal.fire("Request invalid!");
    }
  };

  const handleReset = () => {
    setNotes({
      $1: 0,
      $2: 0,
      $5: 0,
      $10: 0,
      $50: 0,
      $100: 0,
      $500: 0,
      $1000: 0,
    });
  };

  return (
    <div className="py-4 bg-gradient-to-r  from-[#6235f5] via-[#8e6df8] to-[#a994f5] h-screen">
      <header>
        <div className="flex flex-row mt-12 justify-center">
          <IoWalletSharp className="text-4xl mx-4" />
          <h1 className="text-center font-bold text-4xl ">Digital Wallet</h1>
        </div>
        {/* Navigation Links */}
      </header>
      <main className="px-4">
        <div className="balance-section">
          <h2 className="font-semibold text-3xl text-center mt-6">
            Total Balance: ${totalBalance}
          </h2>
        </div>
        <div className="notes-input-section flex flex-col items-center">
          {Object.keys(notes).map((note) => (
            <div className="mt-6" key={note}>
              <span className="">{note}</span>
              <button
                className="bg-[#a086f6] px-6 py-1 mx-6 border-2 rounded-lg border-[#6235f5]"
                onClick={() => handleRemoveNote(note)}
              >
                Remove
              </button>
              <button
                className="bg-[#a086f6] px-6 py-1 mx-6 border-2 rounded-lg border-[#6235f5]"
                onClick={() => handleAddNote(note)}
              >
                Add
              </button>
              <span>{notes[note]}</span>
            </div>
          ))}
        </div>
        <div className="buttons-section flex justify-center mt-6">
          <button
            className="bg-[#6235f5] px-6 py-2 border-2 border-[#a792f5] rounded-lg"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </main>
      <footer>{/* Footer Links */}</footer>
    </div>
  );
}
