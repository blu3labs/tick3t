import React from "react";

function PreviewLocation({ venue }) {
 

  const Avenue = () => {
    return (
      <div className="createLocationPreviewContent">
        <div
          className="createLocationPreviewContentItem"
          style={{
            background:
              "linear-gradient(-72deg,#dedeff,#fff 16%,#dedeff 27%,#dedeff 36%,#fff 45%,#fff 60%,#dedeff 72%,#fff 80%,#dedeff 84%)",
          }}
        >
          <span>Diamond</span>
        </div>
        <div
          className="createLocationPreviewContentItem"
          style={{
            background:
              "linear-gradient(to right, rgb(191, 149, 63), rgb(252, 246, 186), #e3a214, rgb(251, 245, 183), rgb(170, 119, 28))",
          }}
        >
          <span>Gold</span>
        </div>
        <div
          className="createLocationPreviewContentItem"
          style={{
            background:
              "linear-gradient(to right, rgb(222, 222, 222), rgb(255, 255, 255), rgb(222, 222, 222), rgb(255, 255, 255)",
          }}
        >
          <span>General</span>
        </div>
      </div>
    );
  };

  const Theatre = () => {
    return (
      <div className="createLocationPreviewContent">
        <div className="createLocationPreviewTheatreItem">
          {Array(30)
            .fill(0)
            .map((item, index) => {
              return (
                <span
                  style={{
                    background:
                      "linear-gradient(-72deg,#dedeff,#fff 16%,#dedeff 27%,#dedeff 36%,#fff 45%,#fff 60%,#dedeff 72%,#fff 80%,#dedeff 84%)",
                  }}
                >
                  {index + 1}
                </span>
              );
            })}
        </div>
        <div className="createLocationPreviewTheatreItem">
          {Array(30)
            .fill(0)
            .map((item, index) => {
              return (
                <span
                  style={{
                    
                    background:
                      "linear-gradient(to right, rgb(191, 149, 63), rgb(252, 246, 186), #e3a214, rgb(251, 245, 183), rgb(170, 119, 28))",
                  }}
                >
                  {index + 31}
                </span>
              );
            })}
        </div>
        <div className="createLocationPreviewTheatreItem">
          {Array(30)
            .fill(0)
            .map((item, index) => {
              return (
                <span
                  style={{
                    background:
                      "linear-gradient(to right, rgb(222, 222, 222), rgb(255, 255, 255), rgb(222, 222, 222), rgb(255, 255, 255)",
                  }}
                >
                  {index + 61}
                </span>
              );
            })}
        </div>
      </div>
    );
  };

  return (
    <div className="createLocationPreview">
      <div className="createLocationPreviewTitle">
        <span>{venue == "The Avenue, Paris" ? "Stage" : "Screen"}</span>
      </div>

      {venue == "The Avenue, Paris" ? <Avenue /> : <Theatre />}
    </div>
  );
}

export default PreviewLocation;
