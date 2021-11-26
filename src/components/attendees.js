import React, { useState, useEffect } from "react";
import attendee from "../assets/attendee.png";
import { RealTimeDb } from "../config/firebaseConfig";
import { subdomain } from "../constants/constants";
import MessageScreen from "./messageScreen";
import search from "../assets/search.svg";
import { auth } from "../config/firebaseConfig";
import "../App.css";

const Attendees = ({ messageScreen, setMessageScreen, chatWindow }) => {
  const [attendeeList, setAttendeeList] = useState();
  const [itemCount, setItemCount] = useState(10);
  const [attendeeDetails, setAttendeeDetails] = useState({
    name: "",
    uid: "",
    roomId: "",
    photoURL: "",
    type: "",
  });

  const userData = auth?.currentUser;

  useEffect(() => {
    getAllAttendees();
  }, [itemCount,messageScreen])


  const getAllAttendees = () => {
    RealTimeDb.ref(`users/${subdomain}/`).limitToFirst(itemCount).orderByChild("name").on("value", (snapshot) => {
      let users = [];
      snapshot.forEach((snap) => {
        users.push({
          name: snap.val().name || "untitled",
          email: snap.val().email,
          uid: snap.val().uid,
          photoURL: snap.val().photoURL || "",
          status: snap.val().status,
        })
      })
      setAttendeeList(users);
    })
  }

  const loadMore = (e) => {
    console.log("endddd.....");
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      console.log("endddd");
      setItemCount((itemCount) => itemCount + 10);
    }
  }

  const getAttendeeDetails = (user) => {

    const roomid = userData?.email?.toLowerCase() < user?.email?.toLowerCase() ? `${userData?.uid}_${user?.uid}` : `${user?.uid}_${userData?.uid}`

    if (user && roomid) {
      setAttendeeDetails({
        name: user.name,
        uid: user.uid,
        roomId: roomid,
        photoURL: user.photoURL,
        type: "privateChat",
      })
      setMessageScreen(true)
    }
  }

  const handleSearch = (e) => {
    RealTimeDb.ref(`users/${subdomain}/`).limitToFirst(itemCount).orderByChild("name").startAfter(`${e.target.value}`).endAt(`${e.target.value}\uf8ff`).on("value", (snapshot) => {
      let users = [];
      snapshot.forEach((snap) => {
        users.push({
          name: snap.val().name || "untitled",
          email: snap.val().email,
          uid: snap.val().uid,
          photoURL: snap.val().photoURL || "",
          status: snap.val().status,
        })
      })
      setAttendeeList(users);
    })
  }

  return (
    <>
      {messageScreen === false ?
        <>
          <div className="attendeeDiv" onScroll={(e) => loadMore(e)}>
            <div style={{ padding: 10, backgroundColor: "white", boxShadow: ".2rem rgba(0,0,0,.15)" }}>
              <span style={{ color: "#5B5B5B", fontSize: 18, fontWeight: 500 }}>Attendees</span>
            </div>
            {/* {console.log(attendeeList, "aaaaaaaaaaa")} */}
            {attendeeList?.filter(value=>value.uid!==userData.uid).map((user, index) => (
              <>
                <div key={index} onClick={() => getAttendeeDetails(user)} style={{ display: "flex", flexDirection: "row", margin: 15, padding: 8, borderRadius: 8, cursor: "pointer", backgroundColor: "white", alignItems: "center", boxShadow: " 0 .2rem 0.5rem rgba(0,0,0,.15)" }}>
                  <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
                    <img src={attendee} style={{ borderRadius: "50%", height: 40, width: 40, objectFit: "none", margin: "5px" }} />
                    <span style={{ color: "#5B5B5B", fontSize: 18, marginLeft: 30 }}>{user.name}</span>
                  </div>
                  <span style={{ height: 15, width: 15, borderRadius: "50%", backgroundColor: user.status == "online" ? "green" : "red", border: "1px solid white" }}></span>
                </div>
              </>
            ))}
          </div>

          {chatWindow == true &&
            <form style={{ display: "flex", flexDirection: "row", alignItems: "center", background: "white" }}>
              <img src={search} alt="search" style={{ marginLeft: 10 }} />
              <input
                placeholder="Search" onChange={(e) => handleSearch(e)}
                style={{ width: "325px", height: "40px", border: "none", outline: "none", paddingLeft: 10 }} />
            </form>}
        </>
        : <MessageScreen
          setMessageScreen={setMessageScreen}
          userDetails={attendeeDetails}
        />}
    </>
  );
}
export default Attendees;