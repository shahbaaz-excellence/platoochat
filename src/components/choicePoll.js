import React from "react";

const ChoicePoll = () => {
  return (
    <>
      <div style={{ boxShadow: " 0 .2rem 0.5rem rgba(0,0,0,.15)", borderRadius: 10, background: "white", paddingTop: 10, paddingBottom: 10, paddingLeft: 20, paddingRight: 20, marginBottom: 10 }}>
        <span style={{ font: 18, fontWeight: 700, color: "#5B5B5B" }}>
          Q1. This is the first poll with a long question. dfdcjsbd dsbdsjbc dcsdjcsd ds csdbcjbsd sdbcjbdcb b dbh dcbhd c bcdv
        </span>
        {[1, 2, 3, 4].map((value, index) => (
          <>
            <div key={index} style={{ display: "flex", flexDirection: "row", alignItems: "center", padding: 5, marginTop: 10 }}>
              <input type="radio" style={{ marginRight: 15 }} />
              <span>Option {`${index + 1}`}</span>
            </div>
          </>
        ))}
      </div>
    </>
  );
}

export default ChoicePoll;