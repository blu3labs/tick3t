import React from "react";
import { Link } from "react-router-dom";
import { categoryColor } from "@/utils/categoryDetail";
import { FaRegCalendarAlt } from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";
import moment from "moment"
import "../index.css";

function Card({ index, item }) {
  return (
    <Link to={`event/${item.address}`} className="homeEventCard" key={index}>
      <img src={item.image} alt={item.title} draggable="false" />
      <div
        className="homeEventCategoryColor"
        style={{
          background: categoryColor[item.category],
        }}
      ></div>
      <div className="homeEventCardInfo">
        <div className="homeEventCardInfoTop">
          <div className="homeEventCardTitle">{item.title}</div>
          <div className="homeEventCardDateClock">
            <div className="homeEventCardDate">
              <FaRegCalendarAlt className="homeEventCardDateIcon" />
              <span>{moment(item.date * 1000).format("DD.MM.YYYY")}</span>
            </div>
            <div className="homeEventCardClock">{moment(item.date * 1000).format("HH:MM")}</div>
          </div>
        </div>
        <div className="homeEventCardLocation">
          <HiOutlineLocationMarker className="homeEventCardLocationIcon" />
          <span>{item.venue}</span>
        </div>
      </div>
    </Link>
  );
}

export default Card;
