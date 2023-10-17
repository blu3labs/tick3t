import React from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { MdOutlineEventNote } from "react-icons/md";
import { BsTicketPerforated } from "react-icons/bs";
import "../index.css";

function Card({ index, item }) {
  return (
    <div className="myTicketsCard" key={index}>
      <div class="myTicketsCardLeft">
        <img src={item.image} alt={item.title} />
        <button
          disabled={item.status === "past"}
          style={{
            cursor: item.status === "past" ? "not-allowed" : "pointer",
            opacity: item.status === "past" ? "0.5" : "1",
          }}
        >
          Generate QR
        </button>
      </div>

      <div class="myTicketsCardRight">
        <div className="myTicketsCardItem">
          <MdOutlineEventNote className="myTicketsCardIcon" />
          <span>{item.title}</span>
        </div>

        <div className="myTicketsCardItem">
          <FaRegCalendarAlt className="myTicketsCardIcon" />
          <span>
            {item.date}
            {item.clock ? ", " + item.clock : ""}
          </span>
        </div>

        <div className="myTicketsCardItem">
          <HiOutlineLocationMarker className="myTicketsCardIcon" />
          <span>{item.location}</span>
        </div>

        <div className="myTicketsCardItem">
          <BsTicketPerforated className="myTicketsCardIcon" />
          <span>{item.seat}</span>
        </div>
      </div>
    </div>
  );
}

export default Card;
