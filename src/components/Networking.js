import React, { useState } from "react";
import { RealTimeDb, firestoreDb } from "../config/firebaseConfig";
import { v4 as uuidv4 } from "uuid";
import { Button } from 'react-bootstrap';
import { subdomain } from "../constants/constants";

const Networking = ({ email, userName, userId}) => {
  const password = "1234567";
  const [ready, setReady] = useState(false);
  const [loader, setLoading] = useState(false);
  const [meetingStart, setMeetingStart] = useState(false);
  // const [lookingFor, setLookingFor] = useState("");
  // const [offer, setOffer] = useState("");
  // const [users, setUsers] = useState([]);
  // const [spinner, setSpinner] = useState(false);
  // const [connected, setConnected] = useState(false);
  // const [connectedCount, setConnectedCount] = useState(false);
  const [randomRoomsCount, setRandomRoomsCount] = useState(0);
  const [activeOnCall, setActiveOnCall] = useState(false)
  const [details, setDetails] = useState();


  const handleTransaction = () => {
    setReady(true);
    let count = 0;
    var sfDocRef = firestoreDb.collection("networking_rooms").doc(subdomain);
    firestoreDb.runTransaction(function (transaction) {
      return transaction.get(sfDocRef).then(function (sfDoc) {
        if (!sfDoc.exists) {
          let roomid = uuidv4();
          transaction.set(sfDocRef, {
            count: 0,
            roomid: roomid,
          });
          return { count: count ? count : 0, roomid: roomid };
        }
        var data = sfDoc.data();
        var roomid = data.roomid;
        var count = data.count;
        if (count % 2 == 0) {
          roomid = uuidv4();
          transaction.update(sfDocRef, { count: count+1, roomid: roomid });
        } else {
          // count = count + 1;
          transaction.update(sfDocRef, { count: count+1 });
        }
        return { count: count, roomid: roomid };
      });
    })
      .then(function (roomid) {
        setDetails(roomid);
        if(roomid.count % 2 === 0){
          handleFirstUser(roomid);
        } else {
          handleSecondUser(roomid);
        }
        handleGetDetailsFromDb(roomid);
      })
      .catch(function (err) {
        console.error(err);
      });
  }

  const handleFirstUser = async(data) => {
    await RealTimeDb.ref(`networking_rooms/${subdomain}/${data.roomid}/firstUser`).set({
      count: data.count,
      roomId: data.roomid,
      name: userName,
      uid: userId,
    })
  }
  
  const handleSecondUser = async(data) => {
    await RealTimeDb.ref(`networking_rooms/${subdomain}/${data.roomid}/secondUser`).set({
      count: data.count,
      roomId: data.roomid,
      name: userName,
      uid: userId,
    })
  }

  const handleGetDetailsFromDb = async(data) => {
    await RealTimeDb.ref(`networking_rooms/${subdomain}/${data.roomid}`).on('value',snapshot => {
      let snap = (snapshot.val())
      let snap1 = snap?.firstUser
      let snap2 = snap?.secondUser
      if(snap1 && snap2 && snap2.roomid === data.roomId){
        if(!snap?.userLeft){
          handlCall(data.roomid,'existingUserInDb');
        }
        else if(snap?.userLeft && ready){
          handleTransaction();
        }
      }
    })
    await RealTimeDb.ref(`networking_rooms/${subdomain}/${data.roomid}`).onDisconnect().update({
      userLeft: true,
    })
  }

  const addRoom = async () => {
    setReady(true);
    handleTransaction();
  };
  

  const handlCall = (roomId, userType) => {
    setActiveOnCall(true);
    var element = document.querySelector("#networking_zone");
    var node = document.createElement("div");
    node.setAttribute("id", "networkingFrame");
    element.appendChild(node);
    var api = new window.JitsiMeetExternalAPI("video.platoo-platform.com", {
      roomName: `${roomId}`,
      parentNode: document.querySelector("#networkingFrame"),
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
      },
      interfaceConfigOverwrite: {
        MOBILE_APP_PROMO: false,
        DEFAULT_BACKGROUND: "transparent",
        TOOLBAR_BUTTONS: [
          "microphone",
          "camera",
          "fullscreen",
          "filmstrip",
          "chat",
          "hangup",
          "tileview",
        ],
        SHOW_BRAND_WATERMARK: false,
        SHOW_JITSI_WATERMARK: false,
        SHOW_CHROME_EXTENSION_BANNER: false,
        HIDE_INVITE_MORE_HEADER: true,
        DISPLAY_WELCOME_FOOTER: true,
        DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
        DISABLE_FOCUS_INDICATOR: true,
        DISABLE_DOMINANT_SPEAKER_INDICATOR: false,
        CONNECTION_INDICATOR_DISABLED: true,
      },
      onload: async function () {
        api.addEventListener(`videoConferenceJoined`, async (data) => {
          setReady(false);
          const listener = ({ enabled }) => {
            api.removeEventListener(`tileViewChanged`, listener);
            if (!enabled) {
              api.executeCommand(`toggleTileView`);
            }
          };
          api.addEventListener(`tileViewChanged`, listener);
          api.executeCommand(`toggleTileView`);
          if (userType === "newUserInDb") {
           RealTimeDb.ref(
              `networking/${
                subdomain
              }/rooms/${roomId}/participant/${roomId + 2}`
            ).update({
              userId: roomId + 2,
              participantId: data.id,
            });
           RealTimeDb.ref(
              `networking/${subdomain}/rooms/${roomId}`
            ).update({
              participantCount: 2,
            });
            firestoreDb
              .collection(`usersNetworking`)
              .doc(`${roomId + 2}`)
              .set({
                userId: roomId + 2,
                roomId: roomId,
                participantId: data.id,
                name: userName,
                createdAt: new Date(),
              });
          } else if (userType === "existingUserInDb") {
           RealTimeDb.ref(
              `networking/${
                subdomain
              }/rooms/${roomId}/participant/${roomId + 1}`
            ).update({
              participantId: data.id,
            });
            firestoreDb
              .collection(`usersNetworking`)
              .doc(`${roomId + 1}`)
              .set({
                userId: roomId + 1,
                participantId: data.id,
                name: userName,
                subDomain: subdomain,
                createdAt: new Date(),
              });
          }
        });
        api.addEventListener(`videoConferenceLeft`, async (data) => {
          setActiveOnCall(false);
          firestoreDb
            .collection(`usersNetworking`)
            .doc(`${roomId + 1}`)
            .update({
              leftAt: new Date(),
            });
         RealTimeDb.ref(
            `networking/${subdomain}/rooms/${roomId}`
          ).remove();
          setReady(false);
          setMeetingStart(false);
          element.removeChild(node);
          api.dispose();
        });
      },
    });
  };

  const removeWaitinguser = () => {
    setReady(false);
  };

  // const handleNetworkingCount = async() => {
  //   let networkingCount = 0;
  //   let networks = false;
  //   await RealTimeDb.ref(`networking/${subdomain}/rooms`).on("value", (snapshot) => {
  //     networks = snapshot.val();
  //     if (networks) {
  //       networkingCount = Object.values(networks).filter(val=>val.uid !== userId).length;
  //       networkingCount && setRandomRoomsCount(networkingCount);
  //     }
  //   })
  // }

  // const checkIfConnected = async () => {
  //   let networkingParticipants = await (
  //     await RealTimeDb.ref(`Networking/${subdomain}`).get()
  //   ).val();
  //   if (networkingParticipants) {
  //     setConnectedCount(Object.values(networkingParticipants).filter(val=>val.uid!==userId)?.length);
  //     const iAmConnected = await Object.values(networkingParticipants);
  //     iAmConnected &&
  //       iAmConnected.forEach(async (value) => {
  //         if (value.uid === userId) {
  //           // setConnected(true);
  //           setLookingFor(value.Looking_for);
  //           setOffer(value.Offer);
  //           await handleConnect(value.Looking_for, value.Offer);
  //         }
  //       });
  //   }
  // };

  // const handleMatches = async (matches) => {
  //   let userss = [];
  //   matches &&
  //     matches.map(async (value, key) => {
  //       let userObj = await RealTimeDb
  //         .ref(`users/${subdomain}/${value.unique_id}`)
  //         .get();
  //       if (userObj.val()) {
  //         let temp = {...userObj.val(), ...value}
  //         userss.push(temp);

  //       }
  //     });
  //     setUsers(userss);
  //     setSpinner(false);
  // };

  // const handleConnect = async (lookingFor, offer) => {
  //   let userProfile = JSON.parse(localStorage.getItem("USER_PROFILE"));
  //   if (!userProfile) {
  //     if (window.$) {
  //       window.$(".profile-text").find("h1").text("Complete Your Profile");
  //       window
  //         .$(".profile-text")
  //         .append(
  //           "<div class='profile_sub'>To use networking make sure your profile is correct and update.</div>"
  //         );  
  //       window
  //         .$(".profile-text")
  //         .append(
  //           "<div class='profile_sub'>also make sure to upload a good piciture, as that forms the first impression</div>"
  //         );
  //       document.getElementById("profile-menu-user").click();
  //     } else {
  //       alert("Please update your profile");
  //     }
  //   } else {
  //     setSpinner(true);
  //     let userId = firebase?.getuserId();
  //     let matches = [];
  //     if (
  //       userId
  //     ) {
  //       await axios.get(
  //         `${networkingApi}/index/${userId}/${offer}?account-name=${subdomain}`
  //       );
  //       let response = await axios.get(
  //         `${networkingApi}/match/${lookingFor}?account-name=${subdomain}`
  //       );
  //       await RealTimeDb.ref(`Networking/${subdomain}/${userId}`).set({
  //         Looking_for: lookingFor,
  //         Offer: offer,
  //         uid: userId,
  //       });
  //       if (response?.data && response?.data?.length) {
  //         matches = response?.data?.filter(
  //           (value) => value.unique_id !== userId
  //         );
  //         await handleMatches(matches);
  //         setConnected(true);
  //       }
  //     }
  //   }
  // };

  // const handleChatNow = (userObj) => {
  //   localStorage.setItem("userSendMessage",JSON.stringify(userObj))
  //   document.dispatchEvent(new Event('startPrivateChat' , {  detail : {   "name" : "manish" }  }));
  // }

  if(!userId){
    return <span className='d-flex justify-content-center text-light m-4 p-4'>Loading... Please wait!!</span>
  }

  return (
    <div className="networking p-3 d-flex align-items-center justify-content-center text-center pt-4">
      <Button variant="dark" style={{position:'fixed', top:'0', left:'0', margin:'1%'}}>
        <a className="text-decoration-none" href="/index">
          Back to Lobby
        </a>
      </Button>
      <div className="m-2 w-100">
        <h3 className="text-white mb-0">Are you ready?</h3>
        {!loader && !ready && (
          <>
            <div className="text-white py-3">
              Click the button below to meet someone anonymous.
            </div>
            <button className="btn-primary btn w-75" onClick={addRoom}>
              Ready
            </button>
          </>
        )}
        {!loader && ready && !meetingStart && (
          <>
            <div className="text-white py-3">
              Wait for another user to join Call...
            </div>
            <button
              className="btn-danger btn w-75"
              onClick={removeWaitinguser}
              disabled={meetingStart}
            >
              Cancel
            </button>
          </>
        )}

        <div>
          {randomRoomsCount ? (
            <span className="text-light">
              Users currently active: {randomRoomsCount}
            </span>
          ) : (
            <span></span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Networking;
