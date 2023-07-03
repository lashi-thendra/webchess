let tbodyElm = $('tbody');
let humanPlayer = true;
let trElm = null;
let tableElm = $('table');
export function addToTable(validationMessage, selectedPieceCor, coordinates, board){
    let pieceType = board.squares[coordinates[0]][coordinates[1]].type;
    let startingRow;
    let startingCol;
    let checkSign = "";
    let capturedSign = "";

    if(pieceType === QUEEN || pieceType === KING){
        startingCol = "";
        startingRow = "";
    }else{
        startingCol = letterFromCol(selectedPieceCor[0]);
        startingRow = selectedPieceCor[1]+1;
    }

    let endingCol = letterFromCol(coordinates[0]);
    let endingRow = coordinates[1]+1;


    if(validationMessage === WHITE_IN_CHECK || validationMessage === BLACK_IN_CHECK){
        checkSign = "+";
    }
    if(validationMessage === WHITE_WIN || validationMessage === BLACK_WIN){
        checkSign = "#";
    }

    if(board.captured) capturedSign = "x";

    let text = pieceType + startingCol + startingRow + capturedSign + endingCol + endingRow + checkSign;

    addTd(text);



}

function addTd(text){
    console.log(humanPlayer);
    if(humanPlayer){
        trElm = $('<tr></tr>');
        tbodyElm.append(trElm);
    }
    humanPlayer = !humanPlayer;
    trElm.append($('<td></td>').text(text));
    tableElm.scrollTop(tableElm.prop('scrollHeight'));

}


function letterFromCol(col){
    switch (col){
        case 0: return "a";
        case 1: return "b";
        case 2: return "c";
        case 3: return "d";
        case 4: return "e";
        case 5: return "f";
        case 6: return "g";
        case 7: return "h";
    }
}