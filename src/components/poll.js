import React from "react";
import StarPoll from "./starPoll";
import ChoicePoll from "./choicePoll";
import EmojiPoll from "./emojiPoll";
import StarPollAns from "./starPollAns";
import EmojiPollAns from "./emojiPollsAns";
import ChoicePollAns from "./choicePollAns";

const Poll = () => {
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