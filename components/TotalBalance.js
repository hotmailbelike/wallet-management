export default function TotalBalance({ notes }) {
  const total = notes.reduce(
    (acc, curr) => acc + curr.denomination * curr.count,
    0
  );
  return <div>Total Balance: ${total}</div>;
}
