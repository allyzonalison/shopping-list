import { useState } from "react";

const initialItems = [
  {
    id: 1,
    item_name: "Banana",
    quantity: 5,
    price: 10,
  },
  {
    id: 2,
    item_name: "Chicken",
    quantity: 1,
    price: 50,
  },
  {
    id: 3,
    item_name: "Eggs",
    quantity: 5,
    price: 10,
  },
];

export default function App() {
  const [items, setItems] = useState(initialItems);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showComponents, setShowComponents] = useState(true);

  const [selectedItem, setSelectedItem] = useState(null);

  const totalItems = items.reduce((acc, cur) => acc + cur.quantity, 0);
  const totalPrice = items.reduce((acc, cur) => acc + cur.price, 0);

  function handleShowUpdateForm() {
    setShowUpdateForm(true);
    setShowComponents(false);
  }

  function handleGoBack() {
    setShowUpdateForm(false);
    setShowComponents(true);
  }

  //ADDING ITEMS
  function handleAddItems(item) {
    setItems((curItems) => curItems.concat(item));
  }

  //DELETING THE ITEMS
  function handleDeleteItem(id) {
    setItems((curItems) => curItems.filter((cur) => cur.id !== id));
  }

  //UPDATING ITEMS
  function handleUpdateItem(
    itemID,
    updatedName,
    updatedQuantity,
    updatedPrice
  ) {
    setItems((curItems) =>
      curItems.map((cur) =>
        cur.id === itemID
          ? {
              ...cur,
              item_name: updatedName,
              quantity: updatedQuantity,
              price: updatedPrice,
            }
          : cur
      )
    );
  }

  //SELECTED ITEM
  function handleSelected(item) {
    setSelectedItem((curItem) => (curItem.id === item.id ? item : null));
  }

  return (
    <div>
      <Heading />
      {showComponents && <InputItems onAddItems={handleAddItems} />}
      (
      <ListBox
        items={items}
        onDeleteItem={handleDeleteItem}
        onUpdateItem={handleShowUpdateForm}
        onShowUpdateForm={showUpdateForm}
        onGoBack={handleGoBack}
        onSelected={handleSelected}
        onUpdateMainItem={handleUpdateItem}
      />
      )
      <Footer totalItems={totalItems} totalPrice={totalPrice} />
    </div>
  );
}

function Heading() {
  return (
    <div className="heading">
      <h3>MY SHOPPING LIST</h3>
    </div>
  );
}

function InputItems({ onAddItems }) {
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState(1);
  const [itemPrice, setItemPrice] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setItemName("");
    setItemQuantity(1);
    setItemPrice("");

    const newItem = {
      id: Date.now(),
      item_name: itemName,
      quantity: itemQuantity,
      price: itemPrice,
    };

    onAddItems(newItem);
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Input item..."
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
      />
      <select
        value={itemQuantity}
        onChange={(e) => setItemQuantity(Number(e.target.value))}
      >
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num}>{num}</option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Price per unit"
        value={itemPrice}
        onChange={(e) => setItemPrice(Number(e.target.value))}
      />
      <button className="btn-add">ADD</button>
    </form>
  );
}

//this must overflow
function ListBox({
  items,
  onDeleteItem,
  onUpdateItem,
  onShowUpdateForm,
  onGoBack,
  onSelected,
  onUpdateMainItem,
}) {
  return (
    <div className="list-box">
      <ul>
        {items.map((item) => (
          <>
            <ListItem
              key={item.id}
              item={item}
              onDeleteItem={onDeleteItem}
              onUpdateItem={onUpdateItem}
            />
            {onShowUpdateForm && (
              <UpdateForm
                key={item.id}
                item={item}
                onGoBack={onGoBack}
                onSelected={onSelected}
                onUpdateMainItem={onUpdateMainItem}
              />
            )}
          </>
        ))}
      </ul>
    </div>
  );
}

function ListItem({ item, onDeleteItem, onUpdateItem }) {
  return (
    <li className="list-item">
      <div className="item-details">
        <p className="item-name">{item.item_name}</p>
        <p className="quantity">Quantity: {item.quantity}</p>
        <p className="total-price">Total Price: {item.price}</p>
      </div>
      <div className="item-icons">
        <button onClick={() => onUpdateItem()}>📝</button>
        <button onClick={() => onDeleteItem(item.id)}>❌</button>
      </div>
    </li>
  );
}

function Footer({ totalItems, totalPrice }) {
  return (
    <div className="footer">
      <p>Total Items: {totalItems}</p>
      <p>Total Price: {totalPrice}</p>
    </div>
  );
}

function UpdateForm({ onGoBack, item, onSelected, onUpdateMainItem }) {
  //CONTROLLED ELEMENTS OF THIS UPDATE FORM - ALMOST FORGOT
  const [updatedName, setUpdatedName] = useState(item.item_name);
  const [updatedQuantity, setUpdatedQuantity] = useState(item.quantity);
  const [updatedPrice, setUpdatedPrice] = useState(item.price);

  function handleSubmit2(e) {
    e.preventDefault(e);
  }

  return (
    <form className="update-form" onSubmit={handleSubmit2}>
      <button className="btn-back" onClick={() => onGoBack()}>
        ◀
      </button>
      <input
        type="text"
        placeholder={item.item_name}
        className="input-update"
        value={updatedName}
        onChange={(e) => setUpdatedName(e.target.value)}
      />
      <select
        className="update-select"
        value={updatedQuantity}
        onChange={(e) => setUpdatedQuantity(e.target.value)}
      >
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num}>{num}</option>
        ))}
      </select>
      <input
        type="text"
        placeholder={item.price}
        className="input-update"
        value={updatedPrice}
        onChange={(e) => setUpdatedPrice(e.target.value)}
      />
      <button
        className="btn-update"
        onClick={() =>
          onUpdateMainItem(item.id, updatedName, updatedQuantity, updatedPrice)
        }
      >
        UPDATE
      </button>
    </form>
  );
}
