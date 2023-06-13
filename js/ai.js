import { moveAimove } from "./controller.js";

export function aiMove(board){

    let [selectPiece, selectedSquare]= miniMax(board);
    
    moveAimove([selectPiece.column, selectPiece.row] , selectedSquare);
    

}

function miniMax(board){
    let blackPieces = board.blackPieces;
    let numberOfBlackPieces = blackPieces.length;
    let number = Math.floor(Math.random()*numberOfBlackPieces);
    let selectPiece = blackPieces[number];
    

    let attackingSquares = selectPiece.getAttackingSquares(board);
    let numbrOfAttackingSquares = attackingSquares.length;
    if(numbrOfAttackingSquares === 0 ) return miniMax(board);
    number = Math.floor(Math.random()*numbrOfAttackingSquares);

    let selectedSquare = attackingSquares[number];
    return [selectPiece, selectedSquare];

}

