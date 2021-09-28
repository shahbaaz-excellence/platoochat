import React, { useEffect, useState } from "react";
import attendee from "../assets/attendee.svg";
import { BsFillVolumeMuteFill } from 'react-icons/bs';
import { VscUnmute } from 'react-icons/vsc';
import { auth } from "../config/firebaseConfig";
import { RealTimeDb } from "../config/firebaseConfig";
import { subdomain } from "../constants/constants";
import PublicGroup from "./publicGroup";
import AuditoriumChat from "./auditoriumChat";
import HelpChat from "./helpChat";
import ExhibitorChat from "./exhibitorChat";
import groupImg from "../assets/group.svg";

const MyChats = () => {

  const [myChats, setMyChats] = useState([]);
  const [customGroup, setCustomGroup] = useState([]);
  const [userList, setUserList] = useState([]);
  const [myUserObject, setMyUserObject] = useState();

  const { uid } = auth.currentUser;

  useEffect(() => {
    getAllUserUid();
  }, [])

  useEffect(() => {
    if (userList && userList.length) {
      getRecentMessages();
    }
  }, [userList])

  const getRecentMessages = () => {
    RealTimeDb.ref(`users/${subdomain}/`).orderByChild("uid").equalTo(`${uid}`).on("value", (snapshot) => {
      const myUserObj = snapshot.val()[uid];
      setMyUserObject(myUserObj);
      let recentMessagesUser = myUserObj?.recentMessage ? Object.keys(myUserObj?.recentMessage) : [];
      recentMessagesUser = recentMessagesUser.filter(val => val != 'group')
      let recentMessages = myUserObj?.recentMessage ? recentMessagesUser.map(val => {
        let data = myUserObj?.recentMessage[val];
        data['uid'] = val;
        return data;
      }) : [];
      recentMessages = recentMessages.sort(function (a, b) {
        return new Date(b.timestamp) - new Date(a.timestamp);
      });
      let recentUsers = recentMessages.map((value) => {
        let userinfo = userList.filter((val) => val.uid == value.uid);
        if (userinfo.length) {
          return userinfo[0];
        }
      })
      setMyChats(recentUsers)
      myUserObj?.customGroup && setCustomGroup(Object.keys(myUserObj?.customGroup));
    })
  }

  const getAllUserUid = () => {
    RealTimeDb.ref(`users/${subdomain}/`).on("value", (snapshot) => {
      let users = [];
      snapshot.forEach((snap) => {
        users.push({
          uid: snap.val()?.uid,
          status: snap.val()?.status,
          name: snap.val()?.name,
          photoURL: snap.val()?.photoURL,
          roomid: snap.val()?.roomid,
        })
      })
      setUserList(users);
    })
  }

  const userRecentMsg = (user) => {
    const recentMsg = myUserObject?.recentMessage[user?.uid]?.content.length > 20
      ? myUserObject?.recentMessage[user?.uid]?.content?.slice(0, 20) + '...'
      : myUserObject?.recentMessage[user?.uid]?.content;
    return recentMsg;
  }


  const handleTime = (user, isGroup) => {

    const timestamp = isGroup ? myUserObject?.customGroup[user]?.lastMessage?.timestamp : myUserObject?.recentMessage[user?.uid]?.timestamp

    let d = (
      (new Date().getTime() - new Date(timestamp).getTime()) /
      (1000 * 60 * 60 * 24)
    ).toFixed(0);
    let x = new Date(timestamp);
    if (d < 1) {
      if (x.getMinutes() < 9) {
        return x.getHours() + ':0' + x.getMinutes();
      }
      return x.getHours() + ':' + x.getMinutes();
    } else if (d > 0 && d < 2) {
      return 'yesterday';
    } else if (d > 1 && d < 7) {
      switch (x.getDay()) {
        case 0:
          return 'sun';
        case 1:
          return 'Mon';
        case 2:
          return 'Tue';
        case 3:
          return 'Wed';
        case 4:
          return 'Thu';
        case 5:
          return 'Fri';
        case 6:
          return 'Sat';
      }
    } else {
      switch (x.getMonth()) {
        case 0:
          return x.getDate() + ' ' + 'Jan';
        case 1:
          return x.getDate() + ' ' + 'Feb';
        case 2:
          return x.getDate() + ' ' + 'Mar';
        case 3:
          return x.getDate() + ' ' + 'Apr';
        case 4:
          return x.getDate() + ' ' + 'May';
        case 5:
          return x.getDate() + ' ' + 'Jun';
        case 6:
          return x.getDate() + ' ' + 'Jul';
        case 7:
          return x.getDate() + ' ' + 'Aug';
        case 8:
          return x.getDate() + ' ' + 'Sep';
        case 9:
          return x.getDate() + ' ' + 'Oct';
        case 10:
          return x.getDate() + ' ' + 'Nov';
        case 11:
          return x.getDate() + ' ' + 'Dec';
      }
      return x.getDate() + '/' + (x.getMonth() + 1);
    }
  };

  const groupName = (group) => {
    const grpName = myUserObject?.customGroup[group]?.name?.slice(0, 25)
    return grpName || "Untitled Group";
  }

  const groupRecentMsg = (group) => {
    const grpLastMsg = myUserObject?.customGroup[group]?.lastMessage?.content.length > 20
      ? myUserObject?.customGroup[group]?.lastMessage?.content.slice(0, 25) + "..."
      : myUserObject?.customGroup[group]?.lastMessage?.content
    return grpLastMsg || "";
  }


  return (
    <>
      <div className="attendeeDiv">
        <div style={{ padding: 10, borderBottom: "1px solid black", backgroundColor: "white" }}>
          <span>My Chats</span>
        </div>

        {<PublicGroup />}

        {<AuditoriumChat />}

        {<HelpChat />}

        {<ExhibitorChat />}

        {customGroup?.map((group, index) => (
          <>
            <div key={index} style={{ display: "flex", flexDirection: "row", alignItems: "center", margin: 10, padding: 8, borderRadius: 8, cursor: "pointer", backgroundColor: "white" }}>
              <img src={groupImg} style={{ width: '40px', height: '40px', borderRadius: '5px', backgroundColor: 'rgb(58, 58, 58)', padding: '5px', margin: 5 }} />
              <div style={{ display: "flex", flex: 1, flexDirection: "column" }}>
                <span style={{ color: "#696969" }}>{groupName(group)}</span>
                <span style={{ color: "grey", fontSize: 14 }}>{groupRecentMsg(group)}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <BsFillVolumeMuteFill color="	#00008B" />
                <span style={{ color: "darkgrey", fontSize: 13 }}>{groupRecentMsg(group) ? handleTime(group, true) : ""}</span>
              </div>
            </div>
          </>
        ))}

        {myChats?.map((user, index) => (
          <>
            <div key={index} style={{ display: "flex", flexDirection: "row", alignItems: "center", margin: 10, padding: 8, borderRadius: 8, cursor: "pointer", backgroundColor: "white" }}>
              <img src={attendee} />
              <div style={{ display: "flex", flex: 1, flexDirection: "column" }}>
                <span style={{ color: "#696969" }}>{user?.name}</span>
                <span style={{ color: "grey", fontSize: 14 }}>{userRecentMsg(user)}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <BsFillVolumeMuteFill color="	#00008B" />
                <span style={{ color: "darkgrey", fontSize: 13 }}>{handleTime(user, false)}</span>
              </div>
            </div>
          </>
        ))}
      </div>
    </>
  );
}
export default MyChats;