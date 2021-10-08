import React from "react";
import send from "../assets/send.svg";
import attachment from "../assets/attachment.svg";
import smiley from "../assets/smiley.svg";

const InputChat = () => {
  return (
    <>
      <form style={{ position: "fixed", bottom: 0, display: "flex", flexDirection: "row", alignItems: "center", background: "white" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 30, width: 40, cursor: "pointer" }}>
          <img src={smiley} alt="smiley" />
        </div>
        <input
          placeholder="Type your message"
          style={{ width: "253px", height: 40, border: "none", outline: "none" }} />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 30, width: 40, cursor: "pointer" }}>
          <img src={attachment} alt="smiley" />
        </div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 30, width: 40, cursor: "pointer" }}>
          <img src={send} alt="smiley" />
        </div>
      </form>
    </>
  );
}

export default InputChat;