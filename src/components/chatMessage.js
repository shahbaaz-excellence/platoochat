import React from "react";

const ChatMessage = () => {

  // const { uid } = auth.currentUser;

  const chats = [
    { message: "Hi", sender: "me" },
    { message: "Hello", sender: "you" },
    { message: "How are u doing", sender: "me" },
    { message: "I am doing great", sender: "you" },
    { message: "dfhfgh ghfghfg", sender: "me" },
    { message: "Hi", sender: "me" },
    { message: "Hello", sender: "you" },
    { message: "How are u doing", sender: "me" },
    { message: "I am doing great", sender: "you" },
    { message: "dfhfgh ghfghfg", sender: "me" },
    { message: "Hi", sender: "me" },
    { message: "Hello", sender: "you" },
    { message: "How are u doing", sender: "me" },
    { message: "I am doing great", sender: "you" },
    { message: "dfhfgh ghfghfg", sender: "me" },
    { message: "Hi", sender: "me" },
    { message: "Hello", sender: "you" },
    { message: "How are u doing", sender: "me" },
    { message: "I am doing great", sender: "you" },
    { message: "dfhfgh ghfghfg", sender: "me" },
    { message: "Hi", sender: "me" },
    { message: "Hello", sender: "you" },
    { message: "How are u doing", sender: "me" },
    { message: "I am doing great", sender: "you" },
    { message: "How are u doing", sender: "me" },
    { message: "I am doing great", sender: "you" },
    { message: "dfhfgh ghfghfggfh fghgjhgj fgh gfh gfh ghj ej jegh rfhf ghfg hgfj j tyrter t j jghght ghgg thghg jhjhjjky jweyrtu g ujnghmghmgh ytyukiuo jjk", sender: "me" },
    { message: "dfhfgh ghfghfggfh fghgjhgj fgh gfh gfh ghj ej jegh rfhf ghfg hgfj j tyrter t j jghght ghgg thghg jhjhjjky jweyrtu g ujnghmghmgh ytyukiuo jjk", sender: "you" },
  ]
  return (
    <>
      <div className="chatMessageDiv">
        {chats.map((val, index) => (
          <div key={index} className={val.sender === "me" ? "sender" : "receiver"}>
            <span style={val.sender === "me" ?
              { background: "#d3d3d3", padding: 5, marginRight: 8, marginLeft: 40, marginTop: 5, marginBottom: 5, borderRadius: 5 }
              : { background: "#fca605", padding: 5, marginLeft: 8, marginRight: 40, marginTop: 5, marginBottom: 5, borderRadius: 5 }}>
              {val.message}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

export default ChatMessage;