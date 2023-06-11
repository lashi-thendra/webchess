
// add col row attributes and classes 
$('.square').each((i, element)=>{
    let rowNumber = 8-i%8;
    let colNumber = Math.ceil((i+1)/8);
    $(element).attr('data-row', rowNumber);
    $(element).attr('data-col', colNumber );
    $(element).addClass(((i+1+ Math.floor((i)/8))%2==0)? "black": "white");
    $(element).addClass( `rc-${rowNumber}-${colNumber}`);
});

// add pieces
for (let i = 1; i <= 8; i++) {
    let pieceName;
    switch(i){
        case 1: pieceName = 'rook'; break;
        case 8: pieceName = 'rook'; break;
        case 2: pieceName = 'bishop'; break;
        case 7: pieceName = 'bishop'; break;
        case 3: pieceName = 'knight'; break;
        case 6: pieceName = 'knight'; break;
        case 4: pieceName = 'queen'; break;
        case 5: pieceName = 'king'; break;
    }
    
    addPiece('white', pieceName,$(`.rc-${1}-${i}`) );
    addPiece('black', pieceName,$(`.rc-${8}-${i}`) );
    addPiece('white', 'pawn',$(`.rc-${2}-${i}`) );
    addPiece('black', 'pawn',$(`.rc-${7}-${i}`) );
}


$('.piece').each((i,elm)=>{
    let element = $(elm);
    element.draggable({
        revert: 'invalid', 
    })
});


function addPiece(color, pieceName, square){
    let pieceDiv = $('<div class="piece"></div>');
    pieceDiv.css('background-image', `url(../img/${color}/${pieceName}.png)`);
    square.append(pieceDiv);
}









