import React, { useState, useEffect } from "react";
import cross from "../assets/cross.svg";
import attendee from "../assets/attendee.png";
import { subdomain } from "../constants/constants";
import { RealTimeDb } from "../config/firebaseConfig";
import "../App.css";
import { v4 as uuidv4 } from "uuid";
import { auth } from "../config/firebaseConfig";

const UserList = ({ setUserListView }) => {

  const [attendeeList, setAttendeeList] = useState();
  const [itemCount, setItemCount] = useState(10);
  const [groupName, setGroupName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);

  const { uid } = auth.currentUser;

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
          uid: snap.val().uid || "",
          photoURL: snap.val().photoURL || "",
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

  useEffect(() => {
    console.log(selectedUsers, "iiiiii");
  }, [selectedUsers])

  const handleSelectUser = (user) => {
    let userExist = false;
    const allUser = [...selectedUsers]
    allUser?.find(val => {
      if (val.uid === user.uid) {
        userExist = true
      }
    })

    if (userExist) {
      const a = [...selectedUsers]
      const b = a.filter(val => val.uid != user.uid)
      setSelectedUsers(b)
    }
    else {
      const a = [...selectedUsers]
      a.push(user);
      setSelectedUsers(a)
    }
  }

  const handleChangeGroupName = (grpName) => {
    setGroupName(grpName);
  }

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    let roomId = uuidv4();
    await RealTimeDb.ref(`customGroup/${subdomain}/` + roomId).set({
      name: groupName,
      roomid: roomId,
      admin: uid,
      type: "customGroup",
      uid: roomId,
      members: selectedUsers,
    });

    selectedUsers.forEach((val) => {
      RealTimeDb.ref(`users/${subdomain}/${val.uid}/customGroup/` + roomId).set({
        name: groupName,
        roomid: roomId,
        type: "customGroup",
        uid: roomId,
        admin: val.uid === uid ? true : false,
      });
    });
  }

  return (
    <>
      <>
        <form onSubmit={(e) => handleCreateGroup(e)} >
          <div style={{ backgroundColor: "white", marginTop: 5, display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <input
              placeholder="Type Group Name"
              required
              onChange={(e) => handleChangeGroupName(e.target.value)}
              style={{ width: "270px", height: 40, border: "none", outline: "none", paddingLeft: 8 }} />
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginRight: 8, flex: 1 }}>
              <div><button type="submit" style={{ color: "white", backgroundColor: "#5B5B5B", border: "none", borderRadius: 5 }}>Create</button></div>
              <div onClick={() => setUserListView(false)} style={{ height: 25, width: 25, borderRadius: "50%", background: "red", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer" }}><img src={cross} /></div>
            </div>
          </div>
        </form>

        <div className="userListDiv" onScroll={(e) => loadMore(e)}>

          {attendeeList?.map((user, index) => (
            <>
              <div key={index} style={{ display: "flex", flexDirection: "row", margin: 15, padding: 8, borderRadius: 8, backgroundColor: "white", alignItems: "center", boxShadow: " 0 .2rem 0.5rem rgba(0,0,0,.15)" }}>
                <input type="checkbox" onChange={(e) => handleSelectUser(user)} style={{ cursor: "pointer", height: 15, width: 15, fill: 'white' }} />
                <div style={{ display: "flex", alignItems: "center", flex: 1, marginLeft: 8 }}>
                  <img src={attendee} style={{ borderRadius: "50%", height: 40, width: 40, objectFit: "none", margin: "5px" }} />
                  <span style={{ color: "#5B5B5B", fontSize: 18, marginLeft: 30 }}>{user?.name}</span>
                </div>
                <span style={{ height: 15, width: 15, borderRadius: "50%", backgroundColor: user.status == "online" ? "green" : "red", border: "1px solid white" }}></span>
              </div>
            </>
          ))}

        </div>
      </>
    </>
  )
}

export default UserList;