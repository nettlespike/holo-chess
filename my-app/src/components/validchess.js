import React, { useState, Component } from "react";
import {Chessboard} from "react-chessboard";
import { ChessInstance, ShortMove } from "chess.js";

const Chess = require("chess.js");

export default function MakeBoard() {  
    const[game, setGame] = useState(<Chessboard position = {"start"}/>)
    function handleMove(move){

    }
    return (
        <Chessboard
        position = {"start"}
        onPieceDrop={(move) =>
        handleMove({
            from: move.sourceSquare,
            to: move.targetSquare,
            promotion: "q",
        })}
        />
    )
    
}