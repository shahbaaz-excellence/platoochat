import React from "react";
import Smiley1 from "../assets/Smiley1.png";
import Smiley2 from "../assets/Smiley2.png";
import Smiley3 from "../assets/Smiley3.png";
import Smiley4 from "../assets/Smiley4.png";

const EmojiPoll = () => {
  return (
    <>
      <div style={{ boxShadow: " 0 .2rem 0.5rem rgba(0,0,0,.15)", borderRadius: 10, background: "white", paddingTop: 10, paddingBottom: 10, paddingLeft: 20, paddingRight: 20, marginBottom:10 }}>
        <span style={{ font: 18, fontWeight: 700, color: "#5B5B5B" }}>
          Q1. This is the first poll with a long question. dfdcjsbd dsbdsjbc dcsdjcsd ds csdbcjbsd sdbcjbdcb b dbh dcbhd c bcdv
        </span>
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", padding: 5, marginTop: 10 }}>
          <input type="radio" style={{ marginRight: 15 }} />
          <img src={Smiley1} style={{ marginLeft: 5 }} />
        </div>
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", padding: 5, marginTop: 10 }}>
          <input type="radio" style={{ marginRight: 15 }} />
          <img src={Smiley2} style={{ marginLeft: 5 }} />
        </div>
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", padding: 5, marginTop: 10 }}>
          <input type="radio" style={{ marginRight: 15 }} />
          <img src={Smiley3} style={{ marginLeft: 5 }} />
        </div>
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", padding: 5, marginTop: 10 }}>
          <input type="radio" style={{ marginRight: 15 }} />
          <img src={Smiley4} style={{ marginLeft: 5 }} />
        </div>
      </div>
    </>
  );
}

export default EmojiPoll;