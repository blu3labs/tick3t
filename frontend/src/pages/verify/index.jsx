
import React, { useEffect, useState } from "react"
import "./index.css"
import Card from "./components/card"
import axios from "axios"
import { BACKEND_API_URL } from "../../utils/apiUrls"
import { useLocation } from "react-router-dom"
import toast from "react-hot-toast"

function useQuery() {
    const { search } = useLocation();
  
    return React.useMemo(() => new URLSearchParams(search), [search]);
  }


function Verify() {


    const [event, setEvent] = useState(null)
    const [loading, setLoading] = useState(false)
    const query = useQuery()
    const dataQuery = {
        owner: query.get("owner"),
        ticketId: query.get("tokenId"),
        collection: query.get("collection"),
        deadline: query.get("deadline"),
        signature: query.get("signature"),
        salt: query.get("salt")
    }
 
    useEffect(() => {
        const fetch = async () => {
            try {
                const { data: res } = await axios.get(
                  `${BACKEND_API_URL}/event/${dataQuery.collection}`
                );
          
                console.log(res)
    
                setEvent(res?.data)
              } catch (error) {
                console.log(error);
            
                setEvent({})
              }
        }
        fetch()
    },[dataQuery.collection])
    const verifyTicket = async () => {
      setLoading(true)
        try {
          console.log(              `${BACKEND_API_URL}/check/qr?owner=${dataQuery.owner}&ticketId=${dataQuery.ticketId}&collection=${dataQuery.collection}&deadline=${dataQuery.deadline}&salt=${dataQuery.salt}&signature=${dataQuery.signature}`
          )
            const { data: res } = await axios.get(
              `${BACKEND_API_URL}/check/qr?owner=${dataQuery.owner}&collection=${dataQuery.collection}&tokenId=${dataQuery.ticketId}&salt=${dataQuery.salt}&deadline=${dataQuery.deadline}&signature=${dataQuery.signature}`
            );
          
            console.log(res)
            if ( res?.message && res?.message?.includes("Success")) {
            toast.success(res?.message)
            } else {
              toast.error(res?.message ?? res?.data)
            }
          } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message)
          }
          setLoading(false)
    }
    return (
        <div className="verifyWrapper">
            <Card  item={event ?? {}} dataQuery={dataQuery} onClick={verifyTicket}  loading={loading} setLoading={setLoading}/>
        </div>
    )
}


export default Verify