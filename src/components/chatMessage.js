import React, { useEffect, useState } from "react";
import { FaSnapchat } from "react-icons/fa";
import { auth } from "../config/firebaseConfig";
import { RealTimeDb } from "../config/firebaseConfig";
import { subdomain } from "../constants/constants";
import attendee from "../assets/attendee.png";

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

  const getUserStatus = (sender) => {
    let status = false;
    if (sender) {
      RealTimeDb.ref(`users/${subdomain}/${sender}`).on("value", (snapshot) => {
        if (snapshot?.val()?.status == 'online') {
          status = true;
        } else {
          status = false;
        }
      })
    }
    return status;
  }

  return (
    <>
      <div className="chatMessageDiv" onScroll={(e) => loadMore(e)}>
        {chatMessages?.slice(0).reverse().map((val, index) => (
          <div key={index} className={val.sender === uid ? "sender" : "receiver"}>
            { userDetails.type !== "privateChat" && val.sender !== uid &&
              <div style={{ position: "relative", height: "fit-content" }}>
                <img style={{ borderRadius: "50%", height: 40, width: 40, objectFit: "none" }} src={attendee} />
                <span style={{ height: 10, width: 10, borderRadius: "50%", background: getUserStatus(val.sender) ? "green " : "red", position: "absolute", bottom: 2, right: 2 }}></span>
              </div>}
            <span style={val.sender === uid ?
              { fontSize: 13, fontWeight: 400, background: "white", padding: 8, height: "fit-content", marginRight: 10, marginLeft: 70, borderRadius: 5, boxShadow: " 0 .2rem 0.5rem rgba(0,0,0,.15)" }
              : { fontSize: 13, fontWeight: 400, background: "white", padding: 8, height: "fit-content", marginLeft: 10, marginRight: 40, borderRadius: 5, boxShadow: " 0 .2rem 0.5rem rgba(0,0,0,.15)" }}>
              {val.content}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

export default ChatMessage;