
import { aiMove } from './ai.js';
import { Board } from './carpenter.js';

const board = new Board();
let emptySqrs = [];
let enemySqrs = [];
let selectedPieceCor = null;

//setting listeners
$('#board').on('mousedown','.piece',(eventData)=>{
    eventData.stopPropagation();

    if($(eventData.target).parent().hasClass('attack')){
        movePiece(getCordinatesFromPiece($(eventData.target)));
        return;
    }
    if(selectedPieceCor) clear();
    selectedPieceCor = getCordinatesFromPiece($(eventData.target));
    selectPiece(selectedPieceCor);
});

$('#board').on('drop','.square',(eventData)=>{
    if($(eventData.target).hasClass('free') || $(eventData.target).hasClass('attack')){
        movePiece(getCordinatesFromSquare($(eventData.target)));
    }
    
});

$('#board').on('mousedown','.square',(eventData)=>{
    if($(eventData.target).hasClass('free') || $(eventData.target).hasClass('attack')){
        movePiece(getCordinatesFromSquare($(eventData.target)));
    };
});



function selectPiece(coordinates){
    clear();
    selectedPieceCor = coordinates;
    
    let calculatedSqures = board.findPossibleSquares(coordinates);
    [emptySqrs, enemySqrs] = calculatedSqures ;

    emptySqrs.forEach((sqr)=>{
        $(`.cr-${sqr[0]}-${sqr[1]}`).addClass('free');
    });

    enemySqrs.forEach((sqr)=>{
        $(`.cr-${sqr[0]}-${sqr[1]}`).addClass('attack');
    });
}

function movePiece(coordinates){
    let validationMessage = board.movePiece(selectedPieceCor ,coordinates);
    if(validationMessage){
        // Todo: show that the move is invalid;
        return;
    }

    let pieceDiv =  $(`.cr-${selectedPieceCor[0]}-${selectedPieceCor[1]} > div`);
    $(`.cr-${coordinates[0]}-${coordinates[1]}`).empty();
    $(`.cr-${coordinates[0]}-${coordinates[1]}`).append(pieceDiv);


    pieceDiv.css('left','0');
    pieceDiv.css('top','0');

    emptySqrs.forEach((sqr)=>{
        $(`.cr-${sqr[0]}-${sqr[1]}`).removeClass('free');
    });

    enemySqrs.forEach((sqr)=>{
        $(`.cr-${sqr[0]}-${sqr[1]}`).removeClass('attack');
    });

    let aiCordsAndPiece = aiMove(board);
    moveAimove(aiCordsAndPiece[0], aiCordsAndPiece[1]);


}

function clear(){
    emptySqrs.forEach((sqr)=>{
        $(`.cr-${sqr[0]}-${sqr[1]}`).removeClass('free');
    });
    enemySqrs.forEach((sqr)=>{
        $(`.cr-${sqr[0]}-${sqr[1]}`).removeClass('attack');
    });
    emptySqrs = [];
    enemySqrs = [];
    selectedPieceCor = null;
}


function getCordinatesFromSquare(square){
    let col = square.attr('data-col');
    let row = square.attr('data-row');

    return [+col, +row];
}

function getCordinatesFromPiece(piece){
    let squareElm = piece.parent();
    return getCordinatesFromSquare(squareElm);
}

function moveAimove(aiSelectedCords, aiSelectedSquare){
    board.movePiece( aiSelectedCords, aiSelectedSquare);
    let pieceDiv =  $(`.cr-${aiSelectedCords[0]}-${aiSelectedCords[1]} > div`);
    $(`.cr-${aiSelectedSquare[0]}-${aiSelectedSquare[1]}`).empty();
    $(`.cr-${aiSelectedSquare[0]}-${aiSelectedSquare[1]}`).append(pieceDiv);
}







