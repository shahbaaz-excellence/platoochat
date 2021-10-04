import React, { useEffect, useState } from "react";
import { auth } from "../config/firebaseConfig";
import { RealTimeDb } from "../config/firebaseConfig";
import { subdomain } from "../constants/constants";
import PublicGroup from "./publicGroup";
import AuditoriumChat from "./auditoriumChat";
import HelpChat from "./helpChat";
import ExhibitorChat from "./exhibitorChat";
import PrivateChats from "./privateChats";
import CustomGroupChats from "./customGroupChats";
import MessageScreen from "./messageScreen";

const MyChats = ({ setMessageScreen, messageScreen }) => {

  const [myChats, setMyChats] = useState([]);
  const [customGroup, setCustomGroup] = useState([]);
  const [userList, setUserList] = useState([]);
  const [myUserObject, setMyUserObject] = useState(false);
  // const [] = useState();

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
      // console.log(recentMessages,"iiiii")
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
        })
      })
      setUserList(users);
    })
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


  return (
    <>
      {messageScreen === false ? <div className="attendeeDiv">
        <div style={{ padding: 10, borderBottom: "1px solid grey", backgroundColor: "white" }}>
          <span>My Chats</span>
        </div>

        {<PublicGroup setMessageScreen={setMessageScreen} />}

        {<AuditoriumChat setMessageScreen={setMessageScreen} />}

        {<HelpChat setMessageScreen={setMessageScreen} />}

        {<ExhibitorChat setMessageScreen={setMessageScreen} />}

        <CustomGroupChats
          customGroup={customGroup}
          myUserObject={myUserObject}
          handleTime={handleTime}
          setMessageScreen={setMessageScreen}
        />

        <PrivateChats
          myChats={myChats}
          myUserObject={myUserObject}
          handleTime={handleTime}
          setMessageScreen={setMessageScreen}
        />


      </div> :
        <MessageScreen
          setMessageScreen={setMessageScreen}
        />}
    </>
  );
}
export default MyChats;