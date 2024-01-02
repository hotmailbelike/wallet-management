export const saveNotes = (notes) => {
  localStorage.setItem("walletNotes", JSON.stringify(notes));
};

export const loadNotes = () => {
  const notes = localStorage.getItem("walletNotes");
  return notes ? JSON.parse(notes) : null;
};
