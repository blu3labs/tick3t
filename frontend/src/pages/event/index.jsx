import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { events } from "../../utils/events";
import { FaRegCalendarAlt } from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { BsTicketPerforated } from "react-icons/bs";
import { LiaSitemapSolid } from "react-icons/lia";
import PreviewLocation from "../createEvent/components/previewLocation";
import "./index.css";

function Event() {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const getEvent = async () => {
    try {
      //* Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1_000));
      const response = await events.find((event) => event.id == id);

      if (response) {
        setData(response);
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
  }, []);

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
              <span>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eum
                accusamus quidem eius nemo aspernatur, vel sequi! Porro enim
                ratione tempore officiis velit? Non animi quaerat unde sit illum
                ratione consequuntur minima quam, ipsam porro. Provident quasi
                nulla iste enim cumque optio adipisci quidem expedita
                consequuntur?
              </span>
            </div>

            <div className="eventDetailChatArea">
              <span>CHAT AREA</span>
            </div>
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
                  {data.date}, {data.clock}
                </span>
              </div>
            </div>

            <div className="eventRightDetailItem">
              <div className="eventRightDetailItemHeader">
                <HiOutlineLocationMarker className="eventRightDetailItemIcon" />
                <span>Location</span>
              </div>
              <div className="eventRightDetailItemContent">
                <span>{data.location}</span>
              </div>
            </div>

            <div className="eventRightDetailItem">
              <div className="eventRightDetailItemHeader">
                <BsTicketPerforated className="eventRightDetailItemIcon" />
                <span>Tickets</span>
              </div>
              <div className="eventRightDetailItemContentVenue">
                <span>
                  Diamond - <b>1 ETH</b>
                </span>
                <span>
                  Gold - <b>0.5 ETH</b>
                </span>
                <span>
                  General - <b>0.1 ETH</b>
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
              to={`/event/${id}/buy`}
             

            className="buyBtn">Buy Ticket</Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Event;
