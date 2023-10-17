import React, { useState } from "react";
import HeaderTab from "./components/headerTab";
import "./index.css";
import { myTickets } from "../../utils/myTickets";
import Card from "./components/card";

function MyTickets() {
  const [tab, setTab] = useState("All");

  let filteredTickets = myTickets?.filter((item) => {
    if (tab === "All") {
      return item;
    } else {
      return item.status?.toLowerCase() === tab?.toLowerCase();
    }
  });

  return (
    <div className="myTicketsWrapper">
      <HeaderTab tab={tab} setTab={setTab} />

      {myTickets === null ? (
        <div className="noMyTickets">
          <span>Tickets are loading...</span>
        </div>
      ) : myTickets === false || myTickets === undefined ? (
        <div className="noMyTickets">
          <span>Someting went wrong. Please try again later.</span>
        </div>
      ) : filteredTickets?.length == 0 ? (
        <div className="noMyTickets">
          <span>There is no tickets.</span>
        </div>
      ) : (
        <div className="myTickets">
          {filteredTickets?.map((item, index) => {
            return <Card key={index} index={index} item={item} />;
          })}
        </div>
      )}
    </div>
  );
}

export default MyTickets;
