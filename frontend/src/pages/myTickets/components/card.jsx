import React, { useState } from "react";
import Date from "../../../components/date";
import moment from "moment";
import { FaRegCalendarAlt } from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { MdOutlineEventNote } from "react-icons/md";
import { BsTicketPerforated } from "react-icons/bs";
import { FaRegEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import { QRCode, Modal } from "antd";
import { generateQRCode } from "../../../utils/generateQR";
import { useSelector } from "react-redux";
import { generateSalt } from "../../../utils/generateSalt";
import { BACKEND_API_URL } from "../../../utils/apiUrls";
import "../index.css";

function Card({ index, item, getCurrentTime }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrValue, setQrValue] = useState(null);
  const showModal = (value) => {
    setQrValue(value);
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setQrValue(null);
    setIsModalOpen(false);
  };

  let categoryId = {
    1: "Diamond",
    2: "Gold",
    3: "General",
  };

  let generateDisabled =
    item.status?.toLowerCase() == "past" || item.usedTicket == 1;

  const { activeAddress, isAbstract, signer } = useSelector(
    (state) => state.auth
  );
  const [loading, setLoading] = useState(false);

  const [timer, setTimer] = useState(0);

  const handleGenerateQr = async () => {
    setLoading(true);
    try {
      setTimer(0);

      let currentTime = getCurrentTime + 120; // 2 minutes

      setTimer(currentTime);

      let ticketInfo = {
        owner: activeAddress,
        collection: item.address,
        tokenId: item.tokenId,
        deadline: currentTime,
        salt: generateSalt(),
        title: item.title,
      };

      let res = await generateQRCode(
        ticketInfo,
        activeAddress,
        signer,
        isAbstract
      );

      console.log(res, "res");

      if (res !== "err") {
        let api = BACKEND_API_URL + "/check/qr" + "?owner=" + activeAddress +
        "&collection=" + item.address + "&tokenId=" + item.tokenId + "&salt=" + 
        ticketInfo.salt + "&deadline=" + currentTime 
        + "&signature=" + res;
        

        showModal(api);
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <div className="myTicketsCard" key={index}>
      <div class="myTicketsCardLeft">
        <img src={item.image} alt={item.title} draggable="false" />
        <button
          disabled={generateDisabled || loading}
          style={{
            cursor: generateDisabled || loading ? "not-allowed" : "pointer",
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

      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
        closeIcon={null}
      >
        <div className="qrModal">
          <QRCode value={qrValue} />

          <div className="qrModalTimer">
            <span>Ticket will be expired in </span>
            <Date date={timer * 1000} />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Card;
