import React from "react";
import "../index.css";

function HeaderTab({ tab, setTab }) {
  let tabList = ["All","Active", "Past"];

  return (
    <div className="myTicketsHeader">
      <div className="myTicketsTitle">My Tickets</div>

      <div className="myTicketsTab">
        {tabList.map((item, index) => {
          return (
            <button
              key={index}
              className={`myTicketsTabItem ${
                tab === item && "myTicketsTabItemActive"
              }`}
              onClick={() => setTab(item)}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default HeaderTab;
