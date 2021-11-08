import React from "react";
import star from "../assets/star.png";

const StarPollAns = ({ totalVotes }) => {

  const demoArray = [
    { name: 3, value: 29 },
    { name: 5, value: 52 },
    { name: 4, value: 47 },
    { name: 2, value: 17 },
    { name: 1, value: 21 }
  ];

  const colours = ['#FFEB3B',
    '#616A6B',
    '#7F8C8D',
    '#99A3A4',
    '#B2BABB',
    '#CCD1D1',
    '#E5E8E8',
    '#F2F4F4',
    '#795548',
    '#607D8B',
  ]

  return (
    <>
      <div style={{ boxShadow: " 0 .2rem 0.5rem rgba(0,0,0,.15)", borderRadius: 10, background: "white", paddingTop: 10, paddingBottom: 10, paddingLeft: 20, paddingRight: 20, marginBottom: 10 }}>
        <span style={{ font: 18, fontWeight: 700, color: "#5B5B5B" }}>
          Q1. This is the first poll with a long question. dfdcjsbd dsbdsjbc dcsdjcsd ds csdbcjbsd sdbcjbdcb b dbh dcbhd c bcdv
        </span>
        {[1, 2, 3, 4, 5].map((value, ind) => (
          <>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div key={ind} style={{ display: "flex", flexDirection: "row", alignItems: "center", padding: 5, marginTop: 10, width: "50%" }}>
                {[...Array(ind + 1).keys()].map((val, ind) => (<img key={ind} src={star} style={{ marginLeft: 5 }} />))}
              </div>
            </div>
          </>
        ))}
      </div>
    </>
  );
}

export default StarPollAns;