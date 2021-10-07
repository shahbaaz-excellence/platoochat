import React, { useState } from "react";
import attendee from "../assets/attendee.svg";
import volume from "../assets/volume.svg";

const PrivateChats = ({ myChats, myUserObject, handleTime, setMessageScreen, setUserDetails }) => {

  const userRecentMsg = (user) => {
    const recentMsg = myUserObject?.recentMessage[user?.uid]?.content.length > 20
      ? myUserObject?.recentMessage[user?.uid]?.content?.slice(0, 20) + '...'
      : myUserObject?.recentMessage[user?.uid]?.content;
    return recentMsg;
  }

  const getUserDetails = (name, status) => {
    setUserDetails({
      name: name,
      status: status,
    })
    setMessageScreen(true)
  }


  return (
    <>
      {myChats?.map((user, index) => (
        <>
          <div key={index} onClick={() => getUserDetails(user.name, user.status)} style={{ display: "flex", flexDirection: "row", alignItems: "center", margin: 10, padding: 8, borderRadius: 8, cursor: "pointer", backgroundColor: "white" }}>
            <img src={attendee} style={{ borderRadius: "50%", height: 42, width: 42, objectFit: "none" }} />
            <div style={{ display: "flex", flex: 1, flexDirection: "column", marginLeft: 30 }}>
              <span style={{ color: "#696969" }}>{user?.name}</span>
              <span style={{ color: "grey", fontSize: 14 }}>{userRecentMsg(user)}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <img src={volume} />
              <span style={{ color: "darkgrey", fontSize: 13 }}>{handleTime(user, false)}</span>
            </div>
          </div>
        </>
      ))}
    </>
  );
}

export default PrivateChats;