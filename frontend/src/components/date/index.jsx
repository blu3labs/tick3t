import React, { Component } from "react";
import Countdown from "react-countdown";
import "./index.css";

function Date({ date }) {
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (days < 10) days = "0" + days;
    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;

    if (completed) {
      return (
        <div className="qrDate">
          <div className="qrDateItem">
            <span>00</span>
          </div>
          <div className="qrDateItem">
            <span>00</span>
          </div>
          <div className="qrDateItem">
            <span>00</span>
          </div>
          <div className="qrDateItem">
            <span>00</span>
          </div>
        </div>
      );
    } else {
      return (
        <div className="qrDateWithText">
          <div className="qrDate">
            <div className="qrDateItem">
              <span>{days}</span>
            </div>
            <div className="qrDateItem">
              <span>{hours}</span>
            </div>
            <div className="qrDateItem">
              <span>{minutes}</span>
            </div>
            <div className="qrDateItem">
              <span>{seconds}</span>
            </div>
          </div>
        </div>
      );
    }
  };

  class CountDownComponent extends Component {
    render() {
      return <Countdown date={date} renderer={renderer} />;
    }
  }

  return <CountDownComponent />;
}

export default Date;
