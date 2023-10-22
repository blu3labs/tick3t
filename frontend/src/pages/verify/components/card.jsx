import React from "react";
import { Link } from "react-router-dom";
import { categoryColor } from "@/utils/categoryDetail";
import { FaRegCalendarAlt } from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";
import moment from "moment";
import "../index.css";
import { BsTicketPerforated } from "react-icons/bs";

let categoryId = {
  1: "Diamond",
  2: "Gold",
  3: "General",
};

function Card({ index, item, dataQuery, onClick, loading, success }) {
  return (
    <>
    {item === {} && <span>Loading...</span>}
      {item !== {} &&  (<Link
        className="verifyEventCard"
        key={index}
      >
        <img src={item.image} alt={item.title} draggable="false" />
        <div
          className="verifyEventCategoryColor"
          style={{
            background: categoryColor[item.category],
          }}
        ></div>
        <div className="verifyEventCardInfo">
          <div className="verifyEventCardInfoTop">
            <div className="verifyEventCardTitle">{item.title}</div>
            <div className="verifyEventCardDateClock">
              <div className="verifyEventCardDate">
                <FaRegCalendarAlt className="verifyEventCardDateIcon" />
                <span>
                  {moment(item.date * 1000)
                    .utc()
                    .format("DD.MM.YYYY")}
                </span>
              </div>
              <div className="verifyEventCardClock">
                {moment(item.date * 1000)
                  .utc()
                  .format("HH:mm")}
              </div>
            </div>
          </div>
          <div className="verifyEventCardLocation">
            <HiOutlineLocationMarker className="verifyEventCardLocationIcon" />
            <span>{item.venue}</span>
          </div>

          <div className="verifyMyTicket">
            <BsTicketPerforated className="myTicketsCardIcon" />

            <span>
              {item.venue === "The Avenue, Paris"
                ? categoryId[dataQuery.ticketId]
                : "Seat " + dataQuery?.ticketId}
            </span>
          </div>
        </div>
      </Link>)}
      <div className="buttonVerify">
         <button
        onClick={ success ? () => {} : onClick}
          style={{
            cursor: loading ? "default": "pointer",
            opacity:   loading ? "0.5": "1",
          }}
        >
         {success ? "Verified successfuly!" : "Verify"}
        </button>
      </div>
    </>
  );
}

export default Card;
