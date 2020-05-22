import React, { useState, useEffect } from "react";
import styled from "styled-components";
import io from "socket.io-client";

const ENDPOINT = "http://127.0.0.1:4000";

const Root = styled.div``;

const Button = styled.button`
  display: block;
  margin: 20px;
  padding: 15px;
`;

const SocketTestForm = () => {
  const [inputValue, setInputValue] = useState("");
  const [argValue, setArgValue] = useState("");
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    //Connect to socket
    const socket = io(ENDPOINT);

    socket.on("message", (data) => {
      console.log("Server message: ", data);
    });
    setSocket(socket);
    return () => socket.close();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    socket.emit("clientCommand", inputValue, argValue, (data) => {
      console.log(data);
    });
  };

  return (
    <Root>
      <label htmlFor="commandInput">Command: </label>
      <input
        id="commandInput"
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />

      <label htmlFor="argsInput">Arguments: </label>

      <input
        id="argsInput"
        type="text"
        value={argValue}
        onChange={(e) => setArgValue(e.target.value)}
      />
      <Button onClick={handleSubmit}>Send</Button>
    </Root>
  );
};

export default SocketTestForm;
