import React, { useEffect, useState } from "react";
import { auth } from "../config/firebaseConfig";
import { RealTimeDb } from "../config/firebaseConfig";
import { subdomain } from "../constants/constants";
import Message from "./message";

const ChatMessage = ({ userDetails }) => {

  const [chatMessages, setChatMessages] = useState([]);
  const [messageCount, setMessageCount] = useState(20);
  const { uid } = auth.currentUser;

  useEffect(() => {
    if (userDetails && userDetails?.roomId && uid) {
      getMessages(userDetails.roomId)
    }
  }, [messageCount])

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
    const top = e.target.scrollTop + e.target.scrollHeight === e.target.clientHeight;
    if (top) {
      setMessageCount((messageCount) => messageCount + 20);
    }
  }

  return (
    <>
      <div className="chatMessageDiv" onScroll={(e) => loadMore(e)}>
        {chatMessages?.slice(0).reverse().map((val, index) => (
          <Message val={val} userDetails={userDetails} />
        ))}
      </div>
    </>
  );
}

export default ChatMessage;