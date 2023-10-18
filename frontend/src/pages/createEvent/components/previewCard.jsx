import React from "react";
import { categoryColor } from "@/utils/categoryDetail";
import { FaRegCalendarAlt } from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";
import "../index.css";
import moment from "moment";
import UploadFile from "./uploadFile";

function PreviewCard({ title, category, venue, date, clock, image, setImage }) {
  return (
    <div
      className="homeEventCard"
      style={{
        cursor: "auto",
      }}
    >
      <UploadFile image={image} setImage={setImage} />
      <div
        className="homeEventCategoryColor"
        style={{
          background: categoryColor[category ?? ""],
        }}
      ></div>
      <div className="homeEventCardInfo">
        <div className="homeEventCardInfoTop">
          <div className="homeEventCardTitle">{title ? title : "Title"}</div>
          <div className="homeEventCardDateClock">
            <div className="homeEventCardDate">
              <FaRegCalendarAlt className="homeEventCardDateIcon" />
              <span>
                {date
                  ? moment(date * 1000)
                      .utc()
                      .format("DD.MM.YYYY")
                  : "Date"}
              </span>
            </div>
            <div className="homeEventCardClock">
              {date
                ? moment(date * 1000)
                    .utc()
                    .format("HH:mm")
                : ""}
            </div>
          </div>
        </div>
        <div className="homeEventCardLocation">
          <HiOutlineLocationMarker className="homeEventCardLocationIcon" />
          <span>{venue ? venue : "Location"}</span>
        </div>
      </div>
    </div>
  );
}

export default PreviewCard;
