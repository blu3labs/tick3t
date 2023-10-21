import React from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { MdOutlineEventNote } from "react-icons/md";
import { BsTicketPerforated } from "react-icons/bs";
import { FaRegEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import moment from "moment";
import "../index.css";

function Card({ index, item }) {
  let categoryId = {
    1: "Diamond",
    2: "Gold",
    3: "General",
  };

  let generateDisabled =
    item.status?.toLowerCase() == "past" || item.usedTicket == 1;

    const [loading, setLoading] = useState(false)
    const handleGenerateQr = async () => {
      setLoading(true)
      try{
        // code area

      }catch(err){
        console.log(err)
      }
      setLoading(false)
    }

  return (
    <div className="myTicketsCard" key={index}>
      <div class="myTicketsCardLeft">
        <img src={item.image} alt={item.title} draggable="false" />
        <button
          disabled={generateDisabled || loading}
          style={{
            cursor: generateDisabled || loading? "not-allowed" : "pointer",
            opacity: generateDisabled || loading ? "0.5" : "1",
          }}
          onClick={handleGenerateQr}
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
            {moment(item.date * 1000)
              .utc()
              .format("DD.MM.YYYY, HH:mm")}
          </span>
        </div>

        <div className="myTicketsCardItem">
          <HiOutlineLocationMarker className="myTicketsCardIcon" />
          <span>{item.venue}</span>
        </div>

        <div className="myTicketsCardItem">
          <BsTicketPerforated className="myTicketsCardIcon" />

          {item.venue == "Theatre Hall, Istanbul" ? (
            <span>Seat {item.tokenId}</span>
          ) : (
            <span>{categoryId[item.tokenId]}</span>
          )}
        </div>
            <Link to={`/event/${item.address}`} className="goEvent">
        <FaRegEye className="goEvenetIcon" />
      </Link>
    
      </div>
    </div>
  );
}

export default Card;
