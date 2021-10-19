import React, { useState, useEffect } from "react";
import attendee from "../assets/attendee.png";
import volume from "../assets/volume.svg";
import { RealTimeDb } from "../config/firebaseConfig";
import { subdomain } from "../constants/constants";

const ChatUser = ({ user, getUserName, userRecentMsg, handleTime, uid }) => {

  const [status, setStatus] = useState(false);

  useEffect(() => {
    if (user && uid) {
      const attendeeId = user.recipient === uid ? user.sender : user.recipient
      getUserStatus(attendeeId);
    }
  }, [])

  const getUserStatus = (userid) => {
    RealTimeDb.ref(`users/${subdomain}/${userid}`).on("value", (snapshot) => {
      if (snapshot?.val()?.status == 'online') {
        setStatus(true)
      } else {
        setStatus(false)
      }
    })
  }

  return (
    <>
      <div style={{ position: "relative" }}>
        <img src={attendee} style={{ borderRadius: "50%", height: 42, width: 42, objectFit: "none", margin: "5px" }} />
        <span style={{ height: 10, width: 10, borderRadius: "50%", background: status ? "green " : "red", position: "absolute", bottom: 8, right: 5 }}></span>
      </div>
      <div style={{ display: "flex", flex: 1, flexDirection: "column", marginLeft: 30 }}>
        <span style={{ color: "#696969" }}>{getUserName(user)}</span>
        <span style={{ color: "grey", fontSize: 14 }}>{userRecentMsg(user)}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
        <img src={volume} />
        <span style={{ color: "darkgrey", fontSize: 13 }}>{handleTime(user, false)}</span>
      </div>
    </>
  );
}

export default ChatUser;