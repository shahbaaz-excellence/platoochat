import React, { useState } from "react";
import attendee from "../assets/attendee.png";
import volume from "../assets/volume.svg";
import { auth } from "../config/firebaseConfig";

const PrivateChats = ({ myChats, myUserObject, handleTime, setMessageScreen, setUserDetails }) => {

  const { uid } = auth.currentUser;

  const userRecentMsg = (user) => {
    const recentMsg = myUserObject?.recentMessage[user?.uid]?.content.length > 20
      ? myUserObject?.recentMessage[user?.uid]?.content?.slice(0, 20) + '...'
      : myUserObject?.recentMessage[user?.uid]?.content;
    return recentMsg;
  }

  const getUserDetails = (user) => {
    if (user && uid) {
      setUserDetails({
        name: user.recipient === uid ? user.senderName : user.recipientName,
        roomId: user.roomid,
        uid: user.recipient === uid ? user.sender : user.recipient,
        photoURL: user.recipient === uid ? user.senderPhotoURL : user.recipientPhotoURL,
        type: "privateChat",
      })
      setMessageScreen(true)
    }
  }

  const getUserName = (user) => {
    if (user) {
      if (user.recipient === uid) {
        return user.senderName;
      }
      else {
        return user.recipientName;
      }
    }
  }


  return (
    <>
      {myChats?.map((user, index) => (
        <>
          <div key={index} onClick={() => getUserDetails(user)} style={{ display: "flex", flexDirection: "row", alignItems: "center", margin: 10, padding: 8, borderRadius: 8, cursor: "pointer", backgroundColor: "white", boxShadow: " 0 .2rem 0.5rem rgba(0,0,0,.15)" }}>
            <img src={attendee} style={{ borderRadius: "50%", height: 42, width: 42, objectFit: "none", margin: "5px" }} />
            <div style={{ display: "flex", flex: 1, flexDirection: "column", marginLeft: 30 }}>
              <span style={{ color: "#696969" }}>{getUserName(user)}</span>
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