import React, { useState, useEffect } from "react";
import attendee from "../assets/attendee.svg";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../redux/store";
import { getAttendeeList } from "../redux/slices/attendeeSlice";
import InfiniteScroll from 'react-infinite-scroll-component';

const Attendees = () => {
  const dispatch = useAppDispatch();
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const attendeeList = useSelector((state) => state.allAttendees.attendeeList);

  useEffect(() => {
    dispatch(getAttendeeList())
  }, [])
  useEffect(()=>{
    if(attendeeList.length){
      const newAttendeeList=attendeeList.slice(0,10)
    setItems([...newAttendeeList])

    }
  },[attendeeList])

  const fetchData = () => {
    if (items.length >= attendeeList.length) {
      setHasMore(false);
      return;
    }
    setItems((prev)=>prev.concat(attendeeList.slice(prev.length,prev.length+10)))
   
  };
  console.log(attendeeList, "attendeesfetched")

  return (
    <>
      <div style={{ backgroundColor: "lightgrey" }}>
        <div style={{ padding: 10, borderBottom: "1px solid black", backgroundColor: "white" }}>
          <span style={{}}>Attendees</span>
        </div>

        {/* {attendeeList.map((user, index) => (
          <>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", margin: 10, borderRadius: 8, cursor: "pointer", backgroundColor: "white" }}>
              <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <img src={attendee} alt="attendee" />
                <span style={{}}>{user.name}</span>
              </div>
              <span style={{ height: 15, width: 15, borderRadius: "50%", backgroundColor: "green", border: "1px solid white" }}></span>
            </div>
          </>
        ))} */}

        <InfiniteScroll
          dataLength={items.length>0 && items.length} //This is important field to render the next data
          next={fetchData}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
        >
          <>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", margin: 10, borderRadius: 8, cursor: "pointer", backgroundColor: "white" }}>
              <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <img src={attendee} alt="attendee" />
                <span style={{}}>name</span>
              </div>
              <span style={{ height: 15, width: 15, borderRadius: "50%", backgroundColor: "green", border: "1px solid white" }}></span>
            </div>
          </>
        </InfiniteScroll>
      </div>
    </>
  );
}
export default Attendees;