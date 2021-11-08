import React, { useState, useEffect } from "react";
import { RealTimeDb, firestoreDb } from "../config/firebaseConfig";
import { Card, Button, Row, Col, Spinner, Form } from "react-bootstrap";
import axios from "axios";
import ProfileImage from "../assets/attendee.png";
import { networkingApi } from "../config/firebaseConfig";

const AiNetworking = ({ email, userName, domain, userId }) => {
  const [ready, setReady] = useState(false);
  const [loader, setLoading] = useState(false);
  const [meetingStart, setMeetingStart] = useState(false);
  const [lookingFor, setLookingFor] = useState("");
  const [offer, setOffer] = useState("");
  const [users, setUsers] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const [connected, setConnected] = useState(false);
  const [connectedCount, setConnectedCount] = useState(false);
  const [randomRoomsCount, setRandomRoomsCount] = useState(0);
  const [activeOnCall, setActiveOnCall] = useState(false);
  const [details, setDetails] = useState();

  useEffect(() => {
    checkIfConnected();
    handleNetworkingCount();
  }, []);

  const checkIfConnected = async () => {
    let networkingParticipants = await (
      await RealTimeDb.ref(`Networking/${domain}`).get()
    ).val();
    if (networkingParticipants) {
      setConnectedCount(
        Object.values(networkingParticipants).filter(
          (val) => val.uid !== userId
        )?.length
      );
      const iAmConnected = await Object.values(networkingParticipants);
      iAmConnected &&
        iAmConnected.forEach(async (value) => {
          if (value.uid === userId) {
            // setConnected(true);
            setLookingFor(value.Looking_for);
            setOffer(value.Offer);
            await handleConnect(value.Looking_for, value.Offer);
          }
        });
    }
  };

  const handleConnect = async (lookingFor, offer) => {
    let userProfile = JSON.parse(localStorage.getItem("USER_PROFILE"));
    if (!userProfile) {
      if (window.$) {
        window.$(".profile-text").find("h1").text("Complete Your Profile");
        window
          .$(".profile-text")
          .append(
            "<div class='profile_sub'>To use networking make sure your profile is correct and update.</div>"
          );
        window
          .$(".profile-text")
          .append(
            "<div class='profile_sub'>also make sure to upload a good piciture, as that forms the first impression</div>"
          );
        document.getElementById("profile-menu-user").click();
      } else {
        alert("Please update your profile");
      }
    } else {
      setSpinner(true);
      // let userId = firebase?.getuserId();
      let matches = [];
      if (userId) {
        await axios.get(
          `${networkingApi}/index/${userId}/${offer}?account-name=${domain}`
        );
        let response = await axios.get(
          `${networkingApi}/match/${lookingFor}?account-name=${domain}`
        );
        await RealTimeDb.ref(`Networking/${domain}/${userId}`).set({
          Looking_for: lookingFor,
          Offer: offer,
          uid: userId,
        });
        if (response?.data && response?.data?.length) {
          matches = response?.data?.filter(
            (value) => value.unique_id !== userId
          );
          await handleMatches(matches);
          setConnected(true);
        }
      }
    }
  };

  const handleChatNow = (userObj) => {
    localStorage.setItem("userSendMessage", JSON.stringify(userObj));
    document.dispatchEvent(
      new Event("startPrivateChat", { detail: { name: "manish" } })
    );
  };

  const handleMatches = async (matches) => {
    let userss = [];
    matches &&
      matches.map(async (value, key) => {
        let userObj = await RealTimeDb.ref(`users/${domain}/${value.unique_id}`).get();
        if (userObj.val()) {
          let temp = { ...userObj.val(), ...value };
          userss.push(temp);
        }
      });
    setUsers(userss);
    setSpinner(false);
  };

  const handleNetworkingCount = async () => {
    let networkingCount = 0;
    let networks = false;
    await RealTimeDb.ref(`networking/${domain}/rooms`).on("value", (snapshot) => {
      networks = snapshot.val();
      if (networks) {
        networkingCount = Object.values(networks).filter(
          (val) => val.uid !== userId
        ).length;
        networkingCount && setRandomRoomsCount(networkingCount);
      }
    });
  };

  return (
    <div className="ai-networking">
      <div className="px-2 container">
        <h1>Welcome to AI Networking</h1>
        {connected && <Button variant='dark' className='d-flex justify-content-end' onClick={()=>{setConnected(false); setConnected(false);}}>Edit</Button>}
        <div>
          <div className="m-2 w-100">
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                handleConnect(lookingFor, offer);
              }}
            >
              <Form.Group controlId="formBasicEmail">
                <Form.Label>I am looking for/to : </Form.Label>
                <Form.Control
                  size="lg"
                  type="text"
                  value={lookingFor}
                  placeholder="I am looking for/to"
                  onChange={(e) => setLookingFor(e.target.value)}
                  readOnly = {connected}
                />
              </Form.Group>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>What i can offer (about me) :</Form.Label>
                <Form.Control
                  size="lg"
                  type="text"
                  value={offer}
                  placeholder="What i can offer (about me) "
                  onChange={(e) => setOffer(e.target.value)}
                  readOnly = {connected}
                />
                <Form.Text className="text-muted">
                    Write a full sentence, at least 3 words or more to continue.
                </Form.Text>
              </Form.Group>
              
              {!connected && <Button
                variant="primary"
                type="submit"
                disabled={
                  lookingFor?.split(" ").length && offer?.split(" ").length > 2
                    ? false
                    : true
                }
                onClick={()=>handleConnect(lookingFor, offer)}
              >
                {spinner ? <Spinner animation="border" /> : "Connect"}
              </Button>}
            </Form>
          </div>
        </div>
        <div className="mt-4">
          {connected && <Button onClick={() => {setRefresh(!refresh);}}>Show matches</Button>}
          <div  className='d-flex justify-content-end'>
          {<p className='bg-dark text-light rounded-lg shadow p-1'>Users interested in networking: {connectedCount}</p>}
          </div>
          <Row>
            {users && users.length ? (
              <>
                {users?.map((user, key) => {
                  if (user) {
                    return (
                        <Col sm={12} key={key} className="mt-2">
                          <Card className="bg-secondary">
                            <Card.Body>
                              <Row>
                              <Col sm={3}>
                              <Card.Img
                                variant="top"
                                src={
                                  user?.photoURL ? user?.photoURL : ProfileImage
                                }
                                alt=""
                                style={{
                                  width: "100px",
                                  height: "100px",
                                  borderRadius: "50%",
                                }}
                              />
                              <Card.Title>{user.name}</Card.Title>
                              </Col>
                              <Col sm={9}>
                              <Card.Text>
                                Designation:{" "}
                                {user?.designation ? user.designation : "--"}
                                <br />
                                <span>
                                  Status :{" "}
                                  {user?.status ? user.status : "offline"}
                                </span>
                                <br />
                                <span>Distance: {user.dist}</span>
                                <br />
                                Offering: {user.text}
                              </Card.Text>
                              </Col>
                              </Row>
                              <Button
                                onClick={() => handleChatNow(user)}
                                variant="dark"
                              >
                                {user.status === "online"
                                  ? "Chat now"
                                  : "Leave a message"}
                              </Button>
                            </Card.Body>
                          </Card>
                        </Col>
                    );
                  }
                })}
              </>
            ) : (
              <span></span>
            )}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default AiNetworking;
