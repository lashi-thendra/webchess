const PAWN_VALUE = 1;
const ROOK_VALUE = 5;
const KNIGHT_VALUE = 3;
const BISHOP_VALUE = 3;
const QUEEN_VALUE = 9;
const KING_VALUE = 10000;

const PAWN = 1;
const ROOK = 2;
const KNIGHT = 3;
const BISHOP = 4;
const QUEEN= 5;
const KING = 6;

export class Piece {
    isWhite;
    row;
    column;
    value;
    type;

    constructor(isWhite, square, row, column, value, type){
        this.isWhite = isWhite;
        this.square = square;
        this.row = row;
        this.column = column;
        this.value = value;
        this.type = type;
    }
}

export class Pawn extends Piece {
    isFirstMove;
    constructor(isWhite, square, row, column){
        super (isWhite, square, row, column, PAWN_VALUE, PAWN);
    }
    getAttackingSquares(){

    }
}

export class Rook extends Piece {
    isFirstMove;
    constructor(isWhite, square, row, column){
        super (isWhite, square, row, column, ROOK_VALUE, ROOK);
    }
    getAttackingSquares(){

    }
}

export class bishop extends Piece {
    constructor(isWhite, square, row, column){
        super (isWhite, square, row, column, BISHOP_VALUE, BISHOP);
    }
    
    getAttackingSquares(){

    }
}

export class Knight extends Piece {
    isFirstMove;
    constructor(isWhite, square, row, column){
        super (isWhite, square, row, column, KNIGHT_VALUE, KNIGHT);
    }
    getAttackingSquares(){

    }
}

export class queen extends Piece {
    constructor(isWhite, square, row, column){
        super (isWhite, square, row, column, QUEEN_VALUE, QUEEN);
    }
    getAttackingSquares(){
        
    }
}

export class King extends Piece {
    constructor(isWhite, square, row, column){
        super (isWhite, square, row, column, KING_VALUE, KING);
    }
    getAttackingSquares(){

    }
}

export class Board {
    isUnderCheck;
    squares = new Array(8);
    whitePieces = new Array(16);
    blackPieces = new Array(16);

    constructor(){
        this.squares = new Array(8);
        for (let i = 1; i <= 8; i++) {
            this.squares[i] = new Array(8);
        }


    }

    validateMove;
    isDraw;
    isMath;
    findWinner;

    clearSelections;

}

let board = new Board();
console.log(board.squares);

