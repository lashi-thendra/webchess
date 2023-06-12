import { moveAimove } from "./controller.js";

export function aiMove(board){

    let [selectPiece, selectedSquare]= miniMax(board);
    
    moveAimove([selectPiece.column, selectPiece.row] , selectedSquare);
    

}

function miniMax(board){
    let blackPieces = board.blackPieces;
    console.log(blackPieces);
    let numberOfBlackPieces = blackPieces.length;
    let number = Math.floor(Math.random()*numberOfBlackPieces);
    console.log("generated random number", number);
    let selectPiece = blackPieces[number];
    console.log("selected piece",selectPiece );
    

    let attackingSquares = selectPiece.getAttackingSquares(board);
    console.log("attacking squares",attackingSquares);
    let numbrOfAttackingSquares = attackingSquares.length;
    if(numbrOfAttackingSquares === 0 ) return miniMax(board);
    number = Math.floor(Math.random()*numbrOfAttackingSquares);

    let selectedSquare = attackingSquares[number];
    console.log("selected square", selectedSquare);
    return [selectPiece, selectedSquare];

}

