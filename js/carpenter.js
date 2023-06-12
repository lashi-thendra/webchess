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
    jqObj;
    previousSquare;
    isFirstMove;


    constructor(isWhite,row, column, value, type){
        this.isWhite = isWhite;
        this.row = row;
        this.column = column;
        this.value = value;
        this.type = type;
        this.previousSquare = null;
        this.isFirstMove = true;
    }

    move(coordinates, board){
        board.removedPiece =  board.squares[coordinates[0]][coordinates[1]];
        board.squares[coordinates[0]][coordinates[1]] = this;
        board.squares[this.column][this.row] = null;
        this.previousSquare = [this.column, this.row];
        [this.column, this.row] = coordinates;
        if(this.isFirstMove) this.isFirstMove = false;
        console.log(board.squares);
    }

}

export class Pawn extends Piece {
    constructor(isWhite, row, column){
        super (isWhite, row, column, PAWN_VALUE, PAWN);
    }
    getAttackingSquares(board){
        let increment = (this.isWhite)? 1:-1;

        let caculatedSquares = [];


        for(let i = 1; i < 3 ; i ++){
            let targetSqure = [this.column, this.row+increment*i];
            if(board.squares[this.column][this.row+increment*i]) break;
            if(i===2 && !this.isFirstMove) break;
            caculatedSquares.push(targetSqure);
            
        }

    
        [[this.column+1, this.row+increment],[this.column-1, this.row+increment]].forEach((square)=>{
            if(square[0]<0 || square[0]>7 || square[1] >7) return;
            if(!board.squares[square[0]][square[1]]) return;
            if(board.squares[square[0]][square[1]].isWhite != this.isWhite) caculatedSquares.push(square);
        })

        return caculatedSquares;
    }
}

export class Rook extends Piece {
    isFirstMove;
    constructor(isWhite,  row, column){
        super (isWhite,  row, column, ROOK_VALUE, ROOK);
    }
    getAttackingSquares(board){
        let piece;
        let caculatedSquares = [];
        let squares = board.squares;
        let x = this.column;
        let y = this.row;

        [[0,1],[0,-1],[1,0],[-1,0]].forEach((arr)=>{
            console.log("ireation starting");
            let i = arr[0];
            let j = arr[1];
            let t = 1;
            while( x+i*t >= 0 && x+i*t <= 7 && y+j*t >= 0 && y+j*t <= 7 ){
                piece = squares[x+i*t][y+j*t];
                if(!piece) caculatedSquares.push([x+i*t,y+j*t]);
                else if(piece.isWhite != this.isWhite){
                    caculatedSquares.push([x+i*t,y+j*t]);
                    break;
                } 
                else break;
                t += 1;
            }
        });
        return caculatedSquares;

    }
}

export class Bishop extends Piece {
    constructor(isWhite,  row, column){
        super (isWhite,  row, column, BISHOP_VALUE, BISHOP);
    }
    
    getAttackingSquares(board){
    
        let piece;
        let caculatedSquares = [];
        let squares = board.squares;
        let x = this.column;
        let y = this.row;

        [[1,1],[1,-1],[-1,-1],[-1,1]].forEach((arr)=>{
            console.log("ireation starting");
            let i = arr[0];
            let j = arr[1];
            let t = 1;
            while( x+i*t >= 0 && x+i*t <= 7 && y+j*t >= 0 && y+j*t <= 7 ){
                piece = squares[x+i*t][y+j*t];
                if(!piece) caculatedSquares.push([x+i*t,y+j*t]);
                else if(piece.isWhite != this.isWhite){
                    caculatedSquares.push([x+i*t,y+j*t]);
                    break;
                } 
                else break;
                t += 1;
            }
        });
        return caculatedSquares;

    }
}

export class Knight extends Piece {
    isFirstMove;
    constructor(isWhite,  row, column){
        super (isWhite,  row, column, KNIGHT_VALUE, KNIGHT);
    }
    getAttackingSquares(){

        let caculatedSquares = [];
        let row;
        let col;

        [[1,2],[1,-2],[2,1],[2,-1],[-1,2],[-1,-2],[-2,1],[-2,-1]].forEach(([i,j])=>{
            col = this.column + i;
            row = this.row + j;
            if(col<0 || col>7 || row >7) return;
            caculatedSquares.push([col, row]);
        });

        return caculatedSquares;

    }
}

export class Queen extends Piece {
    constructor(isWhite,  row, column){
        super (isWhite,  row, column, QUEEN_VALUE, QUEEN);
    }
    getAttackingSquares(board){
        let piece;
        let caculatedSquares = [];
        let squares = board.squares;
        let x = this.column;
        let y = this.row;

        [[1,1],[1,-1],[-1,-1],[-1,1],[0,1],[0,-1],[1,0],[-1,0]].forEach((arr)=>{
            console.log("ireation starting");
            let i = arr[0];
            let j = arr[1];
            let t = 1;
            while( x+i*t >= 0 && x+i*t <= 7 && y+j*t >= 0 && y+j*t <= 7 ){
                piece = squares[x+i*t][y+j*t];
                if(!piece) caculatedSquares.push([x+i*t,y+j*t]);
                else if(piece.isWhite != this.isWhite){
                    caculatedSquares.push([x+i*t,y+j*t]);
                    break;
                } 
                else break;
                t += 1;
            }
        });
        return caculatedSquares;
    }
}

export class King extends Piece {
    constructor(isWhite,  row, column){
        super (isWhite,  row, column, KING_VALUE, KING);
    }
        getAttackingSquares(board){
        let piece;
        let caculatedSquares = [];
        let squares = board.squares;
        let x = this.column;
        let y = this.row;

        [[1,1],[1,-1],[-1,-1],[-1,1],[0,1],[0,-1],[1,0],[-1,0]].forEach((arr)=>{
            console.log("ireation starting");
            let i = arr[0];
            let j = arr[1];
            let t = 1;
            if( x+i*t >= 0 && x+i*t <= 7 && y+j*t >= 0 && y+j*t <= 7 ){
                piece = squares[x+i*t][y+j*t];
                if(!piece) caculatedSquares.push([x+i*t,y+j*t]);
                else if(piece.isWhite != this.isWhite){
                    caculatedSquares.push([x+i*t,y+j*t]);
                } 
            }
        });
        return caculatedSquares;
    }
}

export class Board {
    isUnderCheck;
    squares = new Array(8);
    whitePieces = [];
    blackPieces = [];
    removedPiece = null;

    constructor(){
        this.squares = new Array(8);
        // adding 8 cols with 8 rows in each
        for (let i = 0; i < 8; i++) {
            this.squares[i] = new Array(8).fill(null);
        }

        for (let i = 0; i < 8; i++) {
            this.squares[i][1] = new Pawn(true, 1, i);
            this.squares[i][6] = new Pawn(false, 6, i);
            this.whitePieces.push(this.squares[i][1]);
            this.blackPieces.push(this.squares[i][6]);

            let j;
            if(i == 7 || i == 0) j = 0;
            if(i == 6 || i == 1) j = 1;
            if(i == 5 || i == 2) j = 2;
            if(i == 3) j = 3;
            if(i == 4) j = 4;

            switch(j){
                case 0: 
                this.squares[i][0] = new Rook(true, 0, i);
                this.squares[i][7] = new Rook(false, 7, i);
                this.#pushPieces(this.squares[i][0], this.squares[i][7]);
                break;
                case 1: 
                this.squares[i][0] = new Knight(true, 0, i);
                this.squares[i][7] = new Knight(false, 7, i);
                this.#pushPieces(this.squares[i][0], this.squares[i][7]);
                break;
                case 2: 
                this.squares[i][0] = new Bishop(true, 0, i);
                this.squares[i][7] = new Bishop(false, 7, i);
                this.#pushPieces(this.squares[i][0], this.squares[i][7]);
                break;
                case 3: 
                this.squares[i][0] = new Queen(true, 0, i);
                this.squares[i][7] = new Queen(false, 7, i);
                this.#pushPieces(this.squares[i][0], this.squares[i][7]);
                break;
                case 4: 
                this.squares[i][0] = new King(true, 0, i);
                this.squares[i][7] = new King(false, 7, i);
                this.#pushPieces(this.squares[i][0], this.squares[i][7]);
                break;
            }
        }
    }

    #pushPieces(white, black){
        this.blackPieces.push(black);
        this.whitePieces.push(white);
    }


    findPossibleSquares(coordinates){
        let piece = this.squares[coordinates[0]][coordinates[1]];
        let unFiltered =  piece.getAttackingSquares(this);

        let emptySqrs = unFiltered.filter((sqr)=>{
            return this.squares[sqr[0]][sqr[1]] === null;
        });

        let enemySqrs =  unFiltered.filter((sqr)=>{
            if(!this.squares[sqr[0]][sqr[1]]) return false;
            return (this.squares[sqr[0]][sqr[1]].isWhite != piece.isWhite);
        });
        
        return [emptySqrs, enemySqrs];
    };

    movePiece(selectedPieceCor, coordinates){        
        let piece = this.squares[selectedPieceCor[0]][selectedPieceCor[1]];
        piece.move(coordinates, this);
        return null;
    }

    validateMove(){

    };
    isDraw;
    isMath;
    findWinner;

    clearSelections;

}

