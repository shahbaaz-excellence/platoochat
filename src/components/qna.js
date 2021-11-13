import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getApprovedQuestionsRequest, questionApproveRequest } from '../redux/action';
import { auditorium_id,customerData } from '../constants/constants';
import { Spinner } from 'react-bootstrap';

const QNA = ({notification , setNotification}) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  // const qnaRef = useRef();
  // const [activeLoader, setActiveLoader] = useState(false)
  const [questionSent, setQuestionSent] = useState(false)
  // const [qnaNotificationMessage, setQnaNotificationMessage] = useState("")


  useEffect(() => {
    dispatch(getApprovedQuestionsRequest());
}, [])

const handleSubmitQuestion = (e) => {
  e.preventDefault();
  if(question!==""){
    const payload = {
      question: question,
      domain: customerData?.subdomain,
      name: customerData.fname,
      email: customerData.email,
      designation:  customerData?.designation ? customerData.designation : "",
      auditoriumId: auditorium_id ? auditorium_id : null,
      auditoriumTitle: document.title ? document.title : "",
    }
    if(payload){
      dispatch(questionApproveRequest(payload));
      setQuestion("");
    }
  }
}

const approvedQuestionsList = useSelector((state) => state.getApprovedQuestions)
const questionApproval = useSelector((state) => state.questionApprove)

useEffect(()=>{
  if(questionApproval.isLoading===true || approvedQuestionsList.isLoading === true){
    setLoading(true);
  } else {
    setLoading(false);
  }
},[questionApproval.isLoading, approvedQuestionsList.isLoading])

useEffect(()=>{
  if(questionApproval.isSuccess===true){
    setQuestionSent(true)
    setNotification({
      show:true,
      heading: "Thank You",
      content: "Your question has been submitted for approval"
    })
  } else {
    setQuestionSent(false)
  }
},[questionApproval.isSuccess])


// console.log(questionApproval, "iiiiiii");

  return (
    <>
      <div className="qnaDiv">
        <div style={{ padding: 10, backgroundColor: "white" }}>
          <span style={{ color: "#5B5B5B", fontSize: 18, fontWeight: 500 }}>QnA</span>
        </div>
        <div style={{ padding: 10 }}>
          {approvedQuestionsList?.approvedQuestionsList?.map((value, index) => (
            <div key={index} style={{ display: "flex", flexDirection: "column", boxShadow: " 0 .2rem 0.5rem rgba(0,0,0,.15)", borderRadius: 10, background: "white", paddingTop: 10, paddingBottom: 10, paddingLeft: 20, paddingRight: 20, marginBottom: 10 }}>
              <span>{value?.question}</span>
              <span style={{ fontSize: 12, textAlign: "right" }}>- {value.name}</span>
            </div>
          ))}
        </div>
        {loading && <div style={{position:"absolute", top:"50%", left:"50%", transform:"translate(-50%, -50%)"}}><Spinner animation="border" /></div>}
      </div>
      <form onSubmit={(e)=>handleSubmitQuestion(e)}>
        <input value={question} disabled={loading === true ? true : false} required onChange={(e)=>setQuestion(e.target.value)} style={{ width: "374px", height: "4vh", border: "none", outline: "none", paddingLeft: 20 }} placeholder="Type your question" />
      </form>
    </>
  );
}
export default QNA;