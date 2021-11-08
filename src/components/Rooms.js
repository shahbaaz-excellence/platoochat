import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import RoomOccupied from "../assets/Room_Occupied.svg";
import RoomEmpty from "../assets/roomEmpty.svg";
import Avatar from "../assets/FilledUserSeat.svg";
import EmptyUserSeat from "../assets/EmptyUserSeat.svg";
import { firestoreDb, RealTimeDb } from "../config/firebaseConfig";
import { Tooltip } from "reactstrap";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import handshakeIcon from "../assets/round-table.png";

const Rooms = ({
  chair,
  room,
  roomId,
  seats,
  setShowMeeting,
  roomCaption,
  file,
  fullRoom,
  webinar,
  getDataUserPermission,
  approveRejectClicked,
  email,
  userName,
  domain,
  userId,
  resetUserPermissions,
}) => {
  const [selectedSeat, setSelectedSeat] = useState();
  const [tooltip, toggleToolTip] = useState({});
  const [loaderVal, setLoaderVal] = useState(0);
  const [seatsCount, setSeatsCount] = useState({});
  const [jitsiApi, setjistiApi] = useState();
  const [jitsiLoading, setJitsiLoading] = useState(false);
  const [hostEmail, setHostEmail] = useState("");
  const [joinClicked, setJoinClicked] = useState(false);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [hangUpUsers, seHangUpUsers] = useState([]);

  useEffect(() => {
    // console.log(fullRoom,"iiiiiiiiiiiii")
    if(window.location.search){
      if (
        checkUserPresentInMeeting().length &&
        checkUserPresentInMeeting()[0].roomId !== roomId
      ) {
        //Do nothing//
      } else {
        if (checkForUserJoin()) {
          if (!getStatus()) {
            if (fullRoom?.hostEmail) {
              if (fullRoom?.hostEmail === email) {
                updateSeatStatus("filled");
              } else {
                PermissionToJoin();
              }
            } else {
              updateSeatStatus("filled");
            }
          } else {
            handleLeaveCall("empty");
          }
        }
      }
    }
  }, []);

  useEffect(() => {
    RealTimeDb.ref(`meetingRooms/${domain}/rooms/${roomId}/seats/`).on(
      "value",
      (snapshot) => {
        let filledSeats = [];
        let seats = [];
        snapshot.forEach((snap) => {
          if (snap.val().status === "filled") {
            filledSeats.push(snap.val());
            seats.push(snap.val());
          } else {
            seats.push(snap.val());
          }
        });
        if (seats.length) {
          setLoaderVal((100 / seats.length) * filledSeats.length);
          setSeatsCount({
            filledSeats: filledSeats.length,
            totalSeats: seats.length,
          });
        } else {
          setLoaderVal(0);
        }
      }
    );
  }, [fullRoom]);

  const getSeats = () => {
    let data = [];
    for (const ele in seats) {
      data.push(
        <>
          <img
            id={`seat-${seats[ele].seatId}`}
            src={seats[ele].status === "filled" ? RoomOccupied : RoomEmpty}
            className={`${seats[ele].attribute} chair`}
            onClick={() => handleSeats(ele, "filled")}
          />
          {seats[ele].status === "filled" && (
            <Tooltip
              placement={"top"}
              toggle={() =>
                toggleToolTip({
                  ...Tooltip,
                  [`seat-${seats[ele].seatId}`]:
                    !tooltip[`seat-${seats[ele].seatId}`],
                })
              }
              target={`seat-${seats[ele].seatId}`}
              isOpen={tooltip[`seat-${seats[ele].seatId}`]}
            >
              <div>{seats[ele].name}</div>
              <div>{seats[ele].designation}</div>
            </Tooltip>
          )}
        </>
      );
    }
    return data;
  };

  const getUsers = () => {
    let data = [];
    for (const ele in seats) {
      data.push(
        <div className="col-sm-3 col-3 px-1 mb-sm-2 mb-1">
          <div id={`user-${seats[ele].seatId}`} className="">
            <img
              src={
                seats[ele].status === "filled"
                  ? seats[ele]?.profileImage
                    ? seats[ele].profileImage
                    : Avatar
                  : EmptyUserSeat
              }
              className="w-100 profileImage"
            />
          </div>
          {seats[ele].status === "filled" && (
            <Tooltip
              placement={"top"}
              toggle={() =>
                toggleToolTip({
                  ...Tooltip,
                  [seats[ele].seatId]: !tooltip[seats[ele].seatId],
                })
              }
              target={`user-${seats[ele].seatId}`}
              isOpen={tooltip[seats[ele].seatId]}
            >
              <div>{seats[ele].name}</div>
              <div>{seats[ele].designation}</div>
            </Tooltip>
          )}
        </div>
      );
    }
    return data;
  };
  const handleSeats = (seatId, status) => {
    let rooms = [];
    RealTimeDb.ref(`meetingRooms/${domain}/rooms/${roomId}/seats`).on(
      "value",
      (snapshot) => {
        rooms = [];
        snapshot.forEach((snap) => {
          if (snap.val().status === "empty") {
            snapshot.forEach((snap) => {
              if (snap.val().userId === userId) {
                rooms.push(snap.val());
              }
            });
          }
        });
      }
    );
    if (
      rooms.length === 0 &&
      checkForUserJoin() &&
      checkUserPresentInMeeting().length == 0
    ) {
      handleMeet(seatId);
    } else {
    }
  };

  const getStatus = () => {
    let rooms = [];
    RealTimeDb.ref(`meetingRooms/${domain}/rooms/${roomId}/seats`).on(
      "value",
      (snapshot) => {
        rooms = [];
        snapshot.forEach((snap) => {
          if (snap.val().status === "filled" && snap.val().userId === userId) {
            rooms.push(snap.val());
          }
        });
      }
    );
    if (rooms.length > 0) {
      return true;
    }
  };

  const handleHostLeft = async () => {
    let seatData = await (
      await RealTimeDb.ref(`meetingRooms/${domain}/rooms/${roomId}`).get()
    ).val();
    // console.log(seatData, "seatDataseatData");
    if (seatData.hostEmail === email) {
      let seatId = Object.keys(seatData.seats);
      console.log(seatId, "seatDataseatData");
      seatId.forEach((value, i) => (
        <>
          {RealTimeDb
            .ref(`meetingRooms/${domain}/rooms/${roomId}/seats/${value}`)
            .update({
              status: "empty",
              userId: "",
              name: "",
              userEmail: "",
              participantId: "",
              profileImage: "",
              designation: "",
              permission: "",
              callActive: false,
              createdAt: "",
            })}
        </>
      ));
    }
  };

  const handleMeet = (seatId) => {
    setJitsiLoading(true);
    const userProfile = JSON.parse(localStorage.getItem("USER_PROFILE"));
    var element = document.getElementById("meetingroom");
    var node = document.createElement("div");
    node.setAttribute("id", "jitsiCallFrame");
    node.classList.add("jitsiCallFrame");
    element.appendChild(node);
      
      
    console.log("domain " , domain)
    let toolbar_buttons =  [
      "microphone",
      "camera",
      "fullscreen",
      "filmstrip",
      "chat",
      "hangup",
      "desktop",
      "filmstrip",
      "fullscreen",
      "fodeviceselection",
      "toggle-camera",
      "select-background"
    ]
    if(domain !== "demosgntr"){
        toolbar_buttons.push("tileview")
    }
    var api = new window.JitsiMeetExternalAPI("video.platoo-platform.com", {
      roomName: `${room}`,
      parentNode: document.querySelector("#jitsiCallFrame"),
      width: "100%",
      height: "100%",
      userInfo: {
        displayName: `${userName}`,
        email: `${email}`,
      },
      configOverwrite: {
        requireDisplayName: false,
        prejoinPageEnabled: false,
        enableWelcomePage: false,
        startWithVideoMuted: false,
        disableDeepLinking: true,
        // "startWithVideoMuted" : true,
        // "startAudioOnly" : true,
        // "startWithAudioMuted" : false
      },
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: toolbar_buttons,
        MOBILE_APP_PROMO: false,
        DEFAULT_BACKGROUND: domain === "demosgntr" ? "investsaudi" : "transparent1",
        SHOW_BRAND_WATERMARK: false,
        SHOW_JITSI_WATERMARK: false,
        SHOW_CHROME_EXTENSION_BANNER: false,
        // "FILM_STRIP_MAX_HEIGHT" : 250,
        // "VERTICAL_FILMSTRIP" : false,
        HIDE_INVITE_MORE_HEADER: true,
        // "TOOLBAR_TIMEOUT" : 1000,
        DISPLAY_WELCOME_FOOTER: true,
        DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
        DISABLE_FOCUS_INDICATOR: true,
        DISABLE_DOMINANT_SPEAKER_INDICATOR: false,
        CONNECTION_INDICATOR_DISABLED: true,
      },

      onload: async function () {
        setShowMeeting(false);
        setJitsiLoading(false);
        api.addEventListener(`videoConferenceJoined`, async (data) => {
          const listener = ({ enabled }) => {
            api.removeEventListener(`tileViewChanged`, listener);
            if (!enabled) {
              api.executeCommand(`toggleTileView`);
            }
          };
          api.addEventListener(`tileViewChanged`, listener);
          api.executeCommand(`toggleTileView`);
          setSelectedSeat(seatId);
          let payload = {
            status: "filled",
            userId: userId,
            userEmail: email,
            name: userName,
            participantId: data.id,
            callActive: true,
            subDomain: domain,
            createdAt: new Date(),
          };
          if (userProfile) {
            payload.profileImage = userProfile.profileimage;
            payload.designation = userProfile.designation;
          }
          RealTimeDb.ref(
            `meetingRooms/${domain}/rooms/${roomId}/seats/${seatId}`
          ).update(payload);
          RealTimeDb.ref(`meetingRooms/${domain}/usersJoinedMeet/${userId}`).update({
            userId,
            roomId,
          });
          try {
            firestoreDb
              .collection(`usersMeetingRoom`)
              .doc(`${userId}`)
              .set({
                ...payload,
              });
          } catch (e) {}
        });
        api.addEventListener(`videoConferenceLeft`, async (data) => {
          handleHostLeft();
          seatId &&
          RealTimeDb
              .ref(`meetingRooms/${domain}/rooms/${roomId}/seats/${seatId}`)
              .update({
                status: "empty",
                userId: "",
                name: "",
                userEmail: "",
                participantId: "",
                profileImage: "",
                designation: "",
                permission: "",
                callActive: false,
                createdAt: "",
              });
              RealTimeDb.ref(`meetingRooms/${domain}/usersJoinedMeet/${userId}`).remove();

          setShowMeeting(true);
          // var element = document.getElementById("meetingroom");
          // element.classList.remove("jitsiCallFrame");
          element.removeChild(node);
          api.dispose();
          resetUserPermissions();
        });
      },
    });
    setjistiApi(api);
  };

  const updateSeatStatus = (status) => {
    let rooms = [];
    RealTimeDb.ref(`meetingRooms/${domain}/rooms/${roomId}/seats`).on(
      "value",
      (snapshot) => {
        rooms = [];
        snapshot.forEach((snap) => {
          if (snap.val().status === "empty" && !snap.val().userId) {
            rooms.push(snap.val());
          }
        });
      }
    );
    if (rooms.length) {
      handleMeet(rooms[0].seatId);
    }
  };

  useEffect(() => {
    let hostEmail = "";
    RealTimeDb.ref(`meetingRooms/${domain}/rooms/${roomId}/hostEmail`).on(
      "value",
      (snapshot) => {
        hostEmail = snapshot.val();
      }
    );
    setHostEmail(hostEmail);
  }, [roomId]);

  const checkForUserJoin = () => {
    let hostEmail = "";
    RealTimeDb.ref(`meetingRooms/${domain}/rooms/${roomId}/hostEmail`).on(
      "value",
      (snapshot) => {
        hostEmail = snapshot.val();
      }
    );

    let join = false;
    if (hostEmail) {
      if (hostEmail === email) {
        join = true;
      } else {
        RealTimeDb.ref(`meetingRooms/${domain}/rooms/${roomId}/seats`).on(
          "value",
          (snapshot) => {
            snapshot.forEach((snap) => {
              if (hostEmail === snap.val().userEmail) {
                join = true;
              }
            });
          }
        );
      }
    } else {
      join = true;
    }
    return join;
  };
  useEffect(() => {
    selectedSeat &&
    RealTimeDb
        .ref(`meetingRooms/${domain}/rooms/${roomId}/seats/${selectedSeat}`)
        .onDisconnect()
        .update({
          status: "empty",
          userId: "",
          name: "",
          userEmail: "",
          participantId: "",
          profileImage: "",
          designation: "",
          permission: "",
          callActive: false,
          createdAt: "",
        });
        RealTimeDb.ref(`meetingRooms/${domain}/usersJoinedMeet/${userId}`)
      .onDisconnect()
      .remove();
  }, [selectedSeat]);
  const handleLeaveCall = () => {
    var element = document.getElementById("meetingroom");
    var node = document.getElementById("jitsiCallFrame");
    let filledSeat = [];
    RealTimeDb.ref(`meetingRooms/${domain}/rooms/${roomId}/seats`).on(
      "value",
      (snapshot) => {
        filledSeat = [];
        snapshot.forEach((snap) => {
          if (snap.val().status === "filled") {
            filledSeat.push(snap.val());
          }
        });
      }
    );
    RealTimeDb.ref(
      `meetingRooms/${domain}/rooms/${roomId}/seats/${filledSeat[0].seatId}`
    ).update({
      status: "empty",
      userId: "",
      name: "",
      userEmail: "",
      participantId: "",
      profileImage: "",
      designation: "",
    });
    RealTimeDb.ref(`meetingRooms/${domain}/usersJoinedMeet/${userId}`).remove();
    element.removeChild(node);
  };

  const checkUserPresentInMeeting = () => {
    let users = [];
    RealTimeDb.ref(`meetingRooms/${domain}/usersJoinedMeet`).on("value", (snapshot) => {
      snapshot.forEach((snap) => {
        if (snap.val().userId === userId) {
          users.push(snap.val());
        }
      });
    });
    return users;
  };

  const PermissionToJoin = () => {
    const userProfile = JSON.parse(localStorage.getItem("USER_PROFILE"));
    let rooms = [];
    RealTimeDb.ref(`meetingRooms/${domain}/rooms/${roomId}/seats`).on(
      "value",
      (snapshot) => {
        rooms = [];
        snapshot.forEach((snap) => {
          if (snap.val().status === "empty" && !snap.val().userId) {
            rooms.push(snap.val());
          }
        });
      }
    );
    if (rooms.length) {
      let payload = {
        userId: userId,
        userEmail: email,
        name: userName,
        permission: false,
      };
      if (userProfile) {
        const userProfile = JSON.parse(localStorage.getItem("USER_PROFILE"));
        payload.profileImage = userProfile.profileimage;
        payload.designation = userProfile.designation;
      }
      RealTimeDb.ref(
        `meetingRooms/${domain}/rooms/${roomId}/seats/${rooms[0].seatId}`
      ).update(payload);
      setJoinClicked(true);
    }
  };

  useEffect(() => {
    if (joinClicked === true) {
      setTimeout(() => {
        setJoinClicked(false);
      }, 30000);
    }
  }, [joinClicked]);

  useEffect(() => {
    RealTimeDb.ref(`meetingRooms/${domain}/rooms/${roomId}/seats`).on(
      "value",
      (snapshot) => {
        let approvedUsers = [];
        snapshot.forEach((snap) => {
          if (
            snap.val().userId &&
            snap.val().userId === userId &&
            snap.val().permission === true &&
            !snap.val().callActive
          ) {
            approvedUsers.push(snap.val());
          }
        });
        setApprovedUsers(approvedUsers);
      }
    );
  }, [roomId]);
  useEffect(() => {
    if (approvedUsers.length) {
      approvedUsers.map((appUser) => {
        if (appUser.userId === userId && !appUser.callActive) {
          handleMeet(appUser.seatId);
        }
      });
    }
  }, [approvedUsers.length]);

  useEffect(() => {
    RealTimeDb.ref(`meetingRooms/${domain}/rooms/${roomId}/seats`).on(
      "value",
      (snapshot) => {
        let usersAskingPermission = [];
        snapshot.forEach((snap) => {
          if (
            snap.val().userId &&
            (snap.val().permission === false || snap.val().permission === true)
          ) {
            usersAskingPermission.push(snap.val());
          }
        });
        getDataUserPermission(usersAskingPermission);
      }
    );
  }, [roomId]);

  useEffect(() => {
    RealTimeDb.ref(`meetingRooms/${domain}/rooms/${roomId}/seats`).on(
      "value",
      (snapshot) => {
        let hangUpUsers = [];
        snapshot.forEach((snap) => {
          if (
            snap.val().userId &&
            snap.val().permission === false &&
            snap.val().callActive === true
          ) {
            hangUpUsers.push(snap.val());
          }
        });
        seHangUpUsers(hangUpUsers);
      }
    );
  }, [roomId]);

  useEffect(() => {
    if (hangUpUsers.length) {
      hangUpUsers.map((user) => {
        if (user.userId === userId) {
          jitsiApi.executeCommand("hangup");
        }
      });
    }
  }, [hangUpUsers.length]);

  return (
    <div
      className={`col-sm-6 ${
        webinar === "true" ? "col-md-4" : "col-md-3"
      } col-12 px-1 mb-2`}
    >
      <div className="rooms h-100 ">
        <div>
          <div className="roomsheader">
            <div className="col-sm-10 col-10 px-0">
              <p className="roomname m-0">
                {window.screen.availWidth > 575 ? room : roomCaption}
              </p>
            </div>
            <div className="col-sm-2 px-0 col-1 spinnerWrapper d-flex">
              <div className="dot"></div>
              <CircularProgressbar value={loaderVal} />
            </div>
          </div>
          {window.screen.availWidth > 575 && (
            <div className="roomcaption mb-3">{roomCaption}</div>
          )}
          <div className="row no-gutters p-2 py-sm-0 align-items-center justify-content-between">
            {getSeats().length <= 8 && (
              <div className="d-flex justify-content-center roomoccupied col-sm-12 col-5">
                {chair == "two" && (
                  <>
                    <div className="roomLogo">
                      <img
                        src={file ? file : handshakeIcon}
                        className={`${file ? "roomLogoCircle" : "roomLogo"}`}
                      />
                    </div>
                    {getSeats().map((item) => item)}
                  </>
                )}

                {chair == "four" && (
                  <>
                    <div className="roomLogo">
                      <img
                        src={file ? file : handshakeIcon}
                        className={`${file ? "roomLogoCircle" : "roomLogo"}`}
                      />
                    </div>
                    {getSeats().map((item) => item)}
                  </>
                )}

                {chair == "six" && (
                  <>
                    <div className="roomLogo">
                      <img
                        src={file ? file : handshakeIcon}
                        className={`${file ? "roomLogoCircle" : "roomLogo"}`}
                      />
                    </div>
                    {getSeats().map((item) => item)}
                  </>
                )}
                {chair == "eight" && (
                  <>
                    <div className="roomLogo">
                      <img
                        src={file ? file : handshakeIcon}
                        className={`${file ? "roomLogoCircle" : "roomLogo"}`}
                      />
                    </div>
                    {getSeats().map((item) => item)}
                  </>
                )}
              </div>
            )}
            {getSeats().length > 8 && (
              <div className="d-flex justify-content-center  col-sm-12 col-5">
                <p className="seatCount mb-3">
                  Seats : {seatsCount.filledSeats}/{getSeats().length}
                </p>
              </div>
            )}
            <div className="col-sm-12 col-6 py-3 px-sm-3 px-1 mt-sm-4">
              {/* <p className="text-center timer mt-sm-5">
              Time Left 00:00:00 hours
            </p> */}
              <div className="row no-gutters ">
                {getUsers().map((item) => {
                  return item;
                })}
              </div>
              {window.screen.availWidth <= 576 ? (
                checkUserPresentInMeeting().length &&
                checkUserPresentInMeeting()[0].roomId !== roomId ? (
                  <div className="text-white px-4 pb-3">
                    Leave Meeting from other Room to join here
                  </div>
                ) : checkForUserJoin() ? (
                  <div className="d-flex justify-content-center mt-2">
                    <button
                      className="roombtn btn w-100 py-1"
                      onClick={() =>
                        !getStatus()
                          ? updateSeatStatus("filled")
                          : handleLeaveCall("empty")
                      }
                    >
                      {getStatus() ? "Leave" : "Join"}
                    </button>
                  </div>
                ) : (
                  <div className="text-white pb-3 px-4">
                    Host is not there in meeting room
                  </div>
                )
              ) : null}
            </div>
          </div>
        </div>
        {window.screen.availWidth > 576 ? (
          checkUserPresentInMeeting().length &&
          checkUserPresentInMeeting()[0].roomId !== roomId ? (
            <div className="text-white px-4 pb-3">
              Leave Meeting from other Room to join here
            </div>
          ) : checkForUserJoin() ? (
            <div className="d-flex justify-content-center pb-3 px-5">
              <button
                disabled={joinClicked}
                className="roombtn btn w-100"
                onClick={() =>
                  !getStatus()
                    ? hostEmail
                      ? hostEmail === email
                        ? updateSeatStatus("filled")
                        : PermissionToJoin()
                      : updateSeatStatus("filled")
                    : handleLeaveCall("empty")
                }
              >
                {getStatus() ? "Leave" : jitsiLoading ? "Loading..." : "Join"}
              </button>
            </div>
          ) : (
            <div className="text-white pb-3 px-4">
              Host is not there in meeting room
            </div>
          )
        ) : null}
      </div>
    </div>
  );
};

export default Rooms;
