import React from "react";
import { Placeholder } from "react-bootstrap";

const QNA = () => {
  return (
    <>
      <div className="qnaDiv">
        <div style={{ padding: 10, backgroundColor: "white" }}>
          <span style={{ color: "#5B5B5B", fontSize: 18, fontWeight: 500 }}>QnA</span>
        </div>
        <div style={{ padding: 10 }}>
          {[1, 2, 3].map((value, index) => (
            <div key={index} style={{ display: "flex", flexDirection: "column", boxShadow: " 0 .2rem 0.5rem rgba(0,0,0,.15)", borderRadius: 10, background: "white", paddingTop: 10, paddingBottom: 10, paddingLeft: 20, paddingRight: 20, marginBottom: 10 }}>
              <span>question questionquesquestion questionquestion question question questionquestionques</span>
              <span style={{ fontSize: 12, textAlign: "right" }}>- Dr. KK Chaddha</span>
            </div>
          ))}
        </div>
      </div>
      <input style={{ width: "374px", height: "4vh", border: "none", outline: "none", paddingLeft: 20 }} placeholder="Type your question" />
    </>
  );
}
export default QNA;