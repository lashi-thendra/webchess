import {aiMove} from './ai.js';
import {Board} from './carpenter.js';

const board = new Board();
let emptySqrs = [];
let enemySqrs = [];
let selectedPieceCor = null;
let specialSound = false;
let captured = false;

let audSelfMove = new Audio('./audio/move-self.mp3');
let audCapture = new Audio('./audio/capture.mp3');
let audCheck = new Audio('./audio/move-check.mp3');
let audNotify = new Audio('./audio/notify.mp3');
let audPromote = new Audio('./audio/promote.mp3');

//setting listeners
$('#board').on('mousedown','.piece',(eventData)=>{
    eventData.stopPropagation();

    if($(eventData.target).parent().hasClass('attack')){
        movePiece(getCoordinatesFromPiece($(eventData.target)));
        return;
    }
    if(selectedPieceCor) clear();
    selectedPieceCor = getCoordinatesFromPiece($(eventData.target));
    selectPiece(selectedPieceCor);
});

$('#board').on('drop','.square',(eventData)=>{
    if($(eventData.target).hasClass('free') || $(eventData.target).hasClass('attack')){
        movePiece(getCoordinatesFromSquare($(eventData.target)));
    }
    
});

$('#board').on('mousedown','.square',(eventData)=>{
    if($(eventData.target).hasClass('free') || $(eventData.target).hasClass('attack')){
        movePiece(getCoordinatesFromSquare($(eventData.target)));
    };
});



function selectPiece(coordinates){
    clear();
    selectedPieceCor = coordinates;

    [emptySqrs, enemySqrs] = board.findPossibleSquares(coordinates) ;

    emptySqrs.forEach((sqr)=>{
        $(`.cr-${sqr[0]}-${sqr[1]}`).addClass('free');
    });

    enemySqrs.forEach((sqr)=>{
        $(`.cr-${sqr[0]}-${sqr[1]}`).addClass('attack');
    });
}

function movePiece(coordinates){
    let validationMessage = board.movePiece(selectedPieceCor ,coordinates);
    actionForValidation(validationMessage);

    playSound(validationMessage);
    if (validationMessage === ILLEGAL_MOVE) return;

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



    if(validationMessage === WHITE_WIN) return;

    console.log("starting to evaluate AI move...");


    setTimeout(()=>{
        let aiCordsAndPiece = aiMove(board);
        moveAiMove(aiCordsAndPiece[0], aiCordsAndPiece[1]);
    },500);

    

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


function getCoordinatesFromSquare(square){
    let col = square.attr('data-col');
    let row = square.attr('data-row');

    return [+col, +row];
}

function getCoordinatesFromPiece(piece){
    let squareElm = piece.parent();
    return getCoordinatesFromSquare(squareElm);
}

function moveAiMove(aiSelectedCords, aiSelectedSquare){
    let validationMessage = board.movePiece( aiSelectedCords, aiSelectedSquare);

    actionForValidation(validationMessage);
    setTimeout(()=>playSound(validationMessage),1);


    if(validationMessage === ILLEGAL_MOVE) {
        console.info("AI played an Illegal move.")
        // ToDo: Display Something
    }

    let pieceDiv =  $(`.cr-${aiSelectedCords[0]}-${aiSelectedCords[1]} > div`);
    $(`.cr-${aiSelectedSquare[0]}-${aiSelectedSquare[1]}`).empty();
    $(`.cr-${aiSelectedSquare[0]}-${aiSelectedSquare[1]}`).append(pieceDiv);
}

function actionForValidation(validationMessage){
    console.info("taking action for validation message:",validationMessage);
        switch (validationMessage){
            case ILLEGAL_MOVE:
                console.warn("illegal moves");
                break;
            case BLACK_IN_CHECK:
                console.warn("black in check");
                break;
            case WHITE_IN_CHECK:
                console.warn("white in check");
                break;
            case WHITE_WIN:
                console.warn("white won!");
                break;
            case BLACK_WIN:
                console.warn("black won!");
                break;
            case WHITE_WIN:
                console.warn("black won!");
                break;
            case SIMPLE_MOVE:
                console.warn("regular move!");
                break;
            case CAPTURE:
                console.log("captured!")
        }
}

function playSound(validationMessage){
    console.info("playing sound for:",validationMessage);
    switch (validationMessage){
        case ILLEGAL_MOVE: audNotify.play(); break;
        case BLACK_IN_CHECK : audCheck.play(); break;
        case WHITE_IN_CHECK: audCheck.play();break;
        case WHITE_WIN : audCheck.play(); audNotify.play(); break;
        case BLACK_WIN : audCheck.play(); audNotify.play(); break;
        case SIMPLE_MOVE : audSelfMove.play(); break;
        case CAPTURE: audCapture.play(); break;
    }
}





