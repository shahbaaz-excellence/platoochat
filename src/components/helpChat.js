import React, { useEffect, useState } from "react";
import groupImg from "../assets/group.svg";
import { RealTimeDb } from "../config/firebaseConfig";
import { subdomain } from "../constants/constants";

const HelpChat = ({ setMessageScreen, setUserDetails, userDetails }) => {

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

  const handleHelpChat = () => {
    setUserDetails({
      ...userDetails,
      name: "Help Chat",
      roomId: `helpDeskGroup`,
      type: "helpDeskGroup",
    })
    setMessageScreen(true)
  }

  return (
    <>
      <div onClick={() => handleHelpChat()} style={{ display: "flex", flexDirection: "row", margin: 10, padding: 8, borderRadius: 8, cursor: "pointer", backgroundColor: "white", boxShadow: " 0 .2rem 0.5rem rgba(0,0,0,.15)" }}>
        <img src={groupImg} style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'rgb(58, 58, 58)', padding: '7px', margin: 5 }} />
        <div style={{ display: "flex", flexDirection: "column", flex: 1, marginLeft: 30 }}>
          <span style={{ color: "#5B5B5B" }}>Help Chat</span>
          <span style={{ color: "grey", fontSize: 14 }}>{recentMsg()}</span>
        </div>
      </div>
    </>
  );
}

export default HelpChat;