import React, { useEffect, useState } from "react";
import { BsChevronLeft } from "react-icons/bs";
import attendee from "../assets/attendee.png";
import groupImg from "../assets/group.svg";
import videoCall from "../assets/videoCall.svg";
import visitingCard from "../assets/visitingCard.svg";
import call from "../assets/call.svg";
import { RealTimeDb } from "../config/firebaseConfig";
import { subdomain } from "../constants/constants";

const TopNavBar = ({ setMessageScreen, userDetails }) => {

  const [status, setStatus] = useState(false);

  useEffect(() => {
    getUserStatus();
  }, [userDetails])

  const getDisplayPicSettings = (userDetails) => {
    if (userDetails?.type == "publicGroup") {
      return groupImg;
    }
    if (userDetails?.type == "auditoriumGroup") {
      return groupImg;
    }
    if (userDetails?.type == "helpDeskGroup") {
      return groupImg;
    }
    if (userDetails?.type == "exhibitionGroup") {
      return groupImg;
    }
    if (userDetails?.type == "customGroup") {
      return groupImg;
    }
    else {
      return userDetails?.photoURL ? userDetails.photoURL : attendee;
    }
  }

  const getStatusSettings = (userDetails) => {
    if (userDetails?.type == "publicGroup") {
      return false;
    }
    if (userDetails?.type == "auditoriumGroup") {
      return false;
    }
    if (userDetails?.type == "helpDeskGroup") {
      return false;
    }
    if (userDetails?.type == "exhibitionGroup") {
      return false;
    }
    if (userDetails?.type == "customGroup") {
      return false;
    }
    else {
      return true;
    }
  }

  const getContactSettings = (userDetails) => {
    if (userDetails?.type == "publicGroup") {
      return false;
    }
    if (userDetails?.type == "auditoriumGroup") {
      return false;
    }
    if (userDetails?.type == "helpDeskGroup") {
      return false;
    }
    if (userDetails?.type == "exhibitionGroup") {
      return false;
    }
    if (userDetails?.type == "customGroup") {
      return true;
    }
    else {
      return true;
    }
  }

  const getUserStatus = () => {
    if (userDetails) {
      RealTimeDb.ref(`users/${subdomain}/${userDetails.uid}`).on("value", (snapshot) => {
        if (snapshot?.val()?.status == 'online') {
          setStatus(true);
        } else {
          setStatus(false);
        }
      })
    }
  }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", padding: 5, backgroundColor: "white", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
          <div style={{ height: 40, width: 25, display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer" }}>
            <BsChevronLeft style={{ stroke: "#5B5B5B", strokeWidth: "2" }} onClick={() => setMessageScreen(false)} />
          </div>
          <img src={getDisplayPicSettings(userDetails)} style={userDetails?.type === "privateChat" ? { borderRadius: "50%", height: 40, width: 40, backgroundColor: 'rgb(91, 91, 91)' } : { borderRadius: "50%", height: 40, width: 40, backgroundColor: 'rgb(91, 91, 91)', padding: 7 }} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ marginLeft: 10, color: "#5B5B5B", fontWeight: 500 }}>{userDetails?.name}</span>
            {getStatusSettings(userDetails) &&
              <div style={{ display: "flex", flexDirection: "row" }}>
                <span style={{ marginLeft: 10, height: 12, width: 12, borderRadius: "50%", backgroundColor: status ? "green" : "red", border: "1px solid white" }}></span>
                <span style={{ marginLeft: 5, fontSize: 13, color: "#5B5B5B", marginTop: "-4px" }}>{status ? "Active Now" : "Away"}</span>
              </div>}
          </div>
        </div>
        {getContactSettings(userDetails) &&
          <div style={{ display: "flex", flexDirection: "row" }}>
            {userDetails?.type !== "customGroup" && <div style={{ height: 30, width: 30, marginRight: 5, display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer" }}>
              <img src={visitingCard} alt="visiting card" />
            </div>}
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