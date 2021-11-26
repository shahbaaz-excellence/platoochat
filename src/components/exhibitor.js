import React, { useState, useEffect } from "react";
import "../App.css";
import attendee from "../assets/attendee.png";
import { auth, RealTimeDb } from "../config/firebaseConfig";
import { subdomain, exhibition_id } from "../constants/constants";

const Exhibitor = () => {

  const [exhibitorList, setExhibitorList] = useState([]);
  const [itemCount, setItemCount] = useState(10);

  const getAllAttendees = () => {
    const {uid} = auth.currentUser
    RealTimeDb.ref(`users/${subdomain}/`).limitToFirst(itemCount).orderByChild('exhibitor').equalTo(true).on("value", (snapshot) => {
      let users = [];
      snapshot.forEach((snap) => {
        if(snap.val().exhibition_id == exhibition_id && snap.val().uid != uid){
          users.push({
            name: snap.val().name || "untitled",
            email: snap.val().email,
            uid: snap.val().uid,
            photoURL: snap.val().photoURL || "",
            status: snap.val().status,
          })
        }
      })
      setExhibitorList(users);
    })
  }


  useEffect(() => {
    getAllAttendees();
  }, [itemCount])

  const loadMore = (e) => {
    // console.log("endddd.....");
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      // console.log("endddd");
      setItemCount((itemCount) => itemCount + 10);
    }
  }

  return (
    <>
      <div className="attendeeDiv" onScroll={(e) => loadMore(e)}>
        <div style={{ padding: 10, backgroundColor: "white", boxShadow: ".2rem rgba(0,0,0,.15)" }}>
          <span style={{ color: "#5B5B5B", fontSize: 18, fontWeight: 500 }}>Exihibitors</span>
        </div>
        {exhibitorList.map((user, index) => (
          <>
            <div key={index} style={{ display: "flex", flexDirection: "row", margin: 15, padding: 8, borderRadius: 8, cursor: "pointer", backgroundColor: "white", alignItems: "center", boxShadow: " 0 .2rem 0.5rem rgba(0,0,0,.15)" }}>
              <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <img src={user.photoURL ? user.photoURL : attendee} style={{ borderRadius: "50%", height: 40, width: 40, objectFit: user.photoURL ? "cover":"none", margin: "5px" }} />
                <span style={{ color: "#5B5B5B", fontSize: 18, marginLeft: 30 }}>{user?.name}</span>
              </div>
              <span style={{ height: 15, width: 15, borderRadius: "50%", backgroundColor: user?.status == "online" ? "green" : "red", border: "1px solid white" }}></span>
            </div>
          </>
        ))}
      </div>
    </>
  );
}

export default Exhibitor;