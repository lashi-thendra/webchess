

const MAX_DEPTH = 3;

export function aiMove(board) {

    // let [selectPiece, selectedSquare] = miniMaxCaller(board);
    let [selectPiece, selectedSquare] = random(board);
    // ToDo: call movePiece in board.
    return [[selectPiece.column, selectPiece.row], selectedSquare];

}

function testing(board){
    board.blackPieces.forEach(p=>{
        console.log(p.getAttackingSquares(board));
    });
}


function random(board) {
    let blackPieces = board.blackPieces;
    let numberOfBlackPieces = blackPieces.length;
    let number = Math.floor(Math.random() * numberOfBlackPieces);
    let selectedPiece = blackPieces[number];


    let attackingSquares = selectedPiece.getAttackingSquares(board);
    let numbrOfAttackingSquares = attackingSquares.length;
    if (numbrOfAttackingSquares === 0) return random(board);
    number = Math.floor(Math.random() * numbrOfAttackingSquares);

    let selectedSquare = attackingSquares[number];
    testing(board);
    return [selectedPiece, selectedSquare];

}

function miniMaxCaller(board) {
    let calculatedPiece;
    let calculateSquare;
    let pieces = board.blackPieces;
    
    let value = 1000000;
    for (let i = 0; i < pieces.length; i++) {
        let piece = pieces[i];
        let pieceCords = [piece.column, piece.row];

        let attSqrs = piece.getAttackingSquares(board);
        for (let i = 0; i < attSqrs.length; i++) {
            let sqr = attSqrs[i];

            let removedPiece = board.squares[sqr[0]][sqr[1]];
            if(removedPiece){
                let index = board.whitePieces.indexOf(removedPiece);
                board.whitePieces.splice(index,1);
            }
            
            board.squares[piece.column][piece.row] = null;
            board.squares[sqr[0]][sqr[1]] = piece;
            piece.column = sqr[0];
            piece.row = sqr[1];

            let hVal = miniMax2(1, true, board);

            if(hVal < value){
                calculatedPiece = piece;
                calculateSquare = sqr;
                value = hVal;
            }
            board.squares[sqr[0]][sqr[1]] = removedPiece;
            board.squares[pieceCords[0]][pieceCords[1]] = piece;
            piece.column = pieceCords[0];
            piece.row = pieceCords[1];

            if(removedPiece){
                board.whitePieces.push(removedPiece);
            }
        }
    }

    return [calculatedPiece, calculateSquare];
}

function miniMax2(depth, maxPlayer, board) {
    if(depth===MAX_DEPTH){

        return heuristicValue(board);
    }

    let pieces = maxPlayer ? board.whitePieces : board.blackPieces;
    let oppPieces = maxPlayer ? board.blackPieces : board.whitePieces;
    let value = maxPlayer ? -1000000 : 1000000;

    if(maxPlayer){
        for (let i = 0; i < pieces.length; i++) {
            let piece = pieces[i];
            let pieceCords = [piece.column, piece.row];

            let attSqrs = piece.getAttackingSquares(board);
            for (let i = 0; i < attSqrs.length; i++) {
                let sqr = attSqrs[i];

                let removedPiece = board.squares[sqr[0]][sqr[1]];
                if(removedPiece){
                    let index = oppPieces.indexOf(removedPiece);
                    oppPieces.splice(index,1);
                }

                board.squares[piece.column][piece.row] = null;
                board.squares[sqr[0]][sqr[1]] = piece;
                piece.column = sqr[0];
                piece.row = sqr[1];

                let hVal = miniMax2(depth+1, false, board);

                if(hVal > value){
                    value = hVal;
                }
                board.squares[sqr[0]][sqr[1]] = removedPiece;
                board.squares[pieceCords[0]][pieceCords[1]] = piece;
                piece.column = pieceCords[0];
                piece.row = pieceCords[1];

                if(removedPiece){
                    oppPieces.push(removedPiece);
                }
            }
        }
        return value;
    }else{
        for (let i = 0; i < pieces.length; i++) {
            let piece = pieces[i];
            let pieceCords = [piece.column, piece.row];

            let attSqrs = piece.getAttackingSquares(board);
            for (let i = 0; i < attSqrs.length; i++) {
                let sqr = attSqrs[i];

                let removedPiece = board.squares[sqr[0]][sqr[1]];
                if(removedPiece){
                    let index = oppPieces.indexOf(removedPiece);
                    oppPieces.splice(index,1);
                }

                board.squares[piece.column][piece.row] = null;
                board.squares[sqr[0]][sqr[1]] = piece;
                piece.column = sqr[0];
                piece.row = sqr[1];

                let hVal = miniMax2(depth+1, true, board);

                if(hVal < value){
                    value = hVal;
                }
                board.squares[sqr[0]][sqr[1]] = removedPiece;
                board.squares[pieceCords[0]][pieceCords[1]] = piece;
                piece.column = pieceCords[0];
                piece.row = pieceCords[1];

                if(removedPiece){
                    oppPieces.push(removedPiece);
                }
            }
        }
        return value;
    }


}

function heuristicValue(board){
    let value = 0;
    board.whitePieces.forEach(p =>{
       value += p.value;
    });
    board.blackPieces.forEach(p =>{
        value += p.value;
    })
    console.log(board.squares)
    return value;
}