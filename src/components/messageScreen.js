import React from "react";
import TopNavBar from "./topNavbar";
import ChatMessage from "./chatMessage";
import InputChat from "./inputChat";

const MessageScreen = ({ setMessageScreen, userDetails }) => {
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>

        <TopNavBar
          setMessageScreen={setMessageScreen}
          userDetails={userDetails}
        />

        <div style={{ display: "flex", flexDirection: "column", minHeight: "64vh" }}>
          <ChatMessage userDetails={userDetails} />
          <InputChat userDetails={userDetails} />
        </div>
      </div>
    </>
  );
}

export default MessageScreen;