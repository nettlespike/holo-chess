import React, { useState } from "react";
import { Chessboard } from "react-chessboard";
import makeBoard from "./validchess";

export default function ChessGame(){
  return (
  <div className = "flex justify-center flex-col">
    <h1 className="flex justify-center ">Holo-Chess!</h1>
    <div className = "flex items-center w-2/3 h-2/3">
      <Chessboard position = {"start"}/>
    </div>
  </div>
  );
}