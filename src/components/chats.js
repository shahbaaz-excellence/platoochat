import React, { useState, useEffect } from "react";
import { Tabs, Tab } from 'react-bootstrap';
import Attendees from "./attendees";
import MyChats from "./myChats";
import Poll from "./poll";
import QNA from "./qna";
import Feedback from "./feedback";
import attendeeTab from "../assets/attendeeTab.svg";
import chatTab from "../assets/chatTab.svg";
import pollTab from "../assets/pollTab.svg";
import qnaTab from "../assets/qnaTab.svg";
import feedbackTab from "../assets/feedbackTab.svg";
import { ImCross } from 'react-icons/im';
import "../App.css";

const Chats = () => {

  const [key, setKey] = useState();
  const [chatWindow, setChatWindow] = useState(false);
  const [messageScreen, setMessageScreen] = useState(false);

  return (
    <>
      {chatWindow == true &&
        <button onClick={() => {setChatWindow(false);setMessageScreen(false)}}
          style={{ position: "absolute", borderRadius: 8, paddingBottom: 3, right: "78px", bottom: "75vh", border: "none", background: "red", cursor:"pointer" }}>
          <ImCross color="white" />
        </button>}
      <div className={chatWindow === true ? "chatWindowOpen" : "chatWindowClosed"}>
        <Tabs
          id="controlled-tab-example"
          activeKey={key}
          onSelect={(k) => { setKey(k); setChatWindow(true) }}
          className={"navigationTab"}
        >
          <Tab eventKey="attendees" title={<><img src={attendeeTab} alt="attendees" /></>}>
            <Attendees setMessageScreen={setMessageScreen} messageScreen={messageScreen} />
          </Tab>
          <Tab eventKey="myChats" title={<><img src={chatTab} alt="chats" /></>}>
            <MyChats setMessageScreen={setMessageScreen} messageScreen={messageScreen} />
          </Tab>
          <Tab eventKey="poll" title={<><img src={pollTab} alt="polls" /></>}>
            <Poll />
          </Tab>
          <Tab eventKey="qna" title={<><img src={qnaTab} alt="qna" /></>}>
            <QNA />
          </Tab>
          <Tab eventKey="feedback" title={<><img src={feedbackTab} alt="feedback" /></>}>
            <Feedback />
          </Tab>
        </Tabs>
      </div>
    </>
  );
}

export default Chats;