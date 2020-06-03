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

function stringToArgs(argString) {
  const argArray = argString.split(", ");

  const argObj = {};
  let argStr;
  for (argStr of argArray) {
    const pairArray = argStr.split(": ");

    const key = pairArray[0];
    const value = pairArray[1];

    argObj[key] = value;
  }

  return argObj;
}

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

    socket.on("gameTick", (tick) => {
      console.log("Game tick: ", tick);
    });
    setSocket(socket);
    return () => socket.close();
  }, []);

  const handleSubmit = (e) => {
    // e.preventDefault();

    // console.log(stringToArgs(argValue));
    // socket.emit("clientCommand", inputValue, stringToArgs(argValue));
    socket.emit("joinGame", "test");
    console.log("Joining test...");
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
