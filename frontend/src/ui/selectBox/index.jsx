import React from "react";
import { Select } from "antd";
import "./index.css";

function SelectBox({ title, ...props }) {
  return (
    <div className="uiInputWrapper">
      <span>{title}</span>
      <Select {...props} />
    </div>
  );
}

export default SelectBox;
