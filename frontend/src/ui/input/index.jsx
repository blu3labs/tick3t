import React from "react";
import "./index.css";

function Input({ title, error, ...props }) {
  return (
    <div className="uiInputWrapper">
      <span>{title}</span>
      <input
        {...props}
        style={{
          borderColor: error && "var(--accent-color)",
        }}
      />
      <p>{error}</p>
    </div>
  );
}

export default Input;
