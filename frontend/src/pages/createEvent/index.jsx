import React, { useEffect, useState } from "react";
import { Select, DatePicker } from "antd";
import PreviewCard from "./components/previewCard";
import Input from "../../ui/input";
import Textarea from "../../ui/textarea";
import "./index.css";
import SelectBox from "../../ui/selectBox";
import { categoryList } from "../../utils/categoryDetail";
import Datepicker from "../../ui/Datepicker";
import moment from "moment";
import PreviewLocation from "./components/previewLocation";

function CreateEvent() {
  const [title, setTitle] = useState(null);
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState(null);
  const [date, setDate] = useState(null);
  const [description, setDescription] = useState(null);
  const [venue, setVenue] = useState(null);
  const [venuePrice1, setVenuePrice1] = useState(null);
  const [venuePrice2, setVenuePrice2] = useState(null);
  const [venuePrice3, setVenuePrice3] = useState(null);

  const onChangeDate = (value, dateString) => {
    const utcDate = moment.utc(dateString).format();
    let seconds = new Date(utcDate).getTime() / 1000;
    setDate(seconds);
  };

  const getCurrentTime = () => {
    const utcDate = moment.utc().format();
    let seconds = new Date(utcDate).getTime() / 1000;
    return seconds;
  };

  const dateError = () => {
    if (date === null) {
      return null;
    }

    if (date === "" || date === undefined || isNaN(date)) {
      return "Date is a required.";
    }

    if (Number(date) < getCurrentTime()) {
      return "Date must be greater than current time.";
    }

    return null;
  };

  const [categoryOptions, setCategoryOptions] = useState([]);
  const generateCategoryOptions = () => {
    let arr_ = [];

    categoryList.map((item, index) => {
      if (index == 0) {
        return;
      } else {
        arr_.push({ label: item, value: item });
      }
    });

    setCategoryOptions(arr_);
  };
  useEffect(() => {
    generateCategoryOptions();
  }, []);

  let venueOptions = [
    { label: "The Avenue, Paris", value: "The Avenue, Paris" },
    { label: "Theatre Hall, Istanbul", value: "Theatre Hall, Istanbul" },
  ];

  return (
    <div className="createWrapper">
      <div className="createHeader">
        <div className="createTitle">Create Event</div>
        <div className="createDesc">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </div>
      </div>

      <div className="createBody">
        <div className="createInputWrapper">
          <Input
            title={"Title"}
            placeholder="Please enter event title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={title === "" ? "Title is a required." : null}
          />

          <div className="createInputSelectBoxs">
            <SelectBox
              title="Category"
              placeholder="Select Category"
              onChange={(e) => setCategory(e)}
              options={categoryOptions}
            />

            <Datepicker
              title="Date (UTC)"
              onChange={onChangeDate}
              format="YYYY-MM-DD HH:mm"
              placeholder="Select Date"
              showSecond={false}
              showTime
              error={dateError()}
            />
          </div>

          <Textarea
            title={"Description"}
            placeholder="Please enter event description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={description === "" ? "Description is a required." : null}
            rows={4}
          />

          <div className="createLocationArea">
            <SelectBox
              title="Location"
              placeholder="Select Location"
              onChange={(e) => setVenue(e)}
              options={venueOptions}
            />
            {venue && (
              <div className="createLocationPricesAndPreview">
                <div className="createLocationPrices">
                  <Input
                    title={"Diamond Price"}
                    placeholder="Please enter Diamond"
                    value={venuePrice1}
                    onChange={(e) => setVenuePrice1(e.target.value)}
                    error={
                      venuePrice1 === "" ? "Diamond price is a required." : null
                    }
                  />

                  <Input
                    title={"Gold Price"}
                    placeholder="Please enter Gold"
                    value={venuePrice2}
                    onChange={(e) => setVenuePrice2(e.target.value)}
                    error={
                      venuePrice2 === "" ? "Gold price is a required." : null
                    }
                  />

                  <Input
                    title={"General Price"}
                    placeholder="Please enter General"
                    value={venuePrice3}
                    onChange={(e) => setVenuePrice3(e.target.value)}
                    error={
                      venuePrice3 === "" ? "General price is a required." : null
                    }
                  />
                </div>
                <PreviewLocation venue={venue} />
              </div>
            )}
          </div>
        </div>
        <div className="createPreviewArea">
          <PreviewCard
            title={title}
            category={category}
            date={date}
            image={image}
            venue={venue}
            setImage={setImage}
          />
          <button className="createBtn">Create</button>
        </div>
      </div>
    </div>
  );
}

export default CreateEvent;
