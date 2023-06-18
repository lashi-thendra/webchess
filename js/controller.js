import {aiMove} from './ai.js';
import {Board} from './carpenter.js';

const board = new Board();
let emptySqrs = [];
let enemySqrs = [];
let selectedPieceCor = null;
let humansTurn = true;

let audSelfMove = new Audio('./audio/move-self.mp3');
let audCapture = new Audio('./audio/capture.mp3');
let audCheck = new Audio('./audio/move-check.mp3');
let audNotify = new Audio('./audio/notify.mp3');
let audPromote = new Audio('./audio/promote.mp3');
let displayElm = $('header > div');


let chessTurnPhrases = [
    '"Is it your move?"',
    '"Would you like to make your chess move?"',
    '"What\'s your next move?"',
    '"Are you ready to play?"',
    '"Do you have a move in mind?"',
    '"Which piece will you move?"',
    '"Are you prepared to make your chess play?"',
    '"Shall we continue the game?"',
    '"Is it time for your move?"',
    '"Have you decided on your next chess action?"'
];

let aiCalculatingMessages = [
    '"Analyzing possible moves..."',
    '"AI is processing the best move..."',
    '"Evaluating board positions..."',
    '"AI is considering its options..."',
    '"Please wait while AI calculates its move..."',
    '"Generating optimal move..."',
    '"Thinking strategically..."',
    '"AI is analyzing game state..."',
    '"Calculating the next move..."',
    '"AI is determining its best course of action..."'
];

let aiUnderCheckMessages = [
    "'Check!'",
    "'You've put the opponent's king in check!'",
    "'Your move has resulted in a check!'",
    "'The opponent's king is in check!'",
    "'Checkmate is getting closer!'",
    "'Great move! Check!'",
    "'Your strategic play has resulted in a check!'",
    "'The opponent's king is now vulnerable!'",
    "'Check! Your move has intensified the game!'",
    "'Well done! The opponent's king is in check!'"
];

let humanUnderCheckMessages = [
    "'You're under check!'",
    "'Your king is in check!'",
    "'Watch out! You're being checked!'",
    "'Your opponent has put your king in check!'",
    "'Be cautious! You're under check!'",
    "'Protect your king! You're in check!'",
    "'Opponent's move has resulted in a check on your king!'",
    "'Your opponent has you in check!'",
    "'Take action! You're under check!'",
    "'Beware! Your king is under check!'"
];

let illegalMoveMessages = [
    "'Illegal move!'",
    "'Invalid move! Try again.'",
    "'Oops! That move is not allowed.'",
    "'You can't make that move.'",
    "'Illegal move detected!'",
    "'Sorry, that move is invalid.'",
    "'Invalid move! Choose a different move.'",
    "'Oops! That move is not permitted.'",
    "'You're not allowed to make that move.'",
    "'Illegal move! Please make a legal move.'"
];


let aiCapturePieceMessages = [
    "'AI captured your piece!'",
    "'You lost a piece to the AI!'",
    "'AI successfully captured your piece!'",
    "'Your piece was captured by the AI!'",
    "'AI takes one of your pieces!'",
    "'You've been outplayed. The AI captured your piece!'",
    "'AI makes a decisive move, capturing your piece!'",
    "'Your piece is now in the hands of the AI!'",
    "'Watch out! AI just captured your piece!'",
    "'The AI's capture leaves you at a disadvantage.'"
];

let humanWinMessages = [
    "'Congratulations! You win!'",
    "'Victory! You've defeated the AI!'",
    "'Well done! You've emerged victorious!'",
    "'You are the champion! You've won the game!'",
    "'Human triumphs! You've achieved a stunning victory!'",
    "'Bravo! Your strategic prowess leads to a win!'",
    "'You outsmarted the AI and claim victory!'",
    "'A splendid performance! You've won the game!'",
    "'Hooray! You've achieved a decisive win!'",
    "'You've emerged as the winner! Congratulations!'"
];

let aiWinMessages = [
    "'AI wins! Better luck next time.'",
    "'Defeat! The AI emerges victorious.'",
    "'AI triumphs! You've been outmatched.'",
    "'The AI reigns supreme. You've lost the game.'",
    "'AI prevails! Your efforts were valiant, but not enough.'",
    "'You've been defeated by the AI. Better luck next time.'",
    "'The AI's strategic superiority leads to a win.'",
    "'It's a win for the AI! Your opponent proves too strong.'",
    "'The AI outwits you to claim the victory.'",
    "'The AI celebrates its triumph as the winner.'"
];

let capturePieceMessages = [
    "'You captured an opponent's piece!'",
    "'Great move! You captured an opponent's piece!'",
    "'Well done! You eliminated an opponent's piece!'",
    "'You've successfully captured an opponent's piece!'",
    "'Capturing the opponent's piece! Excellent move!'",
    "'Your strategic play results in capturing an opponent's piece!'",
    "'Piece captured! You gain an advantage over your opponent!'",
    "'You've successfully eliminated an opponent's piece!'",
    "'Capture! You make a decisive move, removing the opponent's piece!'",
    "'Congratulations! You capture an opponent's piece with style!'"
];

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
    $('.square').each((i,sqr)=>{
        $(sqr).removeClass('move');
    });

    let pieceDiv =  $(`.cr-${selectedPieceCor[0]}-${selectedPieceCor[1]} > div`);
    pieceDiv.parent().addClass("move");
    $(`.cr-${coordinates[0]}-${coordinates[1]}`).empty();
    $(`.cr-${coordinates[0]}-${coordinates[1]}`).append(pieceDiv);
    $(`.cr-${coordinates[0]}-${coordinates[1]}`).addClass("move");

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
    // displayElm.text("AI is calculating the move......");

    setTimeout(()=>{
        let aiCordsAndPiece = aiMove(board);
        console.warn("moving the AI move", aiCordsAndPiece);
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


    $('.square').each((i,sqr)=>{
        $(sqr).removeClass('move');
    });

    let pieceDiv =  $(`.cr-${aiSelectedCords[0]}-${aiSelectedCords[1]} > div`);
    pieceDiv.parent().addClass("move");
    $(`.cr-${aiSelectedSquare[0]}-${aiSelectedSquare[1]}`).empty();
    $(`.cr-${aiSelectedSquare[0]}-${aiSelectedSquare[1]}`).append(pieceDiv);
    $(`.cr-${aiSelectedSquare[0]}-${aiSelectedSquare[1]}`).addClass("move");
}

function actionForValidation(validationMessage){
    console.info("taking action for validation message:",validationMessage);
        switch (validationMessage){
            case ILLEGAL_MOVE:
                console.warn("illegal move");
                displayText(ILLEGAL_MOVE);
                break;
            case BLACK_IN_CHECK:
                console.warn("black in check");
                displayText(BLACK_IN_CHECK);
                humansTurn = !humansTurn;
                break;
            case WHITE_IN_CHECK:
                console.warn("white in check");
                displayText(WHITE_IN_CHECK);
                humansTurn = !humansTurn;
                break;
            case WHITE_WIN:
                console.warn("white won!");
                displayText(WHITE_WIN);
                humansTurn = !humansTurn;
                break;
            case BLACK_WIN:
                console.warn("black won!");
                displayText(BLACK_WIN);
                humansTurn = !humansTurn;
                break;
            case SIMPLE_MOVE:
                console.warn("regular move!");
                displayText(SIMPLE_MOVE);
                humansTurn = !humansTurn;
                break;
            case CAPTURE:
                console.log("captured!");
                displayText(CAPTURE);
                humansTurn = !humansTurn;
                break;
        }

}

function displayText(validationMessage){
    let text;
    let index = Math.floor(Math.random()*10);
    switch (validationMessage){
        case SIMPLE_MOVE:
            if(!humansTurn){
                text = chessTurnPhrases[index];
            }else{
                text= aiCalculatingMessages[index];
            }
            break;
        case BLACK_IN_CHECK:
            text =aiUnderCheckMessages[index];
            break;
        case WHITE_IN_CHECK:
            text =humanUnderCheckMessages[index];
            break;
        case ILLEGAL_MOVE:
            text = illegalMoveMessages[index];
            break;
        case CAPTURE:
            if(!humansTurn){
                text = aiCapturePieceMessages[index];
            }else{
                text= capturePieceMessages[index];
            }
            break;
        case WHITE_WIN:
            text = humanWinMessages[index];
            break;
        case BLACK_WIN:
            text = aiWinMessages[index]
            break;
    }

    displayElm.text(text);
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





