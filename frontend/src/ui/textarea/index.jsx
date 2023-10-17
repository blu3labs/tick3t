import React from "react";
import "./index.css";

function Textarea({ title, error, ...props }) {
  return (
    <div className="uiInputWrapper">
      <span>{title}</span>
      <textarea
        {...props}
        style={{
          borderColor: error && "var(--accent-color)",
        }}
      />
      <p>{error}</p>
    </div>
  );
}

export default Textarea;
