import React, { useEffect, useState } from "react";
import groupImg from "../assets/group.svg";
import { RealTimeDb } from "../config/firebaseConfig";
import { subdomain } from "../constants/constants";

const AuditoriumChat = () => {

  const [lastAudGroupMsg, setLastAudGroupMsg] = useState([]);

  useEffect(() => {
    getAuditoriumLastmsg();
  }, [])

  const getAuditoriumLastmsg = () => {
    RealTimeDb.ref(
      `chats/${subdomain}/AUDI_${JSON.parse(localStorage.getItem("auditorium_id"))}`)
      .limitToLast(1).on("value", (snapshot) => {
        let chat = [];
        snapshot.forEach((snap) => {
          let data = {
            ...snap.val(),
            key: snap.key,
          };
          chat.push(data);
        });
        setLastAudGroupMsg(chat);
      });
  }

  const recentMsg = () => {
    if (lastAudGroupMsg && lastAudGroupMsg.length) {
      const recentMsg = lastAudGroupMsg[0]?.content.length > 20
        ? lastAudGroupMsg[0]?.content?.slice(0, 20) + '...'
        : lastAudGroupMsg[0]?.content;
      return recentMsg;
    }
  }

  return (
    <>
      <div style={{ display: "flex", flexDirection: "row", margin: 10, padding: 8, borderRadius: 8, cursor: "pointer", backgroundColor: "white", boxShadow: " 0 .2rem 0.5rem rgba(0,0,0,.15)" }}>
        <img src={groupImg} style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'rgb(58, 58, 58)', padding: '7px', margin: 5 }} />
        <div style={{ display: "flex", flexDirection: "column", flex: 1, marginLeft: 30 }}>
          <span style={{ color: "#5B5B5B" }}>Auditorium Chat</span>
          <span style={{ color: "grey", fontSize: 14 }}>{recentMsg()}</span>
        </div>
      </div>
    </>
  );
}

export default AuditoriumChat;