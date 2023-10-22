import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FaRegCalendarAlt } from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { BsTicketPerforated } from "react-icons/bs";
import { LiaSitemapSolid } from "react-icons/lia";
import PreviewLocation from "../createEvent/components/previewLocation";
import axios from "axios";
import moment from "moment";
import { BACKEND_API_URL } from "../../utils/apiUrls";

import "./index.css";
import { useSelector } from "react-redux";

function Event() {
  const { id } = useParams();

  const { safeAuthSignInResponse, activeAddress } = useSelector(
    (state) => state.auth
  );

  const [data, setData] = useState(null);
  const getEvent = async () => {
    try {
      const { data: res } = await axios.get(`${BACKEND_API_URL}/event/${id}`);

      if (res?.status == 200) {
        setData(res?.data);
      } else {
        setData(false);
      }
    } catch (err) {
      console.log(err);
      setData(false);
    }
  };

  useEffect(() => {
    getEvent();

    let interval = setInterval(
      () => {
        getEvent();
      },

      10_000
    );

    return () => {
      clearInterval(interval);
    };
  }, [id]);

  const getCurrentTime = () => {
    const utcDate = moment.utc().format();
    let seconds = new Date(utcDate).getTime() / 1000;
    return seconds;
  };

  let buyButtonDisabled = () => {
    if (!safeAuthSignInResponse || !activeAddress) {
      return true;
    }

    if (parseFloat(data?.date) < getCurrentTime()) {
      return true;
    } else {
      return false;
    }
  };

  if (data === null) {
    return (
      <div className="eventWrapper">
        <div className="eventLoading">
          <span>Event Loading...</span>
        </div>
      </div>
    );
  } else if (data === false || data === undefined) {
    return (
      <div className="eventWrapper">
        <div className="eventLoading">
          <span>Event not found.</span>
        </div>
      </div>
    );
  } else {
    return (
      <div className="eventWrapper">
        <div className="eventDetailWrapper">
          <div className="eventLeftWrapper">
            <div className="eventDetailTitle">
              <span>{data.title}</span>
            </div>
            <div className="eventDetailImage">
              <img src={data.image} alt={data.title} draggable="false" />
            </div>
            <div className="eventDetailDesc">
              <span>{data.description}</span>
            </div>

            {/* <div className="eventDetailChatArea">
              <span>CHAT AREA</span>
            </div> */}
          </div>
          <div className="eventRightWrapper">
            <div className="eventRightTitle">
              <span>Details</span>
            </div>

            <div className="eventRightDetailItem">
              <div className="eventRightDetailItemHeader">
                <FaRegCalendarAlt className="eventRightDetailItemIcon" />
                <span>Date</span>
              </div>
              <div className="eventRightDetailItemContent">
                <span>
                  {moment(data.date * 1000)
                    .utc()
                    .format("DD.MM.YYYY, HH:mm")}
                </span>
              </div>
            </div>

            <div className="eventRightDetailItem">
              <div className="eventRightDetailItemHeader">
                <HiOutlineLocationMarker className="eventRightDetailItemIcon" />
                <span>Location</span>
              </div>
              <div className="eventRightDetailItemContent">
                <span>{data.venue}</span>
              </div>
            </div>

            <div className="eventRightDetailItem">
              <div className="eventRightDetailItemHeader">
                <BsTicketPerforated className="eventRightDetailItemIcon" />
                <span>Tickets</span>
              </div>
              <div className="eventRightDetailItemContentVenue">
                <span>
                  {data.venue == "The Avenue, Paris" ? "Diamond" : "0-30 Seat"}{" "}
                  - <b>{data.venuePrice1} ETH</b>
                </span>
                <span>
                  {data.venue == "The Avenue, Paris" ? "Gold" : "31-60 Seat"} -{" "}
                  <b>{data.venuePrice2} ETH</b>
                </span>
                <span>
                  {data.venue == "The Avenue, Paris" ? "General" : "61-90 Seat"}{" "}
                  - <b>{data.venuePrice3} ETH</b>
                </span>
              </div>
            </div>

            <div className="eventRightDetailItem">
              <div className="eventRightDetailItemHeader">
                <LiaSitemapSolid className="eventRightDetailItemIcon" />
                <span>Seating Plane</span>
              </div>

              <PreviewLocation venue={data.venue} minHeight={"150px"} />
            </div>

            <Link
              to={buyButtonDisabled() ? "#" : `/event/${id}/buy`}
              className="buyBtn"
              disabled={buyButtonDisabled()}
              style={{
                cursor: buyButtonDisabled() ? "not-allowed" : "pointer",
                opacity: buyButtonDisabled() && "0.5",
              }}
            >
              Buy Ticket
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Event;
