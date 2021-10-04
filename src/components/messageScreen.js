import React from "react";
import TopNavBar from "./topNavbar";
import ChatMessage from "./chatMessage";
import InputChat from "./inputChat";

const MessageScreen = ({ setMessageScreen }) => {
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>

        <TopNavBar setMessageScreen={setMessageScreen} />

        <div style={{ display: "flex", flexDirection: "column", minHeight: "65vh" }}>
          <ChatMessage />
          <InputChat />
        </div>
      </div>
    </>
  );
}

export default MessageScreen;