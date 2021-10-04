import React, { useState, useEffect } from "react";
import attendee from "../assets/attendee.svg";
import { RealTimeDb } from "../config/firebaseConfig";
import { subdomain } from "../constants/constants";
import "../App.css";

const Attendees = ({messageScreen,setMessageScreen}) => {
  const [attendeeList, setAttendeeList] = useState();
  const [itemCount, setItemCount] = useState(10);


  useEffect(() => {
    getAllAttendees();
  }, [itemCount])

  const getAllAttendees = () => {
    RealTimeDb.ref(`users/${subdomain}/`).limitToFirst(itemCount).on("value", (snapshot) => {
      let users = [];
      snapshot.forEach((snap) => {
        users.push({
          name: snap.val().name || "untitled",
          status: snap.val().status || "offline",
        })
      })
      setAttendeeList(users);
    })
  }

  const loadMore = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      setItemCount((itemCount) => itemCount + 10);
    }
  }

  return (
    <>
      <div className="attendeeDiv" onScroll={(e)=>loadMore(e)}>
        <div style={{ padding: 10, borderBottom: "1px solid grey", backgroundColor: "white" }}>
          <span>Attendees</span>
        </div>
        {/* {console.log(attendeeList, "aaaaaaaaaaa")} */}
        {attendeeList?.map((user, index) => (
          <>
            <div key={index} style={{ display: "flex", flexDirection: "row", margin: 10, padding: 8, borderRadius: 8, cursor: "pointer", backgroundColor: "white" }}>
              <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <img src={attendee} />
                <span>{user.name}</span>
              </div>
              <span style={{ height: 15, width: 15, borderRadius: "50%", backgroundColor: user.status=="online" ? "green":"red", border: "1px solid white" }}></span>
            </div>
          </>
        ))}
      </div>
    </>
  );
}
export default Attendees;