import React, { useState, useEffect } from "react";
import { RealTimeDb } from "../config/firebaseConfig";
import { subdomain } from "../constants/constants";
import Chats from "./chats";
import MeetingRoom from "./MeetingRoom";
import Networking from "./Networking";
import ConferenceRoom from "./ConferenceRoom";
import SharedViewing from "./SharedViewing";
import AiNetworking from "./AiNetworking";
import { Portal } from "react-portal";
import { auth } from "../config/firebaseConfig";
import Rooms from "./Rooms";

const Settings = () => {

  const [readSettings, setReadSettings] = useState(false);

  const userData = auth.currentUser;

  useEffect(() => {
    getSettings();
    if (localStorage.getItem('is_webinar') === 'true') {
      let meetingRoom = document.getElementById('meetingroom');
      let networking = document.getElementById('networking_zone');
      let conference = document.getElementById('conference');
      meetingRoom?.classList.add('webinarView');
      networking?.classList.add('webinarView');
      conference?.classList.add('webinarView')
    }
  }, [])

  const getSettings = async () => {
    //Code for domain settings from admin panel
    try {
      RealTimeDb.ref(`settings/${subdomain}/AudiSettings`).on("value", (snapshot) => {
        let domainSettings = [];
        domainSettings = snapshot.val();
        localStorage.setItem("AudiSettings", JSON.stringify(domainSettings));
        // setSettings(domainSettings);
      });
      RealTimeDb.ref(`settings/${subdomain}/ExhibitionSettings`).on("value", (snapshot) => {
        let domainSettings = [];
        domainSettings = snapshot.val();
        localStorage.setItem("ExhibitionSettings", JSON.stringify(domainSettings));
        // setSettings(domainSettings);
      });
      RealTimeDb.ref(`settings/${subdomain}/LobbySettings`).on("value", (snapshot) => {
        let domainSettings = [];
        domainSettings = snapshot.val();
        localStorage.setItem("LobbySettings", JSON.stringify(domainSettings));
        // setSettings(domainSettings);
      });
      RealTimeDb.ref(`settings/${subdomain}`).on("value", (snapshot) => {
        let domainSettings = [];
        domainSettings = snapshot.val();
        localStorage.setItem("GlobalSettings", JSON.stringify(domainSettings));
        // setSettings(domainSettings);
        setReadSettings(true);
      });
    } catch (error) {
      console.error(error.message)
      setReadSettings(false);
    }
  }

  const chatHelper = () => {
    let chat = false;
    if (window.location.pathname !== "/meeting.php" && window.location.pathname !== "/meeting" && readSettings === true) {
      chat = true;
    }
    return chat;
  }

  const networkingHelper = () => {
    let networking = false;
    if (document.getElementById("networking_zone") && readSettings && userData?.email && userData?.uid && userData?.displayName) {
      networking = true;
    }
    return networking;
  }

  const meetingRoomHelper = () => {
    let meeting = false;
    if (localStorage.getItem("meeting_room") &&
      document.getElementById("meetingroom") && readSettings) {
      meeting = true
    }
    return meeting;
  }

  const conferenceRoomHelper = () => {
    let conferenceRoom = false;
    if (document.getElementById("conference_room") && readSettings && userData?.email && userData?.uid && userData?.displayName) {
      conferenceRoom = true
    }
    return conferenceRoom;
  }

  const sharedViewingHelper = () => {
    let sharedViewing = false;
    if (window.location.pathname === "/auditorium" && readSettings) {
      sharedViewing = true
    }
    return sharedViewing;
  }

  const aiNetworkingHelper = () => {
    let aiNetworking = false;
    if (document.getElementById("ai_networking_zone") && readSettings && userData?.email && userData?.uid && userData?.displayName) {
      aiNetworking = true
    }
    return aiNetworking;
  }



  return (
    <>
      {chatHelper() && <Chats />}
      {meetingRoomHelper() &&
        <Portal node={document && document.getElementById("meetingroom")}>
          <MeetingRoom email={userData?.email} userName={userData?.displayName} domain={subdomain} userId={userData?.uid}>
            <Rooms
              email={userData?.email}
              userName={userData?.displayName}
              domain={subdomain}
              userId={userData?.uid}
            />
          </MeetingRoom>
        </Portal>}
      {networkingHelper() &&
        <Portal node={document && document.getElementById("networking_zone")}>
          <Networking
            email={userData.email}
            userName={userData.displayName}
            userId={userData.uid}
          />
        </Portal>}
      {conferenceRoomHelper() &&
        <ConferenceRoom
          email={userData?.email}
          userName={userData?.displayName}
          domain={subdomain}
          userId={userData?.uid}
        />}
      {sharedViewingHelper() &&
        <SharedViewing
          setSharedCallActive={false}
        />}
      {aiNetworkingHelper() &&
        <Portal node={document && document.getElementById("ai_networking_zone")}>
          <AiNetworking
            email={userData?.email}
            userName={userData?.displayName}
            domain={subdomain}
            userId={userData?.uid}
          />
        </Portal>}
    </>
  );
}

export default Settings;