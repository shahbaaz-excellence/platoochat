import React, { useState, useEffect } from "react";
import { auth } from "../config/firebaseConfig";
import { RealTimeDb } from "../config/firebaseConfig";
import { subdomain } from "../constants/constants";
import attendee from "../assets/attendee.png";

const Message = ({ val, userDetails }) => {

  const [status, setStatus] = useState(false);

  const { uid } = auth.currentUser;

  useEffect(() => {
    getUserStatus();
  }, [])

  const getUserStatus = () => {
    if (val?.sender) {
      RealTimeDb.ref(`users/${subdomain}/${val.sender}`).on("value", (snapshot) => {
        if (snapshot?.val()?.status == 'online') {
          setStatus(true)
        } else {
          setStatus(false)
        }
      })
    }
  }

  return (
    <>
      <div className={val.sender === uid ? "sender" : "receiver"}>
        {userDetails.type !== "privateChat" && val.sender !== uid &&
          <div style={{ position: "relative", height: "fit-content" }}>
            <img style={{ borderRadius: "50%", height: 40, width: 40, objectFit: "none" }} src={attendee} />
            <span style={{ height: 10, width: 10, borderRadius: "50%", background: status ? "green " : "red", position: "absolute", bottom: 2, right: 2 }}></span>
          </div>}
        <span style={val.sender === uid ?
          { fontSize: 13, fontWeight: 400, background: "white", padding: 8, height: "fit-content", marginRight: 10, marginLeft: 70, borderRadius: 5, boxShadow: " 0 .2rem 0.5rem rgba(0,0,0,.15)" }
          : { fontSize: 13, fontWeight: 400, background: "white", padding: 8, height: "fit-content", marginLeft: 10, marginRight: 40, borderRadius: 5, boxShadow: " 0 .2rem 0.5rem rgba(0,0,0,.15)" }}>
          {val.content}
        </span>
      </div>
    </>
  );
}

export default Message;