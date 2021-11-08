import React, { useState, useEffect, useRef } from "react";
import "../Styles/meetingroom.scss";
import Rooms from "./Rooms";
import { RealTimeDb } from "../config/firebaseConfig";
// import firebase from "../../config/firebase";
import { ModalBody, ModalHeader, Modal, ModalFooter, Button } from "reactstrap";
import { FaArrowCircleLeft, FaCheck, FaTimes } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { UploadFile } from "./fileUpload";

import { v4 as uuidv4 } from "uuid";

const MeetingRoom = ({ email, userName, domain, userId }, props) => {
  const password = "1234567";
  const [rooms, setRooms] = useState([]);
  const [val, setValues] = useState({
    roomName: "",
    roomNum: "",
    roomCaption: "",
  });
  const [showMeeting, setShowMeeting] = useState(true);
  const [createRoom, setCreateRoom] = useState(false);
  const [addRoom, setAddRoom] = useState(false);
  const [file, setFile] = useState("");
  const [loading, setLoading] = useState(false);
  // const [userId, setUserId] = useState(false);
  const [webinar, setWebinar] = useState("");
  const [userData, setUserData] = useState();
  const [usersAskingPermission, setUserAskingPermission] = useState([]);
  const meetingId = useRef("");


  // function getValueAtIndex(index){
  //   var str = window.location.href;
  //   return str.split("/")[index];
  // }

  // const query = props?.location?.search;
  // const urlParams = new URLSearchParams(query);
  // const id = urlParams.get("id");

  // urlParams && console.log(window.location.search,"77777777");


  // useEffect(()=>{
  // const customerData = JSON.parse(localStorage.getItem("CUSTOMER_DATA"));
  // let customerEmail = customerData?.email;
  // let displayName = customerData?.fname;
  // let domain=customerData?.subdomain
  // if (customerEmail && domain) {
  //   if(firebase?.getuserId()){
  //     setUserId(firebase?.getuserId())
  //   } else {
  //     login(customerEmail, displayName);
  //   }
  // }
  // },[])
  // const login = async (customerEmail) => {
  //   try {
  //     await firebase.login(customerEmail, password);
  //     setUserId(firebase?.getuserId())
  //   } catch (error) {
  //     if (error.code === "auth/user-not-found") {
  //       try {
  //         await firebase.signUp(customerEmail, password);
  //         setUserId(firebase?.getuserId())
  //       } catch (error) {

  //       }
  //     }

  //   }
  // };

  const handleAddRoom = (e) => {
    e.preventDefault();
    let roomId = uuidv4();
    // const customerData = JSON.parse(localStorage.getItem("CUSTOMER_DATA"));
    if (val.roomName && val.roomNum && val.roomCaption && !loading) {
      RealTimeDb.ref(`meetingRooms/${domain}/rooms/${roomId}`).set({
        roomNum: val.roomNum,
        roomName: val.roomName,
        roomCaption: val.roomCaption,
        roomId: roomId,
        hostEmail: email,
        file: file,
        seats: [],
      });
      for (
        let i = getLimit(val.roomNum).start;
        i <= getLimit(val.roomNum).end;
        i++
      ) {
        RealTimeDb.ref(
          `meetingRooms/${domain}/rooms/${roomId}/seats/${roomId + i
          }`
        ).set({
          status: "empty",
          attribute: `chairoccupied${i}`,
          seatId: roomId + i,
        });
      }
      setAddRoom(false);
      setValues({});
      setFile();
    }
  };
  const getLimit = (num) => {
    if (num === "two") {
      return { start: 1, end: 2 };
    }
    if (num === "four") {
      return { start: 3, end: 6 };
    }
    if (num === "six") {
      return { start: 1, end: 6 };
    }
    if (num === "eight") {
      return { start: 1, end: 8 };
    }
  };
  const chooseFile = (e) => {
    const file = e.target.files[0];
    UploadFile(file).then((uploadedFileData) => {
      const fileUrl = uploadedFileData?.url
      setFile(fileUrl);
      setLoading(false);
    })
      .catch((error) => {
        setLoading(true);
      });
  };

  useEffect(() => {
    const roomid = window.location.search;
    if (roomid) {
      meetingId.current = roomid
    }
    const customerData = JSON.parse(localStorage.getItem("CUSTOMER_DATA"));
    setUserData(customerData);
    RealTimeDb.ref(`meetingRooms/${domain}/rooms/`).on(
      "value",
      (snapshot) => {
        let rooms = [];
        snapshot.forEach((snap) => {
          let data = {
            ...snap.val(),
          };
          rooms.push(data);
        });
        setRooms(rooms);
      }
    );
    RealTimeDb.ref(`meetingRooms/${domain}/createRoom/`).on(
      "value",
      (snapshot) => {
        setCreateRoom(snapshot.val());
      }
    );
    setWebinar(localStorage.getItem("is_webinar"));
  }, []);

  useEffect(() => {
    let element = document.getElementsByClassName('profile-menu-header');
    if (!showMeeting) {
      element[0]?.classList?.add('hide-profile-menu-header')
    }
    else if (showMeeting) {
      element[0]?.classList?.remove('hide-profile-menu-header')
    }
  }, [showMeeting]);
  const getDataUserPermission = (data) => {
    setUserAskingPermission([...usersAskingPermission, ...data]);
  };

  const resetUserPermissions = () => {
    setUserAskingPermission([])
  }


  const approveRejectPermission = (data, roomId, type) => {
    console.log(data, "1111");
    console.log(roomId, "2222");
    console.log(type, "3333");
    // const customerData = JSON.parse(localStorage.getItem("CUSTOMER_DATA"));
    if (type == 'approve') {
      console.log("approve");
      RealTimeDb.ref(`meetingRooms/${domain}/rooms/${roomId}/seats/${data.seatId}`).update({
        permission: true,
        callActive: false
      })
    }
    else {
      console.log("reject");
      RealTimeDb.ref(`meetingRooms/${domain}/rooms/${roomId}/seats/${data.seatId}`).update({
        name: '',
        userId: "",
        name: "",
        userEmail: "",
        profileImage: "",
        designation: "",
        permission: ''
      })
      setUserAskingPermission(usersAskingPermission.filter((item, i) => {
        return item.userId !== data.userId
      }))
    }

  }

  const handleKickOut = (data, roomId) => {
    // const customerData = JSON.parse(localStorage.getItem("CUSTOMER_DATA"));
    RealTimeDb.ref(`meetingRooms/${domain}/rooms/${roomId}/seats/${data.seatId}`).update({
      permission: false,
    })
  }

  if (!userId) {
    return <span className='d-flex justify-content-center text-light m-4 p-4'>Loading... Please wait!!</span>
  }

  return (
    <>
      <div className={`meetingroom my-3 ${!showMeeting && "meetingroomHide"}`}>
        <div className="mainheader">
          <div className="row w-100 justify-content-between no-gutters heading pb-1">
            {webinar !== "true" && (
              <a href="./index">
                <FaArrowCircleLeft className="back-btn" />
              </a>
            )}
            <div className="headingtitle col-sm-12 col-12 d-flex align-items-center ">
              <a href="./index">
                <FaArrowCircleLeft
                  className={`${webinar === "true" && "back-btn-sm-webinar"
                    } back-btn-sm mr-2`}
                />
              </a>
              {"Meeting Room"}
              {createRoom && (
                <button
                  className="btn addbtn ml-3"
                  onClick={() => setAddRoom(!addRoom)}
                >
                  Add Room
                </button>
              )}
            </div>

          </div>
          <div
            className={`allRooms row no-gutters pt-3 w-100 ${webinar == "true" ? "px-0" : "px-sm-4"
              }`}
          >
            {[...rooms]?.sort((a, b) => a.roomName?.localeCompare(b?.roomName))?.map((item) => {
              if (meetingId.current.includes(item.roomId) || !meetingId.current) {
                return (
                  <Rooms
                    chair={item.roomNum}
                    room={item.roomName}
                    roomId={item.roomId}
                    seats={item.seats}
                    setShowMeeting={setShowMeeting}
                    showMeeting={showMeeting}
                    roomCaption={item.roomCaption}
                    file={item.file}
                    fullRoom={item}
                    webinar={webinar}
                    userData={userData}
                    getDataUserPermission={getDataUserPermission}
                    email={email}
                    userName={userName}
                    domain={domain}
                    userId={userId}
                    resetUserPermissions={resetUserPermissions}
                  />
                );
              }
            })}
          </div>
          <Modal isOpen={addRoom}>
            <ModalHeader>Add Room</ModalHeader>
            <ModalBody>
              <form onSubmit={handleAddRoom}>
                <div className="row">
                  <div className="form-group col-sm-6 mb-4">
                    <div className="label mb-2"> Room Name</div>
                    <div>
                      <input
                        required
                        type="text"
                        className="form-control roomBox"
                        placeholder="Room Name"
                        name="roomName"
                        value={val.roomName}
                        onChange={(e) =>
                          setValues({
                            ...val,
                            [e.target.name]: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="form-group col-sm-6 mb-4">
                    <div className="label mb-2"> No of Seats</div>
                    <div>
                      <select
                        required
                        className="form-control roomBox"
                        name="roomNum"
                        onChange={(e) =>
                          setValues({
                            ...val,
                            [e.target.name]: e.target.value,
                          })
                        }
                        value={val.roomNum}
                      >
                        <option value={""}>Select</option>
                        <option value={"two"}>2</option>
                        <option value={"four"}>4</option>
                        <option value={"six"}>6</option>
                        <option value={"eight"}>8</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="form-group col-sm-12 mb-4">
                    <div className="label mb-2"> Room Caption</div>
                    <div>
                      <textarea
                        required
                        type="text"
                        className="form-control roomBox"
                        placeholder="Room Caption"
                        name="roomCaption"
                        value={val.roomCaption}
                        onChange={(e) =>
                          setValues({
                            ...val,
                            [e.target.name]: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="form-group col-sm-6 mb-4">
                    <div className="label mb-2"> Branding Logo</div>
                    <div className="mb-3">
                      <input
                        type="file"
                        className="form-control overflow-hidden"
                        onChange={chooseFile}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    {loading ? (
                      <div className="mb-3">Loading...</div>
                    ) : (
                      <img src={file} className="w-100" />
                    )}
                  </div>
                </div>
                <div className="row py-2 ">
                  <div className="col-sm-12 d-flex justify-content-end">
                    <Button color="primary mr-1" type="submit">
                      Submit
                    </Button>{" "}
                    <Button color="secondary" onClick={() => setAddRoom(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </form>
            </ModalBody>
          </Modal>
        </div>
      </div>
      {console.log(usersAskingPermission, 'usersAskingPermission')}
      {usersAskingPermission.length && rooms.map((room) => {
        return (
          <>
            {room.hostEmail === email && <div className='userDataForPermission'>
              {usersAskingPermission.map((user) => {
                return (
                  <div className="d-flex">
                    {!user.permission === true && !user.callActive ? <div>{`${user.name} wants to join meeeting`}</div> : <div>{user.name}</div>}
                    {user.permission === true && user.callActive && <div className='px-2 text-danger cursor' onClick={() => handleKickOut(user, room.roomId)}>Kickout</div>}
                    {!user.permission && !user.callActive && <div className='px-2 text-success cursor' onClick={() => approveRejectPermission(user, room.roomId, 'approve')}><FaCheck /></div>}
                    {!user.permission && !user.callActive && <div className='text-danger cursor' onClick={() => approveRejectPermission(user, room.roomId, 'reject')}><FaTimes /></div>}
                  </div>
                );
              })}
            </div>}
          </>
        );
      })}
    </>
  );
};

export default MeetingRoom;
