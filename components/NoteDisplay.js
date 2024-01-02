export default function NoteDisplay({ notes }) {
  return (
    <div>
      {notes.map((note, index) => (
        <div key={index}>
          ${note.denomination} x {note.count}
        </div>
      ))}
    </div>
  );
}
