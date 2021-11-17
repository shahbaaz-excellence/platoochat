import React from "react";
import { auth } from "../config/firebaseConfig";
import ChatUser from "./chatUser";

const PrivateChats = ({ myChats, myUserObject, handleTime, setMessageScreen, setUserDetails }) => {

  const { uid } = auth.currentUser;

  const userRecentMsg = (user) => {
    let recentMsg = "";
     if(user.sender==uid){
      recentMsg = myUserObject?.recentMessage[user?.recipient]?.content.length > 20
      ? myUserObject?.recentMessage[user?.recipient]?.content?.slice(0, 20) + '...'
      : myUserObject?.recentMessage[user?.recipient]?.content;
     } else {
      recentMsg = myUserObject?.recentMessage[user?.sender]?.content.length > 20
      ? myUserObject?.recentMessage[user?.sender]?.content?.slice(0, 20) + '...'
      : myUserObject?.recentMessage[user?.sender]?.content;
     }
    return recentMsg;
  }

  const getUserDetails = (user) => {
    if (user && uid) {
      setUserDetails({
        name: user.recipient === uid ? user.senderName : user.recipientName,
        roomId: user.roomid,
        uid: user.recipient === uid ? user.sender : user.recipient,
        photoURL: user.recipient === uid ? user.senderPhotoURL : user.recipientPhotoURL,
        type: "privateChat",
      })
      setMessageScreen(true)
    }
  }

  const getUserName = (user) => {
    if (user) {
      if (user.recipient === uid) {
        return user.senderName;
      }
      else {
        return user.recipientName;
      }
    }
  }


  return (
    <>
      {myChats?.map((user, index) => (
        <>
          <div key={index} onClick={() => getUserDetails(user)} style={{ display: "flex", flexDirection: "row", alignItems: "center", margin: 10, padding: 8, borderRadius: 8, cursor: "pointer", backgroundColor: "white", boxShadow: " 0 .2rem 0.5rem rgba(0,0,0,.15)" }}>
            <ChatUser user={user} getUserName={getUserName} userRecentMsg={userRecentMsg} handleTime={handleTime} uid={uid} />
          </div>
        </>
      ))}
    </>
  );
}

export default PrivateChats;