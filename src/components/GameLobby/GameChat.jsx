import React, { useState } from "react";
import styled from "styled-components";

const Root = styled.div`
  background-color: #fff;
  height: 100%;
  min-height: 300px;
  width: 100%;
  max-width: 250px;

  border-radius: 5px;
  padding: 10px;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const MessagesContainer = styled.div`
  overflow-y: auto;
  max-height: 350px;

  padding-bottom: 10px;
`;

const MessageInputField = styled.input`
  width: 100%;
  margin: 0;
  border: 0;
  background-color: #ededed;
  padding: 5px;
  box-sizing: border-box;
  border-radius: 5px;
  font-size: 16px;
  font-family: ${({ theme }) => theme.textFont};
`;

const Message = styled.p`
  margin: 0;
`;

const MessageSender = styled.span`
  font-weight: bold;
`;

const GameChat = () => {
  const [messages, setMessages] = useState([
    { sender: "Arty", message: "Hello there" },
    { sender: "Arty", message: "Hello there" },
    { sender: "sss", message: "Hello asddd" },
    { sender: "Arty", message: "Hello there" },
    { sender: "Arty", message: "Hello there" },
  ]);

  const addMessage = (msg) => {
    console.log("Adding msg");
    setMessages([...messages, msg]);
  };

  return (
    <Root>
      <MessagesContainer>
        {messages.map((msg, key) => (
          <Message>
            <MessageSender>{msg.sender}</MessageSender>: {msg.message}
          </Message>
        ))}
      </MessagesContainer>
      <MessageInputField
        type="text"
        placeholder="Message others here"
        onClick={() => addMessage({ sender: "Test", message: "Testing" })}
      />
    </Root>
  );
};

export default GameChat;
