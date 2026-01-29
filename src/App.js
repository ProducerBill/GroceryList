import { useState, useEffect, useRef } from "react";
import useSessionStorage from "./Components/useSessionStorage";
import "./App.css";

const shoppingList = [
  { id: 1, name: "Something", gotIt: false, amount: 1 },
  { id: 2, name: "Something Else", gotIt: false, amount: 5 },
];

export default function App() {
  return (
    <div className="app">
      <GroceryListApp />
    </div>
  );
}

function GroceryListApp() {
  const [showAdd, setShowAdd] = useState(false);

  //const [shoppingItems, setShoppingItems] = useState(shoppingList);
  const [shoppingItems, setShoppingItems] = useSessionStorage(
    "shoppingList",
    [],
  );

  function handleShowAdd() {
    setShowAdd(!showAdd);
  }

  function handleAddItem(item) {
    setShoppingItems((items) => [...items, item]);
    handleShowAdd();
  }

  function handleDeleteItem(id) {
    setShoppingItems((shoppingItems) =>
      shoppingItems.filter((item) => item.id !== id),
    );
  }

  function handleCompleteItem(id) {
    setShoppingItems((shoppingItems) =>
      shoppingItems.map((curItem) =>
        curItem.id === id ? { ...curItem, gotIt: !curItem.gotIt } : curItem,
      ),
    );
  }

  function handleClearList() {
    setShoppingItems([]);
  }

  return (
    <div>
      <div className="grocerylist">
        {shoppingItems && (
          <GroceryList
            items={shoppingItems}
            onDeleteItem={handleDeleteItem}
            onCompleteItem={handleCompleteItem}
          />
        )}
        <div className="list-control">
          <Button onClick={handleShowAdd}>
            {showAdd ? "Close" : "Add Item"}
          </Button>
          <Button onClick={handleClearList}>Clear List</Button>
        </div>
      </div>
      {showAdd && (
        <div className="grocery-add-form">
          <FormAddItem onSubmit={handleAddItem} onCancel={handleShowAdd} />
        </div>
      )}
    </div>
  );
}

function GroceryList({ items, onDeleteItem, onCompleteItem }) {
  return (
    <>
      <h2>🍍Grocery Items🥕</h2>
      {items.length > 0 && (
        <ul>
          {items.map((item) => (
            <GroceryItem
              item={item}
              onDeleteItem={onDeleteItem}
              onCompleteItem={onCompleteItem}
              key={item.id}
            />
          ))}
        </ul>
      )}
    </>
  );
}

function GroceryItem({ item, onDeleteItem, onCompleteItem }) {
  const [complete, setComplete] = useState(item.gotIt);

  function handleComplete() {
    setComplete(!complete);
    onCompleteItem(item.id);
  }

  return (
    <div>
      <li>
        <div className="item">
          <input
            type="checkbox"
            value={item.complete}
            onChange={handleComplete}
          />
          <p className={complete ? "complete" : "something"}>
            {item.amount > 0 ? `${item.name} Qty: ${item.amount}` : item.name}
          </p>
          <Button onClick={() => onDeleteItem(item.id)}>❌</Button>
        </div>
      </li>
    </div>
  );
}

function FormAddItem({ onSubmit, onCancel }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);

  //Creating the ref to pull focus
  const inputRef = useRef(null);

  useEffect(() => {
    //Focus on input
    inputRef.current.focus();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    if (name === "") return;

    const id = crypto.randomUUID();

    const newItem = {
      id: id,
      name: name,
      gotIt: false,
      amount: amount,
    };

    onSubmit(newItem);

    resetForm();
  }

  function resetForm() {
    setName("");
    setAmount(0);
  }

  function handleCancel() {
    resetForm();
    onCancel();
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Item Name: </label>
          <input
            type="text"
            value={name}
            placeholder="Enter Name..."
            onChange={(e) => setName(e.target.value)}
            ref={inputRef}
          />
        </div>
        <div>
          <label>Qty of: </label>
          <input
            type="number"
            placeholder="Amount of item"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>
        <div>
          <Button>Add</Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}

function Button({ children, onClick }) {
  return <button onClick={onClick}>{children}</button>;
}
