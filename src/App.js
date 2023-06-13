import { useState } from "react";

// const initialItems = [
//   { id: 1, description: "Passports", quantity: 2, packed: false },
//   { id: 2, description: "Socks", quantity: 12, packed: false },
//   { id: 3, description: "Charger", quantity: 12, packed: false },
// ];

export default function App() {
  const [parkItem, setParkItem] = useState([]);

  const addParkItem = function (item) {
    setParkItem((prev) => [...prev, item]);
  };

  const handleDeleteItem = function (id) {
    setParkItem((prev) => prev.filter((item) => item.id !== id));
  };

  const handleToggleItem = function (id) {
    setParkItem((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : { ...item }
      )
    );
  };

  const handleClearAll = function () {
    const confirmed = window.confirm(
      "Are you sure you want to remove all items from your list?"
    );
    if (confirmed) setParkItem([]);
  };

  return (
    <div className="app">
      <Logo />
      <Form onAddItem={addParkItem} />
      <ParkingList
        onDeleteItem={handleDeleteItem}
        items={parkItem}
        onToggleItem={handleToggleItem}
        onClick={handleClearAll}
      />
      <Stats items={parkItem} />
    </div>
  );
}

function Logo() {
  return <h1>🌴 FAR AWAY 💼</h1>;
}

function Form({ onAddItem }) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = function (e) {
    e.preventDefault();
    if (!description) return;
    // if (description.length === 0) return;

    const newItem = {
      description,
      quantity,
      packed: false,
      id: Date.now(),
    };

    onAddItem(newItem);

    setDescription("");
    setQuantity(1);
  };

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need for your 😍 trip?</h3>
      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      >
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option key={num} value={num}>
            {num}
          </option>
        ))}
      </select>
      <input
        type="text"
        value={description}
        placeholder="item..."
        onChange={(e) => setDescription(e.target.value)}
      />
      <button>Add</button>
    </form>
  );
}

function ParkingList({ items, onDeleteItem, onToggleItem, onClick }) {
  const [sortBy, setSortBy] = useState("input");
  let sortedItems;

  if (sortBy === "input") sortedItems = items;

  if (sortBy === "description")
    sortedItems = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));
  if (sortBy === "parked")
    sortedItems = items.slice().sort((a, b) => Number(b.packed - a.packed));

  if (sortBy === "number")
    sortedItems = items.slice().sort((a, b) => b.quantity - a.quantity);

  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => (
          <Item
            item={item}
            onToggleItem={onToggleItem}
            onDeleteItem={onDeleteItem}
            key={item.id}
          />
        ))}
      </ul>
      <div className="actions">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">Sort by input</option>
          <option value="description">Sort by description</option>
          <option value="parked">Sort by parked status</option>
          <option value="number">Sort by number</option>
        </select>
        <button onClick={onClick}>Clear all</button>
      </div>
    </div>
  );
}

function Item({ item, onDeleteItem, onToggleItem }) {
  return (
    <li>
      <input
        type="checkbox"
        value={item.packed}
        onChange={() => onToggleItem(item.id)}
      />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>
      <button onClick={() => onDeleteItem(item.id)}>❌</button>
    </li>
  );
}

function Stats({ items }) {
  const totalItem = items.length;
  const totalPacked = items
    .filter((item) => item.packed)
    .map((el) => !el.packed).length;
  const percentage = Math.ceil((totalPacked / totalItem) * 100);

  return (
    <footer className="stats">
      {percentage !== 100 ? (
        <em>
          {totalPacked > 0
            ? ` 💼 You have ${totalItem} items on your list and you already parked
        ${totalPacked} (${percentage}%)`
            : "Start addding some items to your packing list 🎁"}
        </em>
      ) : (
        "You got everything ready!! Enjoy your trip 🚀"
      )}
    </footer>
  );
}
