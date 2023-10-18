import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { events } from "../../utils/events";
import { FaRegCalendarAlt } from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { categoryColor } from "../../utils/categoryDetail";
import "./index.css";
import StageContent from "./components/stageContent";
import ScreenContent from "./components/screenContent";

function BuyEvent() {
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
        <div className="eventBuyTopSection">
          <img src={data.image} alt={data.title} draggable="false" />

          <div className="eventBuyTopSectionCard">
            <div
              className="eventBuyTopSectionCardCategory"
              style={{
                background: categoryColor[data.category],
              }}
            ></div>
            <div className="eventBuyTopSectionCardDetail">
              <div className="eventBuyTopSectionCardTop">
                <div className="eventBuyTopSectionCardTopTitle">
                  {data.title}
                </div>
                <div className="eventBuyTopSectionCardTopDateWrapper">
                  <div className="eventBuyTopSectionCardTopDate">
                    <FaRegCalendarAlt className="eventBuyTopSectionCardTopDateIcon" />
                    <span>{data.date}</span>
                  </div>
                  <span>{data.clock}</span>
                </div>
              </div>
              <div className="eventBuyTopSectionCardBottom">
                <HiOutlineLocationMarker className="eventBuyTopSectionCardBottomIcon" />
                <span>{data.location}</span>
              </div>
            </div>
          </div>
        </div>

          {
            data.venue == "The Avenue, Paris"
            ?
            <StageContent 
            data={data}
            />
            : <ScreenContent data={data} />
          }

      



      </div>
    );
  }
}

export default BuyEvent;
