class Board {
    isUnderCheck;
    squares;

    constructor(){
        this.squares = new Array(8);
        for (let index = 0; index <= 8; index++) {
            this.squares[i] = new Array(8);
        }
    }

    selectSquares();
    clearSelections();
    movePiece();
    isDraw();
    isMate();
    findWinner();
    

}

class Piece {
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
    
    getAttackingSquares(){

    };
    changePosition(square){
        
    };
}

class Pawn extends Piece {
    isFirstMove;
    constructor(isWhite, square, row, column){
        super (isWhite, square, row, column, value, type)
    }
    getAttackingSquares(){

    }
}

class Rook extends Piece {
    isFirstMove;
    constructor(isWhite, square, row, column){
        super (isWhite, square, row, column, value, type)
    }
    getAttackingSquares(){

    }
}

class bishop extends Piece {
    getAttackingSquares(){

    }
}

class Knight extends Piece {
    getAttackingSquares(){}
}

class queen extends Piece {
    getAttackingSquares(){}
}

class King extends Piece {
    getAttackingSquares(){}
}