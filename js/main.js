import { isMoveValid, checkForMateDraw } from "./state-reader.js";

$('table tbody tr:last-child').remove();
$('table tbody tr td:first-child').remove();
$('br').parent().remove();

let whitePieces = [];
let blackPieces = [];
let allowedSquares = [];
let selectedPiece = null;
let playerColor = null;
let opponentColor = null;
const WHITE = true;
const BLACK = false;
let colNumber = 0;
let rowNumber = 0;

// initializing piece containers <td> with row col number data attributes
$('table tbody td').each((i,elm)=>{

    $(elm).parents('tr').addClass(`row-${8-Math.floor(i/8)}`);
    $(elm).addClass(`col-${i%8+1}`);
    $(elm).attr('data-row-no',`${8-Math.floor(i/8)}`);
    $(elm).attr('data-col-no',`${i%8+1}`);

    if($(elm).text().trim()){
        $(elm).addClass('piece-container');
    }

});

$('tbody').on('mousedown','span',(eventData)=>{
    eventData.stopPropagation();

    if($(eventData.target).parent().hasClass('attack')){
        movePiece($(eventData.target).parent());
        return;
    }
    if(selectedPiece) clearSelections();
    selectedPiece = $(eventData.target);
    playerColor = selectedPiece.attr('data-color');
    opponentColor = (playerColor === 'white')? 'black': 'white';
    findAllowedSquares(selectedPiece);
});

$('tbody').on('drop','td',(eventData)=>{
    movePiece($(eventData.target));
});

$('tbody').on('mousedown','td',(eventData)=>{
    if($(eventData.target).hasClass('allowable-squares')){
        movePiece($(eventData.target));
    };
});






//initializing piece <span> with data-attributes and black whith classes
$('table tbody td > span').each((i,elm)=>{
    let element = $(elm);
    element.draggable({
        revert: 'invalid', 
    })

    let rowNumber = element.parent().attr('data-row-no');
    if(rowNumber === '2' || rowNumber == '7'){
        element.attr('data-piece','pawn');
        element.attr('data-first-move','1');
    }else{
        let j = i%8;
        if(j === 0 || j === 7){
            element.attr('data-piece','rook');
        }else if(j === 1 || j === 6 ){
            element.attr('data-piece','knight');
        }else if(j === 2 || j === 5 ){
            element.attr('data-piece','bishop');
        }else if(j === 3){
            element.attr('data-piece','queen');
        }else{
            element.attr('data-piece','king');
        }
    }

    element.addClass(`${(i <= 15)?'black':'white'}`);
    element.attr('data-color',`${(i <= 15)?'black':'white'}`);

    

    if(element.hasClass('white')){
        whitePieces.push(element);
    }else{
        blackPieces.push(element);
    }
})

// initially it's white's turn. ture for white.
activatePieceContainers(WHITE);


function activatePieceContainers(isWhite){
    if(isWhite){
        whitePieces.forEach((elm)=>{
            elm.parent().addClass('selectable-piece-container');
        });
        blackPieces.forEach((elm)=>{
            elm.parent().removeClass('selectable-piece-container')
        })
    }else{
        whitePieces.forEach((elm)=>{
            elm.parent().removeClass('selectable-piece-container');
        });
        blackPieces.forEach((elm)=>{
            elm.parent().addClass('selectable-piece-container')
        })
    }
}

function findAllowedSquares(piece){
    rowNumber = +piece.parent().attr('data-row-no');
    colNumber = +piece.parent().attr('data-col-no');
    let pieceType = piece.attr('data-piece');
    switch(pieceType){
        case 'pawn': findPawnMoves(piece, colNumber, rowNumber); break;
        case 'rook': findRookMoves(piece, colNumber, rowNumber, false); break;
        case 'knight' : findKnightMoves(piece, colNumber, rowNumber); break;
        case 'bishop' : findBishopMoves(piece, colNumber, rowNumber); break;
        case 'queen' : findQueenMoves(piece, colNumber, rowNumber); break;
        case 'king' : findKingMoves(piece, colNumber, rowNumber); break;
    }
}


function findPawnMoves(piece, colNumber, rowNumber){

    let increament = (playerColor === 'white')? 1:-1;

    for(let i = 1; i < 3 ; i ++){
        let targetSqure = $(`.row-${rowNumber+increament*i} .col-${colNumber}`);
        if(targetSqure.hasClass('piece-container')) break;
        if(i===2 && !Number.parseInt(piece.attr('data-first-move'))) break;
        allowedSquares.push(targetSqure);
    }

    let targetSqure = $(`.row-${rowNumber+increament} > .col-${colNumber+1}`);
    if(targetSqure.children('span').hasClass(opponentColor)){
        allowedSquares.push(targetSqure);
    }

    targetSqure = $(`.row-${rowNumber+increament} > .col-${colNumber-1}`);
    if(targetSqure.children('span').hasClass(opponentColor)){
        allowedSquares.push(targetSqure);
    }
    markAllowedSquares();

}

function findRookMoves(piece, colNumber, rowNumber, forwardToBishop){
    

    let i = 1;
    while((colNumber + i) <= 8 && !$(`.row-${rowNumber} .col-${colNumber+i}`)
    .children('span').hasClass(playerColor)){
        let targetSqure = $(`.row-${rowNumber} .col-${colNumber+i}`);
        if(!pushAndDecideToContinue(targetSqure, opponentColor)) break;
        i++;
    }

    i=1;
    while((colNumber - i) >= 1 && !$(`.row-${rowNumber} .col-${colNumber-i}`)
    .children('span').hasClass(playerColor)){
        let targetSqure = $(`.row-${rowNumber} .col-${colNumber-i}`);
        if(!pushAndDecideToContinue(targetSqure, opponentColor)) break;
        i++;
    }

    i=1;
    while((rowNumber + i) <= 8 && !$(`.row-${rowNumber+i} .col-${colNumber}`)
    .children('span').hasClass(playerColor)){
        let targetSqure = $(`.row-${rowNumber+i} .col-${colNumber}`);
        if(!pushAndDecideToContinue(targetSqure, opponentColor)) break;
        i++;
    }

    i=1;

    while((rowNumber - i) >= 1 && !$(`.row-${rowNumber-i} .col-${colNumber}`)
    .children('span').hasClass(playerColor)){
        let targetSqure = $(`.row-${rowNumber-i} .col-${colNumber}`);
        if(!pushAndDecideToContinue(targetSqure, opponentColor)) break;
        i++;
    }
    
    if(forwardToBishop){
        findBishopMoves(piece, colNumber, rowNumber);
    }else{
        markAllowedSquares();
    }
}

function pushAndDecideToContinue(targetSquare ,opponentColor){
    allowedSquares.push(targetSquare); 
    if(targetSquare.children('span').hasClass(opponentColor)){
        return false;
    }else{
        return true;
    }
}

function findKnightMoves(piece, colNumber, rowNumber){
    

    let tempSquareArray = [];

    [[1,2],[1,-2],[2,1],[2,-1],[-1,2],[-1,-2],[-2,1],[-2,-1]].forEach(([i,j])=>{
        tempSquareArray.push($(`.row-${rowNumber+i} .col-${colNumber+j}`));
    });

    allowedSquares = tempSquareArray.filter( elem=> elem[0]);
    allowedSquares =allowedSquares.filter( elem=> !elem.children('span').hasClass(playerColor));
    markAllowedSquares();

}

function findBishopMoves(piece, colNumber, rowNumber){
    
    let i = 1;
    
    while((colNumber + i) <= 8 && (rowNumber + i) <=8 && !$(`.row-${rowNumber+i} .col-${colNumber+i}`)
    .children('span').hasClass(playerColor)){
        let targetSqure = $(`.row-${rowNumber+i} .col-${colNumber+i}`);
        if(!pushAndDecideToContinue(targetSqure, opponentColor)) break;
        i++
    }

    i = 1;
    while(((colNumber - i) >= 1) && ((rowNumber - i) >=1) && !$(`.row-${rowNumber-i} .col-${colNumber-i}`)
    .children('span').hasClass(playerColor)){
        let targetSqure = $(`.row-${rowNumber-i} .col-${colNumber-i}`);
        if(!pushAndDecideToContinue(targetSqure, opponentColor)) break;
        i++;
        
    }
    
    i = 1;
    while((colNumber + i) <= 8 && (rowNumber - i) >=1 && !$(`.row-${rowNumber-i} .col-${colNumber+i}`)
    .children('span').hasClass(playerColor)){
        let targetSqure = $(`.row-${rowNumber-i} .col-${colNumber+i}`);
        if(!pushAndDecideToContinue(targetSqure, opponentColor)) break;
        i++;
    }

    i = 1;
    while(((colNumber - i) >=1) && ((rowNumber + i) <=8) && !$(`.row-${rowNumber+i} .col-${colNumber-i}`)
    .children('span').hasClass(playerColor)){
        let targetSqure = $(`.row-${rowNumber+i} .col-${colNumber-i}`);
        if(!pushAndDecideToContinue(targetSqure, opponentColor)) break;

        i++;
    }  
    markAllowedSquares();
}

function findQueenMoves(piece, colNumber, rowNumber){
    findRookMoves(piece, colNumber, rowNumber,true);
}

function findKingMoves(piece, colNumber, rowNumber){
    [[colNumber+1, rowNumber],[colNumber-1,rowNumber],[colNumber, rowNumber+1],[colNumber, rowNumber-1],
[colNumber+1,rowNumber+1],[colNumber+1,rowNumber-1],[colNumber-1,rowNumber+1],[colNumber-1,rowNumber-1]].forEach(([i,j])=>{
    allowedSquares.push($(`.row-${j} .col-${i}`));
});
    markAllowedSquares();
}

function markAllowedSquares(){
    allowedSquares.forEach((square)=>{

        let pieceInSquare = square.text().trim()[0];
        if(pieceInSquare) {
            square.addClass('attack');
        }else{
            square.addClass('allowable-squares');
        }

        square.droppable({
            disabled:false,
        }); 
    })
}

function movePiece(square){
    if(!isMoveValid(square)) return;
    if(selectedPiece.attr('data-piece')==='pawn'){
        selectedPiece.attr('data-first-move','0'); 
    }
    square.empty();
    selectedPiece.parent().removeClass('selectable-piece-container');
    selectedPiece.css('top','0');
    selectedPiece.css('left','0');
    square.append(selectedPiece);
    square.addClass('selectable-piece-container piece-container');

    selectedPiece.draggable({
        disabled: false,
    });

    clearSelections();
    checkForMateDraw();
}

function clearSelections(){
    allowedSquares.forEach((square)=>{
        square.removeClass('allowable-squares piece-container ui-droppable ui-droppable-handle attack');
        square.droppable({disabled:true})
    })
    selectedPiece = null;
    playerColor = null;
    opponentColor =null;
    allowedSquares.splice(0, allowedSquares.length);
}



    




