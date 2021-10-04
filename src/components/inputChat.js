import React from "react";

const InputChat = () => {
  return (
    <>
      <form style={{ position:"fixed", bottom:0 }}>
        <input placeholder="Type your message" style={{ width: "373px", height: 40, borderBottom: "none", borderLeft: "none", borderRight: "none", borderTop: "1px solid grey" }} />
      </form>
    </>
  );
}

export default InputChat;