import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Root = styled.div`
  background-color: #fff;
  min-height: 300px;
  width: 100%;
  max-width: 250px;
  max-height: 1000px;

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

const GameChat = ({ socket, gameId }) => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([
    { sender: "Arty", message: "Hello there" },
  ]);

  useEffect(() => {
    socket.on("playerMessage", (msgData) => {
      addMessage(msgData);
    });
    return () => {
      socket.off("playerMessage");
    };
  });

  const addMessage = (msg) => {
    setMessages([...messages, msg]);
  };

  const handleSubmitMessage = (e) => {
    if (e.keyCode === 13) {
      socket.emit("playerMessage", {
        gameId,
        sender: "SocketTest",
        message: inputValue,
      });
      setInputValue("");
    }
  };

  return (
    <Root>
      <MessagesContainer>
        {messages.map((msg, key) => (
          <Message key={key}>
            <MessageSender>{msg.sender}</MessageSender>: {msg.message}
          </Message>
        ))}
      </MessagesContainer>
      <MessageInputField
        type="text"
        placeholder="Message others here"
        onKeyDown={handleSubmitMessage}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
    </Root>
  );
};

export default GameChat;
