export function aiMove(board){

    let [selectPiece, selectedSquare]= miniMax(board);
    board.movePiece( [selectPiece.column, selectPiece.row] , selectedSquare);
    console.log(selectPiece, selectedSquare);
    let pieceDiv =  $(`.cr-${selectPiece.column}-${selectPiece.row} > div`);
    $(`.cr-${selectedSquare[0]}-${selectedSquare[1]}`).empty();
    $(`.cr-${selectedSquare[0]}-${selectedSquare[1]}`).append(pieceDiv);

}

function miniMax(board){
    let blackPieces = board.blackPieces;
    console.log(blackPieces);
    let numberOfBlackPieces = blackPieces.length;
    let number = Math.floor(Math.random()*numberOfBlackPieces);

    let selectPiece = blackPieces[number];

    let attackingSquares = selectPiece.getAttackingSquares(board);

    let numbrOfAttackingSquares = attackingSquares.length;
    number = Math.floor(Math.random()*numbrOfAttackingSquares);

    let selectedSquare = attackingSquares[number];

    return [selectPiece, selectedSquare];

}

