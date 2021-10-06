import React from "react";
import { BsChevronLeft } from "react-icons/bs";
import { FiVideo } from "react-icons/fi";
import { MdCall } from "react-icons/md";
import { MdInfo } from "react-icons/md";
import { ImPhoneHangUp } from 'react-icons/im';
import { FaWhatsapp } from 'react-icons/fa';
import { AiOutlineIdcard } from 'react-icons/ai';

const TopNavBar = ({ setMessageScreen, attendeeDetails }) => {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", padding: 2, borderBottom: "1px solid grey", backgroundColor: "white", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
          <div style={{ height: 30, width: 30, borderRadius: "50%", backgroundColor: "lightgrey", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer" }}>
            <BsChevronLeft style={{ stroke: "black", strokeWidth: "2" }} onClick={() => setMessageScreen(false)} />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ marginLeft: 10 }}>{attendeeDetails?.name}</span>
            <span style={{ marginLeft: 10, fontSize: 13, color: "grey", marginTop: "-4px" }}>{attendeeDetails?.status === "online" ? "Online" : "Away"}</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ height: 30, width: 30, borderRadius: "50%", marginRight: 5, backgroundColor: "lightgrey", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer" }}>
            <AiOutlineIdcard style={{ stroke: "black", strokeWidth: "2" }} />
          </div>
          <div style={{ height: 30, width: 30, borderRadius: "50%", marginRight: 5, backgroundColor: "lightgrey", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer" }}>
            <FaWhatsapp style={{ stroke: "black", strokeWidth: "2" }} />
          </div>
          <div style={{ height: 30, width: 30, borderRadius: "50%", marginRight: 5, backgroundColor: "lightgrey", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer" }}>
            <MdCall style={{ stroke: "black", strokeWidth: "2" }} />
          </div>
          <div style={{ height: 30, width: 30, borderRadius: "50%", marginRight: 5, backgroundColor: "lightgrey", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer" }}>
            <FiVideo style={{ stroke: "black", strokeWidth: "2" }} />
          </div>
        </div>
      </div>
    </>
  );
}

export default TopNavBar;