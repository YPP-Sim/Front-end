import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import PlayerContext from "../../contexts/PlayerContext";

const Root = styled.div`
  background: rgba(196, 196, 196, 0.1);
  border-radius: 12px;

  min-height: 300px;
  width: 100%;
  height: 100%;
  max-width: 276px;
  min-width: 200px;
  max-height: 1000px;

  padding: 28px;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  user-select: none;
`;

const MessagesContainer = styled.div`
  overflow-y: auto;
  max-height: 550px;

  padding-bottom: 10px;

  &::-webkit-scrollbar {
    width: 5.48px;
    background-color: red;
    background: rgba(196, 196, 196, 0.1);
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb {
    width: 5.48px;
    background: rgba(196, 196, 196, 0.25);
    border-radius: 2px;
  }
`;

const MessageInputField = styled.input`
  width: 100%;
  margin: 0;
  border: 0;

  background: rgba(196, 196, 196, 0.1);
  border-radius: 6px;

  color: rgba(255, 255, 255, 0.5);

  padding: 12px 16px;
  box-sizing: border-box;
  font-size: 14px;
  font-family: ${({ theme }) => theme.textFont};
`;

const Message = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.textFont};
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 21px;

  color: #ffffff;

  margin-bottom: 7px;
`;

const MessageSender = styled.span`
  font-weight: 600;
`;

const SystemMessage = styled(Message)`
  color: rgba(196, 196, 196, 0.5);

  font-weight: 500;
  font-famil: ${({ theme }) => theme.textFont};
  font-size: 14px;
  margin-bottom: 7px;
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
        placeholder="Type a message..."
        onKeyDown={handleSubmitMessage}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
    </Root>
  );
};

export default GameChat;
