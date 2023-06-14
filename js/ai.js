

const MAX_DEPTH = 3;

export function aiMove(board) {

    // let [selectPiece, selectedSquare] = miniMaxCaller(board);
    let [selectPiece, selectedSquare] = random(board);
    // ToDo: call movePiece in board.
    console.log(board);
    return [[selectPiece.column, selectPiece.row], selectedSquare];

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
    return [selectedPiece, selectedSquare];

}

function miniMaxCaller(board) {
    console.log("calling min max caller");
    let calculatedPiece;
    let calcualtedSquare;
    let pieces = board.blackPieces;
    
    let oppPieces = board.whitePieces;
    let value = 1000000;
    console.log(pieces);
    for (let i = 0; i < pieces.length; i++) {
        let piece = pieces[i];
        let attSqrs = piece.getAttackingSquares(board);
        let pieceCords = [piece.column, piece.row];

        for (let i = 0; i < attSqrs.length; i++) {
            let sqr = attSqrs[i];
            if(board.kingUnderAttack(true)){
                return [sqr, piece];
            }

            let removedPiece = board.squares[sqr[0]][sqr[1]];
            if(removedPiece){
                let index = oppPieces.indexOf(removedPiece);
                oppPieces.splice(index,1);
            }
            
            piece.column = sqr[0];
            piece.row = sqr[1];
            board.squares[sqr[0]][sqr[1]] = piece;
            let hVal = miniMax2(1, true, board);
            if(hVal < value){
                calculatedPiece = piece;
                calcualtedSquare = sqr;
                value = hVal;
            }
            piece.column = pieceCords[0];
            piece.row = pieceCords[1];
            if(removedPiece){
                board.squares[sqr[0]][sqr[1]] = removedPiece;
                if(removedPiece) oppPieces.push(removedPiece);
            }
        }
    }

    return [calculatedPiece, calcualtedSquare];
}

function miniMax2(depth, maxPlayer, board) {
    console.log(depth);
    if(depth===MAX_DEPTH){
        console.log("depth reached");
        return heuristicValue(board);
    }

    let pieces = maxPlayer ? board.whitePieces : board.blackPieces;
    let oppPieces = maxPlayer ? board.blackPieces : board.whitePieces;
    let value = maxPlayer ? -1000000 : 1000000;


    if(maxPlayer){
        for (let i = 0; i < pieces.length; i++) {
            console.log("max player");
            let piece = pieces[i];
            let attSqrs = piece.getAttackingSquares(board);
            let pieceCords = [piece.column, piece.row];
    
            for (let i = 0; i < attSqrs.length; i++) {
                let sqr = attSqrs[i];
                let removedPiece = board.squares[sqr[0]][sqr[1]];
                if(removedPiece){
                    let index = oppPieces.indexOf(removedPiece);
                    oppPieces.splice(index,1);
                }
                
                piece.column = sqr[0];
                piece.row = sqr[1];
                board.squares[sqr[0]][sqr[1]] = piece;
                let hVal = miniMax2(depth+1, true, board);
                if(hVal >= value){
                    value = hVal;
                }
                piece.column = pieceCords[0];
                piece.row = pieceCords[1];
                if(removedPiece){
                    board.squares[sqr[0]][sqr[1]] = removedPiece;
                    if(removedPiece) oppPieces.push(removedPiece);
                }
            }
            
        }
        return value;
    }else{
        for (let piece in pieces) {
            console.log("min player");
            let attSqrs = piece.getAttackingSquares(board);
            let pieceCords = [piece.column, piece.row];
    
            for (let sqr in attSqrs) {
                let removedPiece = board.squares[sqr[0]][sqr[1]];
                if(removedPiece){
                    let index = oppPieces.indexOf(removedPiece);
                    oppPieces.splice(index,1);
                }
                
                piece.column = sqr[0];
                piece.row = sqr[1];
                board.squares[sqr[0]][sqr[1]] = piece;
                let hVal = miniMax2(depth+1, true, board);
                if(hVal < value){
                    value = hVal;
                }
                piece.column = pieceCords[0];
                piece.row = pieceCords[1];
                if(removedPiece){
                    board.squares[sqr[0]][sqr[1]] = removedPiece;
                    if(removedPiece) oppPieces.push(removedPiece);
                }
            }
            
        }
        return value;
    }


}

function heuristicValue(){
    return 0;
}