import React, { useEffect, useState } from "react";
import groupImg from "../assets/group.svg";
import { RealTimeDb } from "../config/firebaseConfig";
import { subdomain } from "../constants/constants";
import { exhibition_id } from "../constants/constants";

const ExhibitorChat = ({ setMessageScreen, setUserDetails, userDetails }) => {

  const [exhibitorChatMsg, setExhibitorChatMsg] = useState([]);

  useEffect(() => {
    getExhibitorChatLastmsg();
  }, [])

  const getExhibitorChatLastmsg = () => {
    RealTimeDb.ref(
      `chats/${subdomain}/${exhibition_id}`
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

  const handleExhibitorChat = () => {
    setUserDetails({
      ...userDetails,
      name: "Exhibition Chat",
      roomId: `${exhibition_id}`,
      type: "exhibitionGroup",
    })
    setMessageScreen(true)
  }

  return (
    <>
      <div onClick={() => handleExhibitorChat()} style={{ display: "flex", flexDirection: "row", margin: 10, padding: 8, borderRadius: 8, cursor: "pointer", backgroundColor: "white", boxShadow: " 0 .2rem 0.5rem rgba(0,0,0,.15)" }}>
        <img src={groupImg} style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'rgb(58, 58, 58)', padding: '7px', margin: 5 }} />
        <div style={{ display: "flex", flexDirection: "column", flex: 1, marginLeft: 30 }}>
          <span style={{ color: "#5B5B5B" }}>Exhibition Chat</span>
          <span style={{ color: "grey", fontSize: 14 }}>{recentMsg()}</span>
        </div>
      </div>
    </>
  );
}

export default ExhibitorChat;