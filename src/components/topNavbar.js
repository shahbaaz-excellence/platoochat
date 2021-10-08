import React from "react";
import { BsChevronLeft } from "react-icons/bs";
import { FiVideo } from "react-icons/fi";
import { MdCall } from "react-icons/md";
import { MdInfo } from "react-icons/md";
import { ImPhoneHangUp } from 'react-icons/im';
import { FaWhatsapp } from 'react-icons/fa';
import { AiOutlineIdcard } from 'react-icons/ai';
import attendee from "../assets/attendee.png";
import videoCall from "../assets/videoCall.svg";
import visitingCard from "../assets/visitingCard.svg";
import call from "../assets/call.svg";

const TopNavBar = ({ setMessageScreen, userDetails }) => {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", padding: 5, backgroundColor: "white", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
          <div style={{ height: 40, width: 25, display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer" }}>
            <BsChevronLeft style={{ stroke: "#5B5B5B", strokeWidth: "2" }} onClick={() => setMessageScreen(false)} />
          </div>
          <img src={attendee} style={{ borderRadius: "50%", height: 40, width: 40, objectFit: "none" }} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ marginLeft: 10, color: "#5B5B5B", fontWeight: 500 }}>{userDetails?.name}</span>
            {userDetails?.type != "publicGroup" &&
              <div style={{ display: "flex", flexDirection: "row" }}>
                <span style={{ marginLeft: 10, height: 12, width: 12, borderRadius: "50%", backgroundColor: userDetails?.status == "online" ? "green" : "red", border: "1px solid white" }}></span>
                <span style={{ marginLeft: 5, fontSize: 13, color: "#5B5B5B", marginTop: "-4px" }}>{userDetails?.status === "online" ? "Active Now" : "Away"}</span>
              </div>}
          </div>
        </div>
        {userDetails?.type != "publicGroup" &&
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ height: 30, width: 30, marginRight: 5, display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer" }}>
              <img src={visitingCard} alt="visiting card" />
            </div>
            {/* <div style={{ height: 30, width: 30, marginRight: 5, display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer" }}>
            <FaWhatsapp style={{ stroke: "black", strokeWidth: "2" }} />
          </div> */}
            <div style={{ height: 30, width: 30, marginRight: 5, display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer" }}>
              <img src={call} alt="audio call" />
            </div>
            <div style={{ height: 30, width: 30, marginRight: 5, display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer" }}>
              <img src={videoCall} alt="video call" />
            </div>
          </div>}
      </div>
    </>
  );
}

export default TopNavBar;