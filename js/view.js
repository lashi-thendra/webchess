

// add col row attributes and classes 
$('.square').each((i, element)=>{
    let rowNumber = 7-i%8;
    let colNumber = Math.ceil((i+1)/8-1);
    $(element).attr('data-row', rowNumber);
    $(element).attr('data-col', colNumber );
    $(element).addClass(((i+1+ Math.floor((i)/8))%2==0)? "black-sqr": "white-sqr");
    $(element).addClass( `cr-${colNumber}-${rowNumber}`);
    $(element).droppable({desabled: 'true'});
});

// add pieces
for (let i = 0; i < 8; i++) {
    let pieceName;
    switch(i){
        case 0: pieceName = 'rook'; break;
        case 7: pieceName = 'rook'; break;
        case 1: pieceName = 'knight'; break;
        case 6: pieceName = 'knight'; break;
        case 2: pieceName = 'bishop'; break;
        case 5: pieceName = 'bishop'; break;
        case 3: pieceName = 'queen'; break;
        case 4: pieceName = 'king'; break;
    }
    
    addPiece('white', pieceName,$(`.cr-${i}-${0}`) );
    addPiece('black', pieceName,$(`.cr-${i}-${7}`) );
    addPiece('white', 'pawn',$(`.cr-${i}-${1}`) );
    addPiece('black', 'pawn',$(`.cr-${i}-${6}`) );
}

// add dragable for pieces
$('.white').each((i,elm)=>{
    let element = $(elm);
    element.draggable({
        revert: true, 
    });
});





function addPiece(color, pieceName, square){
    let pieceDiv = $('<div class="piece"></div>');
    pieceDiv.css('background-image', `url(img/${color}/${pieceName}.png)`);
    pieceDiv.addClass(color);
    square.append(pieceDiv);
}











