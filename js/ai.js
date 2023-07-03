


let aiMove;


export function getAiMove(board) {

    const EFN = generateEFN(board);

    const jqxhr = 
    $.ajax(`http://www.chessdb.cn/cdb.php?action=query&board=${EFN}%20b%20-%20-%200%201`, 
    {
        method: 'GET',
        async: false
    });

    jqxhr.done((response)=> {
        if(response.startsWith("move")){
            // pick a randome move
            console.warn("selecting a one - from chessdb");
            // let index = Math.floor(Math.random()*moves.length);
            console.log(response);
            aiMove = convertUciToArray(response.substring(5,9));


        }else{
            console.warn("no moves from chessdb")
            let [selectPiece, selectedSquare] = miniMaxCaller(board);
            aiMove =  [[selectPiece.column, selectPiece.row], selectedSquare];
        }
  
    });
    jqxhr.fail(()=> {
        console.warn("chessdb query failed");
        let [selectPiece, selectedSquare] = miniMaxCaller(board);
        aiMove = [[selectPiece.column, selectPiece.row], selectedSquare];
    });

    return aiMove;

}

function testing(board){
    board.blackPieces.forEach(p=>{
        // console.log(p.getAttackingSquares(board));
    });
}


function random(board) {
    // console.log("squares", board);
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
    if(depth===maxDepth){
        // console.log("calling h value calculator for the",maxPlayer?"white":"black", "player at depth", depth);
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

function generateEFN(board){
    let outPut = "";
    let emptyCount = 0 ;
    let squares = board.squares;

    for (let j = 7; j >= 0; j--) {
        emptyCount = 0;
        for (let i = 0; i < 8; i++) {
            let piece = squares[i][j];
            if(piece){
                let letter = piece.firstLetter;
                if(!piece.isWhite) letter = letter.toLowerCase();
                if(emptyCount > 0) outPut += emptyCount;
                outPut += letter;
                emptyCount = 0;
            }else{
                emptyCount ++;
            }
        }
        if(emptyCount > 0){
            outPut += emptyCount;
        } 
        if(j !== 0 ) outPut += "/";
    }
    return outPut;
}

function convertUciToArray(uci){
    console.log(uci);
    const fileMap = { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7 };
    let fromFile = fileMap[uci.charAt(0)];
    let fromRank = +uci.charAt(1)-1;
    let toFile = fileMap[uci.charAt(2)];
    let toRank = +uci.charAt(3)-1;

    console.log([fromFile, fromRank], [toFile, toRank]);
    return [[fromFile, fromRank], [toFile, toRank]];

}