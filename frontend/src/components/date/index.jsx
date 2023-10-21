import React, { Component } from "react";
import Countdown from "react-countdown";
import "./index.css";

function Date({ date }) {
  const renderer = ({ minutes, seconds, completed }) => {
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;

    if (completed) {
      return (
        <div className="qrDate">
          <div className="qrDateItem">
            <span>00</span>
            <span>minutes</span>
          </div>
          <div className="qrDateItem">
            <span>00</span>
            <span>seconds</span>
          </div>
        </div>
      );
    } else {
      return (
       
          <div className="qrDate">
            <div className="qrDateItem">
              <span>{minutes}</span>
              <span>minutes</span>
            </div>
            <div className="qrDateItem">
              <span>{seconds}</span>
              <span>seconds</span>
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
