
// add col row attributes and classes 
$('.square').each((i, element)=>{
    let rowNumber = 8-i%8;
    let colNumber = Math.ceil((i+1)/8);
    $(element).attr('data-row', rowNumber);
    $(element).attr('data-col', colNumber );
    $(element).addClass(((i+1+ Math.floor((i)/8))%2==0)? "black": "white");
    $(element).addClass( `row-${rowNumber} col-${colNumber}`);
});

// add pieces
$('.row-2').each((i,element)=>{
    addPiece('white','pawn',$(element));
});

$('.row-7').each((i,element)=>{
    addPiece('black','pawn',$(element));
});




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









