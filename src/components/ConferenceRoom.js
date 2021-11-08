import React, { useEffect, useState } from "react";
import { RealTimeDb, firestoreDb } from "../config/firebaseConfig";
import { Button, Spinner } from 'react-bootstrap';

const ConferenceRoom = ({ email, userName, domain, userId}) => {
  const [members, setMembers] = useState([]);
  const [membersId, setMembersId] = useState([]);
  const [apiState, setApiState] = useState();
  const [me, setMe] = useState();
  const [userLeftId, setUserLeftId] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    handleMeet();
    getParticipants();
  }, []);

  useEffect(() => {
    if (members) {
      members.forEach((value, key) => {
        if (value?.pinned && value?.pinned === true && apiState) {
          apiState.pinParticipant(value.id);
          apiState.setLargeVideoParticipant(value.id);
          apiState.resizeLargeVideo('100%', '100vh');
        }
        if (value.kicked === true && value.id === me){
          apiState.executeCommand('hangup');
        }
      });
    }
    // getParticipants()
  }, [members]);

  const getParticipants = async () => {
    let activeMembers = [];
    await RealTimeDb
      .ref(`ConferenceRoom/${domain}/Participants`)
      .on("value", (snapshot) => {
        activeMembers = snapshot.val();
        if (activeMembers) {
          console.log(activeMembers, "active members");
          setMembers(Object.values(activeMembers));
          setMembersId(Object.keys(activeMembers));
        }
      });
  };

  const handleMe = async (val) => {
    if(val) await setMe(val)
   ;
  };
  const handleLeaveCall = async (val) => {
    members.forEach((value, key) => {
      if (value.id === val) {
        RealTimeDb.ref(
          `ConferenceRoom/${domain}/Participants/${membersId[key]}`
        ).remove();
      }
    });
  };

  useEffect(()=>{
    userLeftId && handleLeaveCall(userLeftId)
  }, [userLeftId])

  const handleMeet = () => {
    console.log("call init");
    console.log(`${domain}-conference-room`,'conference-room')
    var api = new window.JitsiMeetExternalAPI("video.platoo-platform.com", {
      roomName: `${
        window.location.href.indexOf("dev2") !== -1 ||
        window.location.href.indexOf("ve.aforpineapple") !== -1
          ? "aforpineapple"
          : domain + "-conference-room"
      }`,
      parentNode: document.querySelector("#conference_room"),
      width: "100%",
      height: "100vh",
      userInfo: {
        displayName: `${userName}`,
      },
      configOverwrite: {
        requireDisplayName: false,
        prejoinPageEnabled: false,
        enableWelcomePage: false,
        startWithVideoMuted: false,
        startAudioOnly: false,
        startVideoOnly: true,
        startWithAudioMuted: false,
        disableDeepLinking: true,
        enableClosePage: false,
      },
      interfaceConfigOverwrite: {
        MOBILE_APP_PROMO: false,
        TOOLBAR_BUTTONS: [
          "microphone",
          "camera",
          "desktop",
          "fullscreen",
          "hangup",
          "raisehand",
          "filmstrip",
          "tileview",
        ],
        SHOW_BRAND_WATERMARK: false,
        SHOW_JITSI_WATERMARK: false,
        SHOW_CHROME_EXTENSION_BANNER: false,
        FILM_STRIP_MAX_HEIGHT: 250,
        VERTICAL_FILMSTRIP: true,
        VIDEO_LAYOUT_FIT: "100vh",
        HIDE_INVITE_MORE_HEADER: true,
        DISPLAY_WELCOME_FOOTER: false,
        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
        DISABLE_FOCUS_INDICATOR: true,
        DISABLE_DOMINANT_SPEAKER_INDICATOR: false,
        CONNECTION_INDICATOR_DISABLED: true,
        disableDeepLinking: true,
        enableClosePage: false,
        SHOW_PROMOTIONAL_CLOSE_PAGE: true,
      },

      onload: async function () {
        setApiState(api);
        getAllParticipantsInfo();
        api.resizeLargeVideo("100%", "100vh");
        // api.addEventListener("participantLeft ", (data) => {
        // })
      },
    });

    
    function getAllParticipantsInfo() {
    }
    api.addEventListener(`videoConferenceJoined`, async (data) => {
      await RealTimeDb.ref(`ConferenceRoom/${domain}/Participants/${data.id}`).set(
        data
      );
      getParticipants()
      setLoading(false);
      data?.id?.length>0 && handleMe(data?.id);
      api.addEventListener("videoConferenceLeft", (leftData) => {
        setUserLeftId(data?.id);
        var meetDiv = document.createElement("div");
        var meetDivWrapper = document.querySelector("#conference_room");
        const meet = document.querySelector("#conference");
        if (meetDivWrapper) {
          meetDiv.id = "conference_room";
          meet.removeChild(meetDivWrapper);
        }
        meet.appendChild(meetDiv);
      });
    });
    api.addEventListener("participantJoined", (data) => {

    });
    const participants = api.getParticipantsInfo();

    

    // api.on("readyToClose", (data) => {
    //   handleLeaveCall();
    //   var meetDiv = document.createElement("div");
    //   var meetDivWrapper = document.querySelector("#conference_room");
    //   const meet = document.querySelector("#conference");
    //   if (meetDivWrapper) {
    //     meetDiv.id = "conference_room";
    //     meet.removeChild(meetDivWrapper);
    //   }
    //   meet.appendChild(meetDiv);

    // });
    // api.pinParticipant(user_profile.id);
    setApiState(api);
  };
  return (
    <div>
      {userLeftId && <Button variant="dark" style={{position:'fixed', top:'0', left:'0', margin: '1%'}} className="btn-lg rounded-lg shadow-lg">
        <a href="/index">Back to lobby</a>
      </Button>}
    {loading && <h4 style={{position:'fixed', top:'0', left:'0'}}>Please wait while your call is being connected....</h4>}
    </div>
  );
};
export default ConferenceRoom;