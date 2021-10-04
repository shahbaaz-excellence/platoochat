import React from "react";
import { BsFillVolumeMuteFill } from 'react-icons/bs';
import { VscUnmute } from 'react-icons/vsc';
import attendee from "../assets/attendee.svg";

const PrivateChats = ({myChats,myUserObject,handleTime,setMessageScreen}) => {

  const userRecentMsg = (user) => {
    const recentMsg = myUserObject?.recentMessage[user?.uid]?.content.length > 20
      ? myUserObject?.recentMessage[user?.uid]?.content?.slice(0, 20) + '...'
      : myUserObject?.recentMessage[user?.uid]?.content;
    return recentMsg;
  }


  return (
    <>
      {myChats?.map((user, index) => (
          <>
            <div key={index} onClick={()=>setMessageScreen(true)} style={{ display: "flex", flexDirection: "row", alignItems: "center", margin: 10, padding: 8, borderRadius: 8, cursor: "pointer", backgroundColor: "white" }}>
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
    </>
  );
}

export default PrivateChats;