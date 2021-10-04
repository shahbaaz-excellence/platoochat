import React from "react";
import groupImg from "../assets/group.svg";
import { BsFillVolumeMuteFill } from 'react-icons/bs';
import { VscUnmute } from 'react-icons/vsc';

const CustomGroupChats = ({customGroup,handleTime,myUserObject,setMessageScreen}) => {

  const groupName = (group) => {
    const grpName = myUserObject?.customGroup[group]?.name?.slice(0, 25)
    return grpName || "Untitled Group";
  }

  const groupRecentMsg = (group) => {
    const grpLastMsg = myUserObject?.customGroup[group]?.lastMessage?.content.length > 20
      ? myUserObject?.customGroup[group]?.lastMessage?.content.slice(0, 25) + "..."
      : myUserObject?.customGroup[group]?.lastMessage?.content
    return grpLastMsg || "";
  }

  return (
    <>
      {customGroup?.map((group, index) => (
        <>
          <div key={index} onClick={()=>setMessageScreen(true)} style={{ display: "flex", flexDirection: "row", alignItems: "center", margin: 10, padding: 8, borderRadius: 8, cursor: "pointer", backgroundColor: "white" }}>
            <img src={groupImg} style={{ width: '40px', height: '40px', borderRadius: '5px', backgroundColor: 'rgb(58, 58, 58)', padding: '5px', margin: 5 }} />
            <div style={{ display: "flex", flex: 1, flexDirection: "column" }}>
              <span style={{ color: "#696969" }}>{groupName(group)}</span>
              <span style={{ color: "grey", fontSize: 14 }}>{groupRecentMsg(group)}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <BsFillVolumeMuteFill color="	#00008B" />
              <span style={{ color: "darkgrey", fontSize: 13 }}>{groupRecentMsg(group) ? handleTime(group, true) : ""}</span>
            </div>
          </div>
        </>
      ))}
    </>
  );
}

export default CustomGroupChats;