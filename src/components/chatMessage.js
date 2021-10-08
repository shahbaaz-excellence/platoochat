import React, { useEffect, useState } from "react";
import { FaSnapchat } from "react-icons/fa";
import { auth } from "../config/firebaseConfig";
import { RealTimeDb } from "../config/firebaseConfig";
import { subdomain } from "../constants/constants";

const ChatMessage = ({ userDetails }) => {

  const { uid } = auth.currentUser;
  const [chatMessages, setChatMessages] = useState([]);
  const [messageCount, setMessageCount] = useState(20);

  useEffect(()=>{
    if(userDetails && userDetails?.roomId && uid){
      getMessages(userDetails.roomId)
    }
  },[messageCount])

  const getMessages = (roomId) => {
    RealTimeDb.ref(`chats/${subdomain}/${roomId}`).limitToLast(messageCount).on("value", (snapshot) => {
      let msg = [];
      snapshot.forEach((snap) => {
        msg.push(snap.val())
      })
      setChatMessages(msg);
    })
  }

  const loadMore = (e) => {
    const top =  e.target.scrollTop + e.target.scrollHeight === e.target.clientHeight;
    if (top) {
      setMessageCount((messageCount) => messageCount + 20);
    }
  }

  return (
    <>
      <div className="chatMessageDiv" onScroll={(e) => loadMore(e)}>
        {chatMessages?.slice(0).reverse().map((val, index) => (
          <div key={index} className={val.sender === uid ? "sender" : "receiver"}>
            <span style={val.sender === uid ?
              { fontSize: 13, fontWeight: 400, background: "white", padding: 8, marginRight: 10, marginLeft: 40, marginTop: 5, marginBottom: 5, borderRadius: 5, boxShadow: " 0 .2rem 0.5rem rgba(0,0,0,.15)" }
              : { fontSize: 13, fontWeight: 400, background: "white", padding: 8, marginLeft: 10, marginRight: 40, marginTop: 5, marginBottom: 5, borderRadius: 5, boxShadow: " 0 .2rem 0.5rem rgba(0,0,0,.15)" }}>
              {val.content}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

export default ChatMessage;