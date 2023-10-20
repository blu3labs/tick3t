import React, { useState, useEffect } from "react";
import { events } from "../../utils/events";
import Category from "./components/category";
import Card from "./components/card";
import "./index.css";
import axios from "axios";
import { BACKEND_API_URL } from "../../utils/apiUrls";
import { useSelector } from "react-redux";
function Home() {




  const [category, setCategory] = useState("All Events");



  const [events, setEvents] = useState(null)

  const fetchAllEvents = async () =>{
    try {
      const {data: res} = await axios.get(`${BACKEND_API_URL}/all/events/${category}`)
      setEvents(res?.data?.results)
    } catch (error) {
      console.log(error)
      setEvents(false)
    }
  }

  useEffect(()=>{
    fetchAllEvents()
  },[category])

  console.log(events,"events")


  let filteredEvents = []
  // events?.filter((item) => {
  //   if (category === "All Events") {
  //     return item;
  //   } else {
  //     return item.category === category;
  //   }
  // });

  return (
    <div className="homeWrapper">
      <Category category={category} setCategory={setCategory} />

      {events === null ? (
        <div className="homeNoEvents">
          <span>Events are loading...</span>
        </div>
      ) : events === false || events === undefined ? (
        <div className="homeNoEvents">
          <span>Someting went wrong. Please try again later.</span>
        </div>
      ) : events?.length == 0 ? (
        <div className="homeNoEvents">
          <span>There is no event in this category.</span>
        </div>
      ) : (
        <div className="homeEvents">
          {events?.map((item, index) => {
            return <Card key={index} index={index} item={item} />;
          })}
        </div>
      )}
    </div>
  );
}

export default Home;
