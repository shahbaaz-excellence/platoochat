import React from "react";
import groupImg from "../assets/group.svg";

const PublicGroup = () => {
  return (
    <>
      <div style={{ margin: 10, padding: 8, borderRadius: 8, cursor: "pointer", backgroundColor: "white" }}>
        <img src={groupImg} style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'rgb(58, 58, 58)', padding: '7px', margin: 5 }} />
        <span style={{ color: "#5B5B5B", marginLeft: 30 }}>Public Group</span>
      </div>
    </>
  );
}

export default PublicGroup;