$('table tbody tr:last-child').remove();
$('table tbody tr td:first-child').remove();
$('br').parent().remove();

let whitePieces = [];
let blackPieces = [];
let allowedSquares = [];
let selectedPiece = null;
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

    $(elm).droppable({
        disabled:true,
        drop: (eventData)=> movePiece($(eventData.target)),
    })
})


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

    element.on('mousedown',(eventData)=>findAllowedSquares($(eventData.target)));
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
    selectedPiece = piece;
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

    let pieceColor = piece.attr('data-color');
    let opponentColor = (pieceColor === 'white')? 'black': 'white';
    let increament = (pieceColor === 'white')? 1:-1;

    console.log(opponentColor);
    
    for(let i = 1; i < 3 ; i ++){
        let targetSqure = $(`.row-${rowNumber+increament*i} .col-${colNumber}`);
        if(targetSqure.hasClass('piece-container')) break;
        if(i===2 && !Number.parseInt(piece.attr('data-first-move'))) break;
        allowedSquares.push(targetSqure);
    }

    targetSqure = $(`.row-${rowNumber+increament} > .col-${colNumber+1}`);
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
    console.log("rook is moving");
    let pieceColor = piece.attr('data-color');
    let opponentColor = (pieceColor === 'white')? 'black': 'white';

    let i = 1;
    while((colNumber + i) <= 8 && !$(`.row-${rowNumber} .col-${colNumber+i}`)
    .children('span').hasClass(pieceColor)){
        let targetSqure = $(`.row-${rowNumber} .col-${colNumber+i}`);
        if(!pushAndDecideToContinue(targetSqure, opponentColor)) break;
        i++;
    }

    i=1;
    while((colNumber - i) >= 1 && !$(`.row-${rowNumber} .col-${colNumber-i}`)
    .children('span').hasClass(pieceColor)){
        let targetSqure = $(`.row-${rowNumber} .col-${colNumber-i}`);
        if(!pushAndDecideToContinue(targetSqure, opponentColor)) break;
        i++;
    }

    i=1;
    while((rowNumber + i) <= 8 && !$(`.row-${rowNumber+i} .col-${colNumber}`)
    .children('span').hasClass(pieceColor)){
        let targetSqure = $(`.row-${rowNumber+i} .col-${colNumber}`);
        if(!pushAndDecideToContinue(targetSqure, opponentColor)) break;
        i++;
    }

    i=1;
    console.log(rowNumber, colNumber)

    while((rowNumber - i) >= 1 && !$(`.row-${rowNumber-i} .col-${colNumber}`)
    .children('span').hasClass(pieceColor)){
        let targetSqure = $(`.row-${rowNumber-i} .col-${colNumber}`);
        if(!pushAndDecideToContinue(targetSqure, opponentColor)) break;
        i++;
    }
    
    if(forwardToBishop){
        console.log("fowarding to bishop from rook");
        findBishopMoves(piece, colNumber, rowNumber);
    }else{
        console.log("marking ");
        markAllowedSquares();
    }
}

function pushAndDecideToContinue(targetSquare ,opponentColor){
    console.log("pushed the square and deciding to continue");
    allowedSquares.push(targetSquare); 
    if(targetSquare.children('span').hasClass(opponentColor)){
        console.log("found a opponent");
        return false;
    }else{
        return true;
    }
}

function findKnightMoves(piece, colNumber, rowNumber){
    console.log("knight is moving");
    let pieceColor = piece.attr('data-color');
    let opponentColor = (pieceColor === 'white')? 'black': 'white';

    let tempSquareArray = [];

    [[1,2],[1,-2],[2,1],[2,-1],[-1,2],[-1,-2],[-2,1],[-2,-1]].forEach(([i,j])=>{
        tempSquareArray.push($(`.row-${rowNumber+i} .col-${colNumber+j}`));
    });

    allowedSquares = tempSquareArray.filter( elem=> elem[0]);
    allowedSquares =allowedSquares.filter( elem=> !elem.children('span').hasClass(pieceColor));
    console.log(allowedSquares);
    markAllowedSquares();

}

function findBishopMoves(piece, colNumber, rowNumber){
    console.log('bishop moves');
    let pieceColor = piece.attr('data-color');
    let opponentColor = (pieceColor === 'white')? 'black': 'white';
    let i = 1;
    
    while((colNumber + i) <= 8 && (rowNumber + i) <=8 && !$(`.row-${rowNumber+i} .col-${colNumber+i}`)
    .children('span').hasClass(pieceColor)){
        let targetSqure = $(`.row-${rowNumber+i} .col-${colNumber+i}`);
        if(!pushAndDecideToContinue(targetSqure, opponentColor)) break;
        i++
    }

    i = 1;
    while(((colNumber - i) >= 1) && ((rowNumber - i) >=1) && !$(`.row-${rowNumber-i} .col-${colNumber-i}`)
    .children('span').hasClass(pieceColor)){
        let targetSqure = $(`.row-${rowNumber-i} .col-${colNumber-i}`);
        if(!pushAndDecideToContinue(targetSqure, opponentColor)) break;
        i++;
        
    }
    
    i = 1;
    while((colNumber + i) <= 8 && (rowNumber - i) >=1 && !$(`.row-${rowNumber-i} .col-${colNumber+i}`)
    .children('span').hasClass(pieceColor)){
        let targetSqure = $(`.row-${rowNumber-i} .col-${colNumber+i}`);
        if(!pushAndDecideToContinue(targetSqure, opponentColor)) break;
        i++;
    }

    i = 1;
    while(((colNumber - i) >=1) && ((rowNumber + i) <=8) && !$(`.row-${rowNumber+i} .col-${colNumber-i}`)
    .children('span').hasClass(pieceColor)){
        console.log(colNumber - i,rowNumber + i);
        let targetSqure = $(`.row-${rowNumber+i} .col-${colNumber-i}`);
        if(!pushAndDecideToContinue(targetSqure, opponentColor)) break;

        i++;
    }

    console.log(allowedSquares);    
    markAllowedSquares();
}

function findQueenMoves(piece, colNumber, rowNumber){
    findRookMoves(piece, colNumber, rowNumber,true);
}

function findKingMoves(piece, colNumber, rowNumber){
    console.log('king moves');
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
    if(selectedPiece.attr('data-piece')==='pawn'){
        selectedPiece.attr('data-first-move','0'); 
    }
    square.empty();
    selectedPiece.parent().removeClass('selectable-piece-container');
    // selectedPiece.remove();
    selectedPiece.css('top','0');
    selectedPiece.css('left','0');
    square.append(selectedPiece);
    square.addClass('selectable-piece-container piece-container');

    selectedPiece.draggable({
        disabled: false,
    });

    allowedSquares.forEach((square)=>{
        square.removeClass('allowable-squares piece-container ui-droppable attack');
    })

    allowedSquares.splice(0, allowedSquares.length);
}



    




