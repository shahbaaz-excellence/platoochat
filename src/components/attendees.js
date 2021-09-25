import React, { useEffect } from "react";
import attendee from "../assets/attendee.svg";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../redux/store";

const Attendees = () => {
  const dispatch = useAppDispatch();

  useEffect(()=>{
    dispatch()
  },[])

  return (
    <>
      <div style={{backgroundColor:"lightgrey"}}>
        <div style={{ padding: 10, borderBottom: "1px solid black", backgroundColor:"white"}}>
          <span style={{}}>Attendees</span>
        </div>

        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", margin: 10, borderRadius: 8, cursor: "pointer", backgroundColor:"white"}}>
          <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <img src={attendee} alt="attendee" />
            <span style={{}}>Attendee name</span>
          </div>
          <span style={{ height: 15, width: 15, borderRadius: "50%", backgroundColor: "green", border: "1px solid white" }}></span>
        </div>
      </div>
    </>
  );
}
export default Attendees;