import { useState } from "react";

export default function NoteInput({ addNote }) {
  const [denomination, setDenomination] = useState("");
  const [count, setCount] = useState("");

  const handleSubmit = () => {
    if (!denomination || !count) return;
    addNote({ denomination: Number(denomination), count: Number(count) });
    setDenomination("");
    setCount("");
  };

  return (
    <div className="mb-4">
      <input
        type="number"
        placeholder="Denomination"
        value={denomination}
        onChange={(e) => {
          return setDenomination(e.target.value);
        }}
      />
      <input
        type="number"
        placeholder="Count"
        value={count}
        onChange={(e) => setCount(e.target.value)}
      />
      <button onClick={handleSubmit}>Add Note</button>
    </div>
  );
}
