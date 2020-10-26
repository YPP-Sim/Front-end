import React from "react";

const TileContext = React.createContext({
  onSelect: () => console.log("Default method"),
});

export const TileProvider = TileContext.Provider;
export const TileConsumer = TileContext.Consumer;

export default TileContext;
