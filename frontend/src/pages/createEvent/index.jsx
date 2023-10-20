import React, { useEffect, useState } from "react";
import { Web3Storage } from "web3.storage";
import PreviewCard from "./components/previewCard";
import Input from "@/ui/input";
import Textarea from "@/ui/textarea";
import SelectBox from "@/ui/selectBox";
import { categoryList } from "@/utils/categoryDetail";
import Datepicker from "@/ui/Datepicker";
import moment from "moment";
import PreviewLocation from "./components/previewLocation";
import "./index.css";
import toast from "react-hot-toast";
import Spin from "../../ui/spin";
import { BACKEND_API_URL } from "../../utils/apiUrls";
import axios from "axios";
import { factoryABI, factoryAddress } from "../../contract";
import { useDispatch, useSelector } from "react-redux";
import { writeContract } from "../../utils/writeContract";
import { ethers } from "ethers";
import { setChainId } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { writeContractAbstract } from "../../utils/writeContractAbstract";
function CreateEvent() {
  const navigate = useNavigate();
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

  const validation = () => {
    if (
      title === null ||
      image === null ||
      category === null ||
      date === null ||
      description === null ||
      venue === null ||
      venuePrice1 === null ||
      venuePrice2 === null ||
      venuePrice3 === null ||
      title === "" ||
      description === "" ||
      venuePrice1 === "" ||
      venuePrice2 === "" ||
      venuePrice3 === ""
    ) {
      return false;
    }

    return true;
  };

  const dispatch = useDispatch();
  const { activeAddress,isAbstract, signer, chainId, safeAuthSignInResponse,web3AuthModalPack } = useSelector(
    (state) => state.auth
  );

  const [loading, setLoading] = useState(false);
  const handleCreate = async () => {
    if (image === null) {
      toast.error("Please upload a image.");
      return;
    }

    if (!validation()) {
      toast.error("Please fill all fields.");
      return;
    }

    if (dateError() !== null) {
      toast.error(dateError());
      return;
    }

    setLoading(true);
    try {
      let methodName = {
        "The Avenue, Paris": "createERC1155Event",
        "Theatre Hall, Istanbul": "createERC721Event",
      };

      let context = {
        address: factoryAddress,
        abi: factoryABI,
        method: methodName[venue],
        args: [
          title,
          BACKEND_API_URL + "/event/",
          date,
          [
            ethers.utils.parseEther(venuePrice1?.toString()),
            ethers.utils.parseEther(venuePrice2?.toString()),
            ethers.utils.parseEther(venuePrice3?.toString()),
          ],
          ethers.utils.randomBytes(32),
        ],
        web3AuthModalPack,
        abstractAccountAddress: activeAddress,
        signer: signer,
        chainId: chainId,
        safeAuthSignInResponse: safeAuthSignInResponse,
        dispatch: dispatch,
        setChainId: setChainId,
      };

      let address_ = "";

      if (isAbstract) {
        //* create event on abstract
        console.log("abstract account...");
        try {
          let res = await writeContractAbstract(context);

          console.log(res, "res"); //todo

          if (res === "err") {
            setLoading(false);
            return;
          } else {

            console.log(res ,"hello");
            setLoading(false)
          
            for (let i = 0; i < res?.logs?.length; i++) {
              if (
                res?.logs[i]?.topics[0] ==
                "0x4260f8c98a0b70328f2767f65cae27a2f61dcb6c94b0975f77af1c1440ece982"
              ) {
                let decoded = ethers.utils.defaultAbiCoder.decode(
                  ["address"],
                  res?.logs[i]?.topics[1]
                );
                address_ = decoded?.[0];
                break;
              }
            }
          }
        } catch (e) {
          console.log(e);
          setLoading(false);
          return;
        }


      } else {
        try {
          let res = await writeContract(context);

          if (res === "err") {
            setLoading(false);
            return;
          } else {
            for (let i = 0; i < res?.logs?.length; i++) {
              if (
                res?.logs[i]?.topics[0] ==
                "0x4260f8c98a0b70328f2767f65cae27a2f61dcb6c94b0975f77af1c1440ece982" || 
                res?.logs[i]?.topics[0] == 
                "0xd19c82cdcad5bee22fef91dc8eedbc9bdf6c70752b0acc18670e5e0b64eb9b59"
              ) {
                let decoded = ethers.utils.defaultAbiCoder.decode(
                  ["address"],
                  res?.logs[i]?.topics[1]
                );
                address_ = decoded?.[0];
                break;
              }
            }
          }
        } catch (e) {
          console.log(e);
          setLoading(false);
          return;
        }
      }

      //* create event on api

      //* upload image on web3 storage
      const client = new Web3Storage({
        token: import.meta.env.VITE_WEB3STORAGE_KEY,
      });

      const imageCid = await client.put([image], { wrapWithDirectory: false });

      let data = {
        address: address_,
        title: title,
        image: "https://w3s.link/ipfs/" + imageCid,
        category: category,
        date: date,
        description: description,
        venue: venue,
        venuePrice1: venuePrice1,
        venuePrice2: venuePrice2,
        venuePrice3: venuePrice3,
        chain: "5",
      };

      await axios.post(`${BACKEND_API_URL}/event`, data);

      navigate("/event/" + address_);
      toast.success("Event created successfully.");
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  return (
    <div className="createWrapper">
      <div className="createHeader">
        <div className="createTitle">Create Event</div>
        <div className="createDesc">
          Enter the details of the event you want to create.
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
                  <div
                    className="createLocationPreviewTitle"
                    style={{
                      marginBottom: "8px",
                    }}
                  >
                    <span>{venue}</span>
                  </div>

                  <Input
                    title={
                      venue == "The Avenue, Paris"
                        ? "Diamond Price"
                        : "0-30 Seat Price"
                    }
                    onKeyPress={(event) => {
                      if (!/[0-9+.]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    placeholder="Please enter price"
                    value={venuePrice1}
                    onChange={(e) => setVenuePrice1(e.target.value)}
                    error={venuePrice1 === "" ? "Price is a required." : null}
                  />

                  <Input
                    title={
                      venue == "The Avenue, Paris"
                        ? "Gold Price"
                        : "31-60 Seat Price"
                    }
                    onKeyPress={(event) => {
                      if (!/[0-9+.]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    placeholder="Please enter price"
                    value={venuePrice2}
                    onChange={(e) => setVenuePrice2(e.target.value)}
                    error={venuePrice2 === "" ? "Price is a required." : null}
                  />

                  <Input
                    title={
                      venue == "The Avenue, Paris"
                        ? "General Price"
                        : "61-90 Seat Price"
                    }
                    onKeyPress={(event) => {
                      if (!/[0-9+.]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    placeholder="Please enter price"
                    value={venuePrice3}
                    onChange={(e) => setVenuePrice3(e.target.value)}
                    error={venuePrice3 === "" ? "Price is a required." : null}
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
          <button
            className="createBtn"
            onClick={handleCreate}
            disabled={loading}
            style={{
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading && 0.5,
            }}
          >
            Create {loading && <Spin />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateEvent;
