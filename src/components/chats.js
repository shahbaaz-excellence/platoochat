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
import "../App.css";

const Chats = () => {

  const [key, setKey] = useState();
  return (
    <>
      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className={"navigationTab"}
      >
        <Tab eventKey="attendees" title={<><img src={attendeeTab} alt="attendees"/></>}>
          <Attendees />
        </Tab>
        <Tab eventKey="myChats" title={<><img src={chatTab} alt="chats"/></>}>
          <MyChats />
        </Tab>
        <Tab eventKey="poll" title={<><img src={pollTab} alt="polls"/></>}>
          <Poll />
        </Tab>
        <Tab eventKey="qna" title={<><img src={qnaTab} alt="qna"/></>}>
          <QNA />
        </Tab>
        <Tab eventKey="feedback" title={<><img src={feedbackTab} alt="feedback"/></>}>
          <Feedback />
        </Tab>
      </Tabs>
    </>
  );
}

export default Chats;