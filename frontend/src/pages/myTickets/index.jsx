import React, { useState, useEffect } from "react";
import HeaderTab from "./components/headerTab";
import Card from "./components/card";
import { useSelector } from "react-redux";
import { factoryABI, factoryAddress } from "../../contract";
import { readContract } from "../../utils/readContract";
import moment from "moment";
import "./index.css";
import axios from "axios";

function MyTickets() {
  const [tab, setTab] = useState("All");

  const { activeAddress } = useSelector((state) => state.auth);

  const getCurrentTime = () => {
    const utcDate = moment.utc().format();
    let seconds = new Date(utcDate).getTime() / 1000;
    return seconds;
  };

  const [myTickets, setMyTickets] = useState(null);

  const getMyTickets = async () => {
    if (!activeAddress) {
      setMyTickets(false);
      return;
    }

    try {
      let context = {
        address: factoryAddress,
        abi: factoryABI,
        method: "getUserTicket",
        args: [activeAddress],
      };

      let res = await readContract(context);

      if (res?.length > 0) {
        let arr_ = [];

        for (let i = 0; i < res?.length; i++) {
     
          let backRes = await axios.get(res?.[i]?.tokenUri);

      

          if (backRes?.status == 200) {
            let backdata = backRes?.data?.data;

            let status =
              parseFloat(backdata?.date) > getCurrentTime() ? "Active" : "Past";

            let obj = {
              address: backdata?.address,
              category: backdata?.category,
              date: backdata?.date,
              id: backdata?.id,
              image: backdata?.image,
              title: backdata?.title,
              venue: backdata?.venue,
              totalTicket: parseFloat(res?.[i]?.amount?.toString(10)),
              usedTicket: parseFloat(res?.[i]?.usedAmount?.toString(10)),
              tokenId: parseFloat(res?.[i]?.tokenId?.toString(10)),
              status: status,
            };

            arr_.push(obj);
          }
        }

        let arr2 = [];

        if (arr_?.length > 0) {
          for (let i = 0; i < arr_?.length; i++) {
        

            if (arr_?.[i]?.totalTicket > 1) {
              let usedTicket_ = 0;

              for (let j = 0; j < arr_?.[i]?.totalTicket; j++) {
                let obj = {};
                if (arr_?.[i]?.usedTicket > usedTicket_) {
                  usedTicket_++;
                  obj = {
                    address: arr_?.[i]?.address,
                    category: arr_?.[i]?.category,
                    date: arr_?.[i]?.date,
                    id: arr_?.[i]?.id,
                    image: arr_?.[i]?.image,
                    title: arr_?.[i]?.title,
                    venue: arr_?.[i]?.venue,
                    tokenId: arr_?.[i]?.tokenId,
                    status: arr_?.[i]?.status,
                    totalTicket: 1,
                    usedTicket: 1,
                  };
                } else {
                  obj = {
                    address: arr_?.[i]?.address,
                    category: arr_?.[i]?.category,
                    date: arr_?.[i]?.date,
                    id: arr_?.[i]?.id,
                    image: arr_?.[i]?.image,
                    title: arr_?.[i]?.title,
                    venue: arr_?.[i]?.venue,
                    tokenId: arr_?.[i]?.tokenId,
                    status: arr_?.[i]?.status,
                    totalTicket: 1,
                    usedTicket: 0,
                  };
                }
                arr2.push(obj);
              }
            } else {
              arr2.push(arr_?.[i]);
            }
          }
        }


        arr2 = arr2?.reverse()
        setMyTickets(arr2);
      } else {
        setMyTickets([]);
      }
    } catch (err) {
      console.log(err);
      setMyTickets(false);
    }
  };

  useEffect(() => {
    getMyTickets();
  }, [activeAddress]);



  let filteredTickets = myTickets
    ? myTickets?.filter((item) => {
        if (tab === "All") {
          return item;
        } else {
          return item?.status?.toLowerCase() === tab?.toLowerCase();
        }
      })
    : [];

  return (
    <div className="myTicketsWrapper">
      <HeaderTab tab={tab} setTab={setTab} />

      {myTickets === null ? (
        <div className="noMyTickets">
          <span>Tickets are loading...</span>
        </div>
      ) : myTickets === false || myTickets === undefined ? (
        <div className="noMyTickets">
          <span>Someting went wrong. Please try again later.</span>
        </div>
      ) : filteredTickets?.length == 0 ? (
        <div className="noMyTickets">
          <span>There are no tickets.</span>
        </div>
      ) : (
        <div className="myTickets">
          {filteredTickets?.map((item, index) => {
            return <Card key={index} index={index} item={item} 
            
            getCurrentTime={getCurrentTime()}/>;
          })}
        </div>
      )}
    </div>
  );
}

export default MyTickets;
