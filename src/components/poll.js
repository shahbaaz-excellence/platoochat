import React, {useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import StarPoll from "./starPoll";
import ChoicePoll from "./choicePoll";
import EmojiPoll from "./emojiPoll";
import StarPollAns from "./starPollAns";
import EmojiPollAns from "./emojiPollsAns";
import ChoicePollAns from "./choicePollAns";
import { getAllPollRequest } from "../redux/action";

const Poll = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllPollRequest());
}, [])

const allPollList = useSelector((state) => state)
// console.log(allPollList, "iiiiiii");

  return (
    <>
      <div className="pollDiv">
        <div style={{ padding: 10, backgroundColor: "white" }}>
          <span style={{ color: "#5B5B5B", fontSize: 18, fontWeight: 500 }}>Polls</span>
        </div>
        <div style={{ padding: 10 }}>
          <StarPoll />
          <EmojiPoll />
          <ChoicePoll />
          <StarPollAns totalVotes={83} />
          <EmojiPollAns />
          <ChoicePollAns />
        </div>
      </div>
    </>
  );
}
export default Poll;