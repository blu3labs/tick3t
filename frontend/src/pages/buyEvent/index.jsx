import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { events } from "../../utils/events";
import { FaRegCalendarAlt } from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { categoryColor } from "../../utils/categoryDetail";
import "./index.css";
import StageContent from "./components/stageContent";
import ScreenContent from "./components/screenContent";
import { BACKEND_API_URL } from "@/utils/apiUrls";
import axios from "axios";
import moment from "moment";

function BuyEvent() {
  const { id } = useParams();

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
                    <span>
                      {moment(data.date * 1000)
                        .utc()
                        .format("DD.MM.YYYY")}
                    </span>
                  </div>
                  <span>
                    {moment(data.date * 1000)
                      .utc()
                      .format("HH:mm")}
                  </span>
                </div>
              </div>
              <div className="eventBuyTopSectionCardBottom">
                <HiOutlineLocationMarker className="eventBuyTopSectionCardBottomIcon" />
                <span>{data.venue}</span>
              </div>
            </div>
          </div>
        </div>

        {data.venue == "The Avenue, Paris" ? (
          <StageContent data={data} id={id}/>
        ) : (
          <ScreenContent data={data} id={id}/>
        )}
      </div>
    );
  }
}

export default BuyEvent;
