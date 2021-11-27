import React, { useState, useEffect } from "react";
import { Tabs, Tab } from 'react-bootstrap';
import Attendees from "./attendees";
import MyChats from "./myChats";
import Poll from "./poll";
import QNA from "./qna";
import Feedback from "./feedback";
import attendeeTab from "../assets/attendeeTab.svg";
import attendeeLightTab from "../assets/attendeeLightTab.svg";
import chatTab from "../assets/chatTab.svg";
import chatLightTab from "../assets/chatLightTab.png";
import pollTab from "../assets/pollTab.svg";
import pollLightTab from "../assets/pollLightTab.svg";
import qnaTab from "../assets/qnaTab.svg";
import qnaLightTab from "../assets/qnaLightTab.svg";
import feedbackTab from "../assets/feedbackTab.svg";
import exhibitorTab from "../assets/exhibitorTab.svg";
import exhibitorLightTab from "../assets/exhibitorLightTab.svg";
import feedbackLightTab from "../assets/feedbackLightTab.svg";
import currentVisitorLightTab from "../assets/currentVisitorLightTab.svg";
import currentVisitorDarkTab from "../assets/currentVisitorDarkTab.svg";
import { ImCross, ImFontSize } from 'react-icons/im';
import Notification from "./Notification";
import "../App.css";
import Exhibitor from "./exhibitor";
import CurrentVisitor from "./currentVisitor";

const Chats = () => {

  const [key, setKey] = useState("attendees");
  const [chatWindow, setChatWindow] = useState(false);
  const [messageScreen, setMessageScreen] = useState(false);
  const [notification, setNotification] = useState({
    show:false,
    heading:"",
    content:"",
  })

  useEffect(() => {
    setMessageScreen(false);
  }, [key])

  return (
    <>
      {chatWindow == true &&
        <button onClick={() => { setChatWindow(false); setMessageScreen(false) }}
          style={{ position: "absolute", borderRadius: 8, paddingBottom: 3, right: "78px", bottom: "75vh", border: "none", background: "red", cursor: "pointer" }}>
          <ImCross color="white" />
        </button>}
      <div className={chatWindow === true ? "chatWindowOpen" : "chatWindowClosed"}>
        <Notification show={notification.show} heading={notification.heading} content={notification.content} setNotification={setNotification} notification={notification} />
        <Tabs
          id="controlled-tab-example"
          activeKey={key}
          onSelect={(k) => { setKey(k); setChatWindow(true) }}
          className={"navigationTab"}
        >
          <Tab eventKey="attendees" title={<><img src={key == "attendees" ? attendeeLightTab : attendeeTab} alt="attendees" /></>}>
            <Attendees setMessageScreen={setMessageScreen} messageScreen={messageScreen} chatWindow={chatWindow} />
          </Tab>
          <Tab eventKey="myChats" title={<><img src={key == "myChats" ? chatLightTab : chatTab} alt="chats" /></>}>
            <MyChats setMessageScreen={setMessageScreen} messageScreen={messageScreen} chatWindow={chatWindow}  />
          </Tab>
          <Tab eventKey="poll" title={<><img src={key == "poll" ? pollLightTab : pollTab} alt="polls" /></>}>
            <Poll />
          </Tab>
          {/* <Tab eventKey="qna" title={<><img src={key == "qna" ? qnaLightTab : qnaTab} alt="qna" /></>}>
            <QNA notification={notification} setNotification={setNotification} />
          </Tab>
          <Tab eventKey="feedback" title={<><img src={key == "feedback" ? feedbackLightTab : feedbackTab} alt="feedback" /></>}>
            <Feedback />
          </Tab> */}
          <Tab eventKey="exhibitor" title={<><img src={key == "exhibitor" ? exhibitorLightTab : exhibitorTab} alt="exhibitor" /></>}>
            <Exhibitor />
          </Tab>
          <Tab eventKey="currentVisitor" title={<><img src={key == "currentVisitor" ? currentVisitorLightTab : currentVisitorDarkTab} alt="currentVisitor" /></>}>
            <CurrentVisitor />
          </Tab>
          {/* <Tab eventKey="feedback" title={<><img src={key == "feedback" ? feedbackLightTab : feedbackTab} alt="feedback" /></>}>
            <Feedback />
          </Tab>
          <Tab eventKey="feedback" title={<><img src={key == "feedback" ? feedbackLightTab : feedbackTab} alt="feedback" /></>}>
            <Feedback />
          </Tab> */}
        </Tabs>
      </div>
    </>
  );
}

export default Chats;