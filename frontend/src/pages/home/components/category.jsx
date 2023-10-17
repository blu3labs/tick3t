import React from "react";
import { categoryList } from "@/utils/categoryDetail";
import "../index.css";

function Category({ category, setCategory }) {


  return (
    <div className="homeTopArea">
    <div className="homeCategory">
      {categoryList.map((item, index) => {
        return (
          <button
            key={index}
            className={
              category === item
                ? "homeCategoryItem homeActiveCategory"
                : "homeCategoryItem"
            }
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        );
      })}
    </div>
    </div>
  );
}

export default Category;
