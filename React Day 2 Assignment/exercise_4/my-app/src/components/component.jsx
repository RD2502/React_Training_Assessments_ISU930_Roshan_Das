import React, { useState } from "react";

export default function Product({ name, price }) {
  const [isEditing, setIsEditing] = useState(false);
  const [productName, setProductName] = useState(name);

  return (
    <div>
      {isEditing ? (
        <input
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
      ) : (
        <h1>{productName}</h1>
      )}

      <p>Price: Rs{price}</p>

      <button onClick={() => setIsEditing(!isEditing)}>
        Toggle Edit
      </button>
    </div>
  );
}