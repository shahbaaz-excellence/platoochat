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
import plus from "../assets/plus.svg";
import UserList from "./userList";
import search from "../assets/search.svg";

const MyChats = ({ setMessageScreen, messageScreen, chatWindow }) => {

  const [myChats, setMyChats] = useState([]);
  const [customGroup, setCustomGroup] = useState([]);
  const [userListView, setUserListView] = useState(false);
  const [myUserObject, setMyUserObject] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "",
    uid: "",
    roomId: "",
    photoURL: "",
    type: "",
  });
  const [addGrpSearchText, setAddGrpSearchText] = useState();

  const { uid } = auth.currentUser;

  useEffect(() => {
    if (uid) {
      getRecentMessages();
    }
  }, [])

  const getRecentMessages = () => {
    RealTimeDb.ref(`users/${subdomain}/`).orderByChild("uid").equalTo(`${uid}`).on("value", (snapshot) => {
      const myUserObj = snapshot.val() && snapshot.val()[uid];
      setMyUserObject(myUserObj);
      let recentMessageUser = [];
      RealTimeDb.ref(`users/${subdomain}/${uid}/recentMessage/`).on("value", (snapshot) => {
        snapshot.forEach((snap) => {
          recentMessageUser.push(snap.val())
        })
        recentMessageUser = recentMessageUser?.sort(function (a, b) {
          return new Date(b.timestamp) - new Date(a.timestamp);
        });
        let recentUsers = recentMessageUser.filter(val => val.recipient != 'group')
        // console.log(recentUsers, "iiiii")
        setMyChats(recentUsers)
      })
      myUserObj?.customGroup && setCustomGroup(Object.keys(myUserObj?.customGroup));
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

  const handleSearch = (e) => {
    const searchVal = e.target.value;
    if (userListView === true) {
      setAddGrpSearchText(searchVal)
    }
  }

  return (
    <>
      {messageScreen === false ?
        <>
          <div className="attendeeDiv">
            <div style={{ padding: 10, backgroundColor: "white" }}>
              <span style={{ color: "#5B5B5B", fontSize: 18, fontWeight: 500 }}>My Chats</span>
            </div>
            {userListView === false ? <div>
              <div onClick={() => setUserListView(true)} style={{ padding: 5, backgroundColor: "white", marginTop: 5, display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer" }}>
                <span style={{ color: "#5B5B5B", fontSize: 12, fontWeight: 500 }}>Create a New Group</span>
                <img src={plus} alt="add" style={{ marginLeft: 10 }} />
              </div>

              {<PublicGroup
                setMessageScreen={setMessageScreen}
                setUserDetails={setUserDetails}
                userDetails={userDetails}
              />}

              {<AuditoriumChat
                setMessageScreen={setMessageScreen}
                setUserDetails={setUserDetails}
                userDetails={userDetails}
              />}

              {<HelpChat
                setMessageScreen={setMessageScreen}
                setUserDetails={setUserDetails}
                userDetails={userDetails}
              />}

              {<ExhibitorChat
                setMessageScreen={setMessageScreen}
                setUserDetails={setUserDetails}
                userDetails={userDetails}
              />}

              <CustomGroupChats
                customGroup={customGroup}
                myUserObject={myUserObject}
                handleTime={handleTime}
                setMessageScreen={setMessageScreen}
                userDetails={userDetails}
                setUserDetails={setUserDetails}
              />

              <PrivateChats
                myChats={myChats}
                myUserObject={myUserObject}
                handleTime={handleTime}
                setMessageScreen={setMessageScreen}
                userDetails={userDetails}
                setUserDetails={setUserDetails}
              />
            </div> :
              <UserList
                setUserListView={setUserListView}
                userListView={userListView}
                addGrpSearchText={addGrpSearchText}

              />}

          </div>
          {chatWindow == true &&
            <form style={{ position: "fixed", bottom: 0, display: "flex", flexDirection: "row", alignItems: "center", background: "white" }}>
              <img src={search} alt="search" style={{ marginLeft: 10 }} />
              <input
                placeholder="Search" onChange={(e) => handleSearch(e)}
                style={{ width: "325px", height: "40px", border: "none", outline: "none", paddingLeft: 10 }} />
            </form>}
        </>
        : <MessageScreen
          setMessageScreen={setMessageScreen}
          userDetails={userDetails}
        />}
    </>
  );
}
export default MyChats;