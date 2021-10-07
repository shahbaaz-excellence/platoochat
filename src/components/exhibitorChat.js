import React, { useEffect, useState } from "react";
import groupImg from "../assets/group.svg";
import { RealTimeDb } from "../config/firebaseConfig";
import { subdomain } from "../constants/constants";

const ExhibitorChat = () => {

  const [exhibitorChatMsg, setExhibitorChatMsg] = useState([]);

  useEffect(() => {
    getExhibitorChatLastmsg();
  }, [])

  const getExhibitorChatLastmsg = () => {
    RealTimeDb.ref(
      `chats/${subdomain}/${JSON.parse(
        localStorage.getItem("exhibition_id")
      )}`
    ).limitToLast(1).on("value", (snapshot) => {
      let chat = [];
      snapshot.forEach((snap) => {
        let data = {
          ...snap.val(),
          key: snap.key,
        };
        chat.push(data);
      });
      setExhibitorChatMsg(chat);
    });
  }

  const recentMsg = () => {
    if (exhibitorChatMsg && exhibitorChatMsg.length) {
      const recentMsg = exhibitorChatMsg[0]?.content.length > 20
        ? exhibitorChatMsg[0]?.content?.slice(0, 20) + '...'
        : exhibitorChatMsg[0]?.content;
      return recentMsg;
    }
  }

  return (
    <>
      <div style={{ display: "flex", flexDirection: "row", margin: 10, padding: 8, borderRadius: 8, cursor: "pointer", backgroundColor: "white" }}>
        <img src={groupImg} style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'rgb(58, 58, 58)', padding: '7px', margin: 5 }} />
        <div style={{ display: "flex", flexDirection: "column", flex: 1, marginLeft: 30 }}>
          <span style={{ color: "#5B5B5B" }}>Exhibitor Chat</span>
          <span style={{ color: "grey", fontSize: 14 }}>{recentMsg()}</span>
        </div>
      </div>
    </>
  );
}

export default ExhibitorChat;