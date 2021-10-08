import React from "react";
import groupImg from "../assets/group.svg";

const PublicGroup = ({ setMessageScreen, setUserDetails, userDetails }) => {

  const handlePublicGroup = () => {
    setUserDetails({
      ...userDetails,
      name: "Public Group",
      roomId: "group",
      type: "publicGroup", 
    })
    setMessageScreen(true)
  }

  return (
    <>
      <div onClick={() => handlePublicGroup()} style={{ margin: 10, padding: 8, borderRadius: 8, cursor: "pointer", backgroundColor: "white", boxShadow: " 0 .2rem 0.5rem rgba(0,0,0,.15)" }}>
        <img src={groupImg} style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'rgb(58, 58, 58)', padding: '7px', margin: 5 }} />
        <span style={{ color: "#5B5B5B", marginLeft: 30 }}>Public Group</span>
      </div>
    </>
  );
}

export default PublicGroup;