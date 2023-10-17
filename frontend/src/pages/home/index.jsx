import React, { useState } from "react";
import { events } from "../../utils/events";
import Category from "./components/category";
import Card from "./components/card";
import "./index.css";

function Home() {
  const [category, setCategory] = useState("All Events");

  let filteredEvents = events?.filter((item) => {
    if (category === "All Events") {
      return item;
    } else {
      return item.category === category;
    }
  });


  return (
    <div className="homeWrapper">
      <Category category={category} setCategory={setCategory} />

      {events === null ? (
        <div className="homeNoEvents">
          <span>Events are loading...</span>
        </div>
      ) : events === false || events === undefined ? (
        <div className="homeNoEvents">
          <span>Someting went wrong. Please try again later.</span>
        </div>
      ) : filteredEvents?.length == 0 ? (
        <div className="homeNoEvents">
          <span>There is no event in this category.</span>
        </div>
      ) : (
        <div className="homeEvents">
          {filteredEvents?.map((item, index) => {
            return <Card key={index} index={index} item={item} />;
          })}
        </div>
      )}
    </div>
  );
}

export default Home;
