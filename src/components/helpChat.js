import React, { useEffect, useState } from "react";
import groupImg from "../assets/group.svg";
import { RealTimeDb } from "../config/firebaseConfig";
import { subdomain } from "../constants/constants";

const HelpChat = () => {

  const [helpChatMsg, sethelpChatMsg] = useState([]);

  useEffect(() => {
    getHelpChatLastmsg();
  }, [])

  const getHelpChatLastmsg = () => {
    RealTimeDb.ref(`chats/${subdomain}/helpDeskGroup`)
      .limitToLast(1)
      .on("value", (snapshot) => {
        let chat = [];
        snapshot.forEach((snap) => {
          let data = {
            ...snap.val(),
            key: snap.key,
          };
          chat.push(data);
        });
        sethelpChatMsg(chat);
      });
  }

  const recentMsg = () => {
    if (helpChatMsg && helpChatMsg.length) {
      const recentMsg = helpChatMsg[0]?.content.length > 20
        ? helpChatMsg[0]?.content?.slice(0, 20) + '...'
        : helpChatMsg[0]?.content;
      return recentMsg;
    }
  }

  return (
    <>
      <div style={{ display: "flex", flexDirection: "row", margin: 10, padding: 8, borderRadius: 8, cursor: "pointer", backgroundColor: "white" }}>
        <img src={groupImg} style={{ width: '40px', height: '40px', borderRadius: '5px', backgroundColor: 'rgb(58, 58, 58)', padding: '5px', margin: 5 }} />
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <span style={{ color: "#696969" }}>Help Chat</span>
          <span style={{ color: "grey", fontSize: 14 }}>{recentMsg()}</span>
        </div>
      </div>
    </>
  );
}

export default HelpChat;