

export const MAX_DEPTH = 5;

export function aiMove(board) {


    let [selectPiece, selectedSquare] = miniMaxCaller(board);
    // console.warn(selectPiece, selectedSquare);
    // let [selectPiece, selectedSquare] = random(board);
    // ToDo: call movePiece in board.
    return [[selectPiece.column, selectPiece.row], selectedSquare];

}

function testing(board){
    board.blackPieces.forEach(p=>{
        console.log(p.getAttackingSquares(board));
    });
}


function random(board) {
    console.log("squares", board);
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
    let pieces = [...board.blackPieces];
    
    let value = Infinity;
    for (let i = 0; i < pieces.length; i++) {
        let piece = pieces[i];
        let pieceCords = [piece.column, piece.row];

        let attSqrs = piece.getAttackingSquares(board);
        // console.warn(attSqrs.length, piece);
        for (let i = 0; i < attSqrs.length; i++) {

            let sqr = attSqrs[i];

            let removedPiece = board.squares[sqr[0]][sqr[1]];
            if(removedPiece){
                if(removedPiece === board.blackKing) return 10000;
                if(removedPiece === board.whiteKing) return -10000;
                let index = board.whitePieces.indexOf(removedPiece);
                board.whitePieces.splice(index,1);
            }
            
            board.squares[piece.column][piece.row] = null;
            board.squares[sqr[0]][sqr[1]] = piece;
            piece.column = sqr[0];
            piece.row = sqr[1];

            // console.log("before minimax:", board.squares);

            let hVal = miniMax2(1,-Infinity, +Infinity, true, board);

            if(hVal <= value){
                calculatedPiece = piece;
                calculateSquare = sqr;
                value = hVal;
            }

            console.warn("piece=", piece);
            console.warn("hVal=", hVal, "Value", value,"board", board.squares);
            console.warn("---------------");

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

export function miniMax2(depth,alpha, beta, maxPlayer, board) {
    if(depth===MAX_DEPTH){
        return heuristicValue(board);
    }

    let pieces = maxPlayer ? board.whitePieces : board.blackPieces;
    // let oppPieces = !maxPlayer ? board.blackPieces : board.whitePieces;
    let value = maxPlayer ? -Infinity : Infinity;

    if(maxPlayer){
        let piecesP = [...pieces];
        for (let i = 0; i < piecesP.length; i++) {
            let piece = piecesP[i];
            let pieceCords = [piece.column, piece.row];

            let attSqrs = piece.getAttackingSquares(board);
            for (let i = 0; i < attSqrs.length; i++) {
                let sqr = attSqrs[i];

                let removedPiece = board.squares[sqr[0]][sqr[1]];
                if(removedPiece){
                    if(removedPiece === board.blackKing) return 10000-1*depth;
                    if(removedPiece === board.whiteKing) return -10000+1*depth;
                    let index = board.blackPieces.indexOf(removedPiece);
                    board.blackPieces.splice(index,1);

                }

                board.squares[piece.column][piece.row] = null;
                board.squares[sqr[0]][sqr[1]] = piece;
                piece.column = sqr[0];
                piece.row = sqr[1];


                let hVal = miniMax2(depth+1,alpha, beta, false, board);
                alpha = Math.max(alpha, hVal);

                if(hVal > value){
                    value = hVal;
                }
                board.squares[sqr[0]][sqr[1]] = removedPiece;
                board.squares[pieceCords[0]][pieceCords[1]] = piece;
                piece.column = pieceCords[0];
                piece.row = pieceCords[1];

                if(removedPiece){
                    board.blackPieces.push(removedPiece);
                }

                if( alpha >= beta){
                    break;

                }
            }
        }
        return value;

    }else{
        let piecesO = [...pieces];
        for (let i = 0; i < piecesO.length; i++) {
            let piece = piecesO[i];
            let pieceCords = [piece.column, piece.row];

            let attSqrs = piece.getAttackingSquares(board);
            for (let i = 0; i < attSqrs.length; i++) {
                let sqr = attSqrs[i];

                let removedPiece = board.squares[sqr[0]][sqr[1]];
                if(removedPiece){
                    if(removedPiece === board.blackKing) return 10000-1*depth;
                    if(removedPiece === board.whiteKing) return -10000+1*depth;
                    let index = board.whitePieces.indexOf(removedPiece);
                    board.whitePieces.splice(index,1);
                }

                board.squares[piece.column][piece.row] = null;
                board.squares[sqr[0]][sqr[1]] = piece;
                piece.column = sqr[0];
                piece.row = sqr[1];

                let hVal = miniMax2(depth+1,alpha, beta, true, board);

                if(hVal < value){
                    value = hVal;
                }

                beta = Math.min(hVal, beta);

                board.squares[sqr[0]][sqr[1]] = removedPiece;
                board.squares[pieceCords[0]][pieceCords[1]] = piece;
                piece.column = pieceCords[0];
                piece.row = pieceCords[1];

                if(removedPiece){
                    board.whitePieces.push(removedPiece);
                }

                if( alpha >= beta){
                    break;

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
    // if (value)console.warn("heuristicValue",value);

    return value;
}