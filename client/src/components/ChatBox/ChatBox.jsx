import React, { useEffect, useRef, useState } from "react";
import { addMessage, getMessages } from "../../api/MessageRequest";
import { getAllUser, getUser } from "../../api/UserRequest";
import {format} from "timeago.js"
import InputEmoji from "react-input-emoji"
import './ChatBox.css'
import { useSelector } from "react-redux";
import User from "../User/User";

const ChatBox = ({ chat, currentUser, setSendMessage, recieveMessage }) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("")
 
  const {user} = useSelector((state)=>state.authReducer.authData)
  const scroll = useRef()


  useEffect(()=>{
    if(recieveMessage!==null && recieveMessage.chatId===chat._id){
      setMessages([...messages, recieveMessage])
    }
  },[recieveMessage])
  // fetching data
  useEffect(() => {
    const userId = chat?.members?.find((id) => id !== currentUser);

    const getUserData = async () => {
      try {
        const { data } = await getUser(userId);
        setUserData(data);
        // console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (chat !== null) getUserData();
  }, [chat, currentUser]);

  // Fetch Messages

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await getMessages(chat._id);
        // console.log(data)
        setMessages(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (chat !== null) fetchMessages();
  }, [chat]);

  const handleChange = (newMessage)=>{
    setNewMessage(newMessage)
  }

  const handleSend = async (e) =>{
    e.preventDefault()
    const message = {
      senderId:currentUser,
      text:newMessage,
      chatId:chat._id
    }

    try {
      const {data} = await addMessage(message);
      setMessages([...messages, data])
      setNewMessage("")

    } catch (error) {
      console.log(error)
    }
    // send message to socket server
    const receiverId = chat.members.find((id)=>id !== currentUser)
    setSendMessage({...message, receiverId})

  }

  //Scroll to the last message

  useEffect(()=>{
    scroll.current?.scrollIntoView({behavior:"smooth"})
  },[messages])

  return (
    <>
      <div className="ChatBox-container">
   
        {chat ? ( <>
          <div className="chat-header">
            <div className="follower">
              <div>
                <img
                  src={
                    userData?.profilePicture
                      ? process.env.REACT_APP_PUBLIC_FOLDER +
                        userData.profilePicture
                      : process.env.REACT_APP_PUBLIC_FOLDER +
                        "defaultProfile.png"
                  }
                  alt="Profile"
                  className="followerImage"
                  style={{ width: "50px", height: "50px" }}
                />
                <div className="name" style={{ fontSize: "0.9rem" }}>
                  <span>
                    {userData?.firstname} {userData?.lastname}
                  </span>
                </div>
              </div>
            </div>
            <hr style={{ width: "85%", border: "0.1px solid #ececec" }} />
          
          </div>
          {/* Messages */}
          <div className="chat-body">
            {messages.map((message) => (
              <>
                <div ref={scroll}
                  className={
                    message.senderId === currentUser ? "message own" : "message"
                  }
                >
                    <span>{message.text}</span>
                    <span>{format(message.createdAt)}</span>
                </div>
              </>
            ))}
          </div>

          {/* Sender  */}
          <div className="chat-sender">
            <div>+</div>
            <InputEmoji 
             value={newMessage}
             onChange={handleChange}
            />
            <div className="send-button button" onClick={handleSend}>Send</div>
          </div>
        </>
        ) : (
            <span className="chatbox-empty-message">
                Click On a chat to start conversation...
            </span>
        )}
       
      </div>
    </>
  );
};

export default ChatBox;
