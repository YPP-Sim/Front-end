import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import PlayerContext from "../../contexts/PlayerContext";

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

const SystemMessage = styled(Message)`
  color: #999;
  font-weight: bold;
`;

const GameChat = ({ socket, gameId }) => {
  const { playerName } = useContext(PlayerContext);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("playerMessage", (msgData) => {
      addMessage({ ...msgData, playerMessage: true });
    });

    socket.on("gameMessage", (msg) => {
      addMessage({ message: msg, playerMessage: false });
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
        sender: playerName,
        message: inputValue,
      });
      setInputValue("");
    }
  };

  return (
    <Root>
      <MessagesContainer>
        {messages.map((msg, key) =>
          msg.playerMessage ? (
            <Message key={key}>
              <MessageSender>{msg.sender}</MessageSender>: {msg.message}
            </Message>
          ) : (
            <SystemMessage key={key}>{msg.message}</SystemMessage>
          )
        )}
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
