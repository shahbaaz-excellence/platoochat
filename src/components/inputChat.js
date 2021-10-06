import React from "react";
import { MdSend } from 'react-icons/md';
import { VscSmiley } from 'react-icons/vsc';
import { ImAttachment } from 'react-icons/im';

const InputChat = () => {
  return (
    <>
      <form style={{ position: "fixed", bottom: 0, display: "flex", flexDirection: "row", alignItems: "center", borderTop:"1px solid grey" }}>
        <input
          placeholder="Type your message"
          style={{ width: "283px", height: 40, border: "none", outline:"none" }} />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 30, width: 30, borderRadius: "50%", background: "lightgrey", cursor: "pointer" }}>
          <ImAttachment />
        </div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 30, width: 30, borderRadius: "50%", background: "lightgrey", cursor: "pointer" }}>
          <VscSmiley />
        </div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 30, width: 30, borderRadius: "50%", background: "lightgrey", cursor: "pointer" }}>
          <MdSend />
        </div>
      </form>
    </>
  );
}

export default InputChat;