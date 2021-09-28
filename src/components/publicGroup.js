import React from "react";
import groupImg from "../assets/group.svg";

const PublicGroup = () => {
  return (
    <>
      <div style={{margin: 10, padding: 8, borderRadius: 8, cursor: "pointer", backgroundColor: "white"}}>
        <img src={groupImg} style={{ width: '40px', height: '40px', borderRadius: '5px', backgroundColor: 'rgb(58, 58, 58)', padding: '5px',margin:5 }}/>
        <span style={{ color: "#696969" }}>Public Group</span>
      </div>
    </>
  );
}

export default PublicGroup;