import React, { useEffect, useState } from "react";
import { Form, Button, Col, Accordion, Card, Row } from "react-bootstrap";
import { RealTimeDb, firestoreDb } from "../config/firebaseConfig";
import { BsDisplay } from "react-icons/bs";

const SharedViewing = ({ setSharedCallActive }) => {
  const randomize = require("randomatic");
  const [showMeeting, setShowMeeting] = useState(false);
  const customerData = JSON.parse(localStorage.getItem("CUSTOMER_DATA"));
  const [sharedRoomId, setSharedRoomId] = useState();
  const [otherId, setOtherId] = useState("0");
  const [hide, setHide] = useState(true);
  const [participants, setParticipants] = useState();
  const [count, setCount] = useState(true);
  const [settings, setSettings] = useState(true);
  const [loader, setLoader] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(false);

  useEffect(() => {
    handleSettings();
  }, []);

  useEffect(() => {
    localStorage.getItem("SharedRoomId")
      ? setSharedRoomId(localStorage.getItem("SharedRoomId"))
      : createSharedRoomId();
  }, [localStorage.getItem("SharedRoomId")]);

  useEffect(() => {
    if (participants && count) {
      if (
        participants.roomId === sharedRoomId &&
        participants.name !== customerData.fname
      ) {
        handleMeet(sharedRoomId);
      }
    }
  }, [participants]);

  useEffect(() => {
    sharedRoomId && handleGetParticipant();
  }, [sharedRoomId]);

  const handleGetParticipant = async () => {
    await RealTimeDb
      .ref(`SharedViewing/${customerData.subdomain}/${sharedRoomId}`)
      .on("value", (snapshot) => {
        setParticipants(snapshot.val());
      });
  };

  const handleSettings = async () => {
    await RealTimeDb
      .ref(`settings/${customerData.subdomain}/watchWithFriends`)
      .on("value", (snapshot) => {
        setSettings(snapshot.val());
      });
  };
  const createSharedRoomId = () => {
    let roomId = randomize("A0", 6);
    localStorage.setItem("SharedRoomId", roomId);
  };

  const handleMeet = (roomId) => {
    setCount(false);
    setLoader(true);
    var element = document.getElementById("sharedView");
    var node = document.createElement("div");
    node.setAttribute("id", "sharedView_room");
    element.appendChild(node);
    var api = new window.JitsiMeetExternalAPI("video.platoo-platform.com", {
      roomName: `${roomId}`,
      parentNode: document.querySelector("#sharedView_room"),
      width: "100%",
      height: "100vh",
      userInfo: {
        displayName: `${customerData.fname}`,
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
        TOOLBAR_BUTTONS: ["microphone", "camera", "fullscreen", "hangup"],
        DEFAULT_BACKGROUND: "transparent",
        SHOW_BRAND_WATERMARK: false,
        SHOW_JITSI_WATERMARK: false,
        SHOW_CHROME_EXTENSION_BANNER: false,
        FILM_STRIP_MAX_HEIGHT: 120,
        DISABLE_VIDEO_BACKGROUND: false,
        VERTICAL_FILMSTRIP: false,
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
        api.executeCommand("subject", "Your Room");
      },
    });
    api.addEventListener(`videoConferenceJoined`, async (data) => {
      setShowMeeting(true);
      setLoader(false);
      setSharedCallActive(true);
      setCurrentRoom(roomId)
      await RealTimeDb.ref(`SharedViewing/${customerData.subdomain}/${roomId}`).set({
        jitsiId: data?.id,
        name: data?.displayName,
        roomId: roomId,
      });
      const listener = ({ enabled }) => {
        api.removeEventListener(`tileViewChanged`, listener);
        if (!enabled) {
          api.executeCommand(`toggleTileView`);
        }
      };
      api.addEventListener(`tileViewChanged`, listener);
      api.executeCommand(`toggleTileView`);
      api.addEventListener("videoConferenceLeft", async (leftData) => {
        setSharedCallActive(false);
        setCurrentRoom(sharedRoomId);
        setCount(true);
        var meetDiv = document.createElement("div");
        var meetDivWrapper = document.querySelector("#sharedView_room");
        const meet = document.querySelector("#sharedView");
        if (meetDivWrapper) {
          meetDiv.id = "sharedView_room";
          meet.removeChild(meetDivWrapper);
        }
        meet.appendChild(meetDiv);
        setShowMeeting(false);
        await RealTimeDb
          .ref(`SharedViewing/${customerData.subdomain}/${roomId}`)
          .remove();
      });
    });
  };

  if (!settings) {
    return <div></div>;
  }

  return (
    <>
      {!showMeeting && (
        <div className="sharedViewing">
          <div className="">
            <Accordion defaultActiveKey="1">
              <Card className="sharedViewAccordian">
                <Card.Header className="accordianHeader p-0">
                  <Accordion.Toggle
                    as={Button}
                    variant="link"
                    className="text-white shadow-none text-decoration-none btn-lg btn-block rounded-lg py-3 d-flex"
                    eventKey="0"
                    onClick={() => setHide(!hide)}
                  >
                    <Row>
                      <Col md="auto" className="m-0 p-0 ml-3">
                        <BsDisplay
                          fontSize="28px"
                          className="justify-content-start mr-3 text-light"
                        />
                      </Col>
                      <Col md="auto" className="m-0 p-0  bsDisplay">
                        <span className="justify-content-center font-weight-lighter text-light">
                          {" "}
                          Watch with friends
                        </span>
                      </Col>
                    </Row>
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    {!loader ? (
                      <React.Fragment>
                        <div className="border-bottom-danger">
                          <small>Your Room Code: </small>
                          <h1 className="display-4">
                            {sharedRoomId && sharedRoomId}
                          </h1>
                          <small>
                            Share your room code with friends & ask them to join
                          </small>
                        </div>
                        <hr className="mt-1" />
                        <Form
                          className="m-1"
                          onSubmit={(e) => e.preventDefault()}
                        >
                          <Form.Row controlId="formBasicEmail">
                            <Col sm>
                              <Form.Control
                                type="text"
                                placeholder="Room code"
                                onChange={(e) => setOtherId(e.target.value)}
                                required
                              />
                            </Col>
                            <Col sm>
                              <Button
                                type="submit"
                                variant="warning"
                                className="joinNowButton"
                                disabled={otherId.length !== 6}
                                onClick={() => handleMeet(otherId)}
                              >
                                Join Now
                              </Button>
                            </Col>
                          </Form.Row>
                        </Form>
                        <small className="text-muted ml-2">
                          Use headphones for best experience
                        </small>
                      </React.Fragment>
                    ) : (
                      "Joining Room, Please wait!..."
                    )}
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </div>
        </div>
      )}

      {showMeeting && (
        <span className="sharedRoomId">
          Your room code: {sharedRoomId}
          <br />
          {currentRoom && sharedRoomId && currentRoom !== sharedRoomId
            ? `Current room: ${currentRoom}`
            : ""}
        </span>
      )}
      <div className="sharedViewingCall" id="sharedView"></div>
    </>
  );
};
export default SharedViewing;
