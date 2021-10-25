import React, { useState } from "react";
import groupImg from "../assets/group.svg";
import volume from "../assets/volume.svg";
import { subdomain } from "../constants/constants";
import { RealTimeDb } from "../config/firebaseConfig";
import { auth } from "../config/firebaseConfig";

const CustomGroupChats = ({ customGroup, handleTime, myUserObject, setMessageScreen, userDetails, setUserDetails }) => {

  const groupName = (group) => {
    const grpName = myUserObject?.customGroup[group]?.name?.slice(0, 25)
    return grpName || "Untitled Group";
  }

  const { uid } = auth.currentUser;

  const groupRecentMsg = (group) => {
    const grpLastMsg = myUserObject?.customGroup[group]?.lastMessage?.content.length > 20
      ? myUserObject?.customGroup[group]?.lastMessage?.content.slice(0, 25) + "..."
      : myUserObject?.customGroup[group]?.lastMessage?.content
    return grpLastMsg || "";
  }

  const handleCustomGroup = (group) => {
    setUserDetails({
      name: `${groupName(group)}`,
      roomId: `${group}`,
      type: "customGroup",
    })
    handleReadMsg(group);
    setMessageScreen(true);
  }

  const handleReadMsg = (groupId) => {
    // let lastMessage = {};
    // RealTimeDb.ref(`users/${subdomain}/${uid}/customGroup/${groupId}/lastMessage`).on("value", (snapshot) => {
    //   lastMessage = snapshot.val();
    //   lastMessage && lastMessage[userId] === "unread" &&
    //     RealTimeDb.ref(`users/${subdomain}/${uid}/customGroup/${groupId}/lastMessage`).update({
    //       [uid]: "read",
    //     });
    // });
  }

  return (
    <>
      {customGroup?.map((group, index) => (
        <>
          <div key={index} onClick={() => handleCustomGroup(group)} style={{ display: "flex", flexDirection: "row", alignItems: "center", margin: 10, padding: 8, borderRadius: 8, cursor: "pointer", backgroundColor: "white", boxShadow: " 0 .2rem 0.5rem rgba(0,0,0,.15)" }}>
            <img src={groupImg} style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'rgb(58, 58, 58)', padding: '7px', margin: 5 }} />
            <div style={{ display: "flex", flex: 1, flexDirection: "column", marginLeft: 30 }}>
              <span style={{ color: "#5B5B5B" }}>{groupName(group)}</span>
              <span style={{ color: "grey", fontSize: 14 }}>{groupRecentMsg(group)}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <img src={volume} />
              <span style={{ color: "#5B5B5B", fontSize: 12 }}>{groupRecentMsg(group) ? handleTime(group, true) : ""}</span>
            </div>
          </div>
        </>
      ))}
    </>
  );
}

export default CustomGroupChats;