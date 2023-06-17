import {MAX_DEPTH, miniMax2} from "./ai.js";


export class Piece {
    isWhite;
    row;
    column;
    value;
    type;
    jqObj;
    previousSquare;
    isFirstMove;


    constructor(isWhite, row, column, value, type) {
        this.isWhite = isWhite;
        this.row = row;
        this.column = column;
        this.value = isWhite? value: -1*value;
        this.type = type;
        this.previousSquare = null;
        this.isFirstMove = true;
    }

    move(coordinates, board) {
        board.captured = false;
        board.removedPiece = board.squares[coordinates[0]][coordinates[1]];
        if (board.removedPiece) {
            board.captured = true;
            if (board.removedPiece.isWhite) {
                let index = board.whitePieces.indexOf(board.removedPiece);
                board.whitePieces.splice(index, 1);
            } else {
                let index = board.blackPieces.indexOf(board.removedPiece);
                board.blackPieces.splice(index, 1);
            }
        }


        board.squares[coordinates[0]][coordinates[1]] = this;
        board.squares[this.column][this.row] = null;

        this.previousSquare = [this.column, this.row];
        [this.column, this.row] = coordinates;
        if (this.isFirstMove) this.isFirstMove = false;
    }

    undoMove(board) {
        console.log("undo move ---");
        board.captured = false;
        board.squares[this.previousSquare[0]][this.previousSquare[1]] = this;
        if (board.removedPiece) {
            board.squares[this.column][this.row] = board.removedPiece;
            if (board.removedPiece.isWhite) {
                board.whitePieces.push(board.removedPiece);
            } else {
                board.blackPieces.push(board.removedPiece);
            }
        } else {
            board.squares[this.column][this.row] = null;
        }
        this.column = this.previousSquare[0];
        this.row = this.previousSquare[1];
    }

    restore(board) {
        board.squares[this.column][this.row] = this;
    }

}

export class Pawn extends Piece {
    constructor(isWhite, row, column) {
        super(isWhite, row, column, PAWN_VALUE, PAWN);
    }
    getAttackingSquares(board) {
        let increment = (this.isWhite) ? 1 : -1;

        let caculatedSquares = [];

        for (let i = 1; i < 3; i++) {
            let targetSqure = [this.column, this.row + increment * i];
            if (board.squares[this.column][this.row + increment * i]) break;
            if (i === 2 && !this.isFirstMove) break;
            caculatedSquares.push(targetSqure);
        }


        [[this.column + 1, this.row + increment], [this.column - 1, this.row + increment]].forEach((square) => {
            if (square[0] < 0 || square[0] > 7 || square[1] > 7) return;
            if (!board.squares[square[0]][square[1]]) return;
            if (board.squares[square[0]][square[1]].isWhite != this.isWhite) caculatedSquares.push(square);
        })

        return caculatedSquares;
    }
}

export class Rook extends Piece {
    isFirstMove;
    constructor(isWhite, row, column) {
        super(isWhite, row, column, ROOK_VALUE, ROOK);
    }
    getAttackingSquares(board) {
        let piece;
        let caculatedSquares = [];
        let squares = board.squares;
        let x = this.column;
        let y = this.row;

        [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach((arr) => {

            let i = arr[0];
            let j = arr[1];
            let t = 1;
            while (x + i * t >= 0 && x + i * t <= 7 && y + j * t >= 0 && y + j * t <= 7) {
                piece = squares[x + i * t][y + j * t];
                if (!piece) caculatedSquares.push([x + i * t, y + j * t]);
                else if (piece.isWhite != this.isWhite) {
                    caculatedSquares.push([x + i * t, y + j * t]);
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
    constructor(isWhite, row, column) {
        super(isWhite, row, column, BISHOP_VALUE, BISHOP);
    }

    getAttackingSquares(board) {

        let piece;
        let caculatedSquares = [];
        let squares = board.squares;
        let x = this.column;
        let y = this.row;

        [[1, 1], [1, -1], [-1, -1], [-1, 1]].forEach((arr) => {
            let i = arr[0];
            let j = arr[1];
            let t = 1;
            while (x + i * t >= 0 && x + i * t <= 7 && y + j * t >= 0 && y + j * t <= 7) {
                piece = squares[x + i * t][y + j * t];
                if (!piece) caculatedSquares.push([x + i * t, y + j * t]);
                else if (piece.isWhite != this.isWhite) {
                    caculatedSquares.push([x + i * t, y + j * t]);
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
    constructor(isWhite, row, column) {
        super(isWhite, row, column, KNIGHT_VALUE, KNIGHT);
    }
    getAttackingSquares(board) {

        let caculatedSquares = [];
        let row;
        let col;

        [[1, 2], [1, -2], [2, 1], [2, -1], [-1, 2], [-1, -2], [-2, 1], [-2, -1]].forEach(([i, j]) => {
            col = this.column + i;
            row = this.row + j;
            if (col < 0 || col > 7 || row > 7) return;
            let underAttack = board.squares[col][row];
            if( !underAttack || (underAttack.isWhite !== this.isWhite))caculatedSquares.push([col, row]);
        });

        return caculatedSquares;
    }
}

export class Queen extends Piece {
    constructor(isWhite, row, column) {
        super(isWhite, row, column, QUEEN_VALUE, QUEEN);
    }
    getAttackingSquares(board) {
        let piece;
        let caculatedSquares = [];
        let squares = board.squares;
        let x = this.column;
        let y = this.row;

        [[1, 1], [1, -1], [-1, -1], [-1, 1], [0, 1], [0, -1], [1, 0], [-1, 0]].forEach((arr) => {
            let i = arr[0];
            let j = arr[1];
            let t = 1;
            while (x + i * t >= 0 && x + i * t <= 7 && y + j * t >= 0 && y + j * t <= 7) {
                piece = squares[x + i * t][y + j * t];
                if (!piece) caculatedSquares.push([x + i * t, y + j * t]);
                else if (piece.isWhite != this.isWhite) {
                    caculatedSquares.push([x + i * t, y + j * t]);
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
    constructor(isWhite, row, column) {
        super(isWhite, row, column, KING_VALUE, KING);
    }
    getAttackingSquares(board) {
        let piece;
        let caculatedSquares = [];
        let squares = board.squares;
        let x = this.column;
        let y = this.row;

        [[1, 1], [1, -1], [-1, -1], [-1, 1], [0, 1], [0, -1], [1, 0], [-1, 0]].forEach((arr) => {
            let i = arr[0];
            let j = arr[1];
            let t = 1;
            if (x + i * t >= 0 && x + i * t <= 7 && y + j * t >= 0 && y + j * t <= 7) {
                piece = squares[x + i * t][y + j * t];
                if (!piece) caculatedSquares.push([x + i * t, y + j * t]);
                else if (piece.isWhite != this.isWhite) {
                    caculatedSquares.push([x + i * t, y + j * t]);
                }
            }
        });
        return caculatedSquares;
    }
}

export class Board {
    squares = new Array(8);
    whitePieces = [];
    blackPieces = [];
    removedPiece = null;
    inCheck = null;
    blackKing;
    whiteKing;
    captured = false;

    constructor() {
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
            if (i == 7 || i == 0) j = 0;
            if (i == 6 || i == 1) j = 1;
            if (i == 5 || i == 2) j = 2;
            if (i == 3) j = 3;
            if (i == 4) j = 4;

            switch (j) {
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
                    this.whiteKing = this.squares[i][0];
                    this.blackKing = this.squares[i][7];
                    this.#pushPieces(this.squares[i][0], this.squares[i][7]);
                    break;
            }
        }
        console.log(this)
    }

    #pushPieces(white, black) {
        this.blackPieces.push(black);
        this.whitePieces.push(white);
    }


    findPossibleSquares(coordinates) {
        let piece = this.squares[coordinates[0]][coordinates[1]];
        let unFiltered = piece.getAttackingSquares(this);

        let emptySqrs = unFiltered.filter((sqr) => {
            return this.squares[sqr[0]][sqr[1]] === null;
        });

        let enemySqrs = unFiltered.filter((sqr) => {
            if (!this.squares[sqr[0]][sqr[1]]) return false;
            return (this.squares[sqr[0]][sqr[1]].isWhite != piece.isWhite);
        });

        return [emptySqrs, enemySqrs];
    };

    movePiece(selectedPieceCor, coordinates) {

        let piece = this.squares[selectedPieceCor[0]][selectedPieceCor[1]];
        let isWhite = piece.isWhite;
        piece.move(coordinates, this);
        if (this.kingUnderAttack(isWhite)) {
            console.log("illegal move");
            piece.undoMove(this);
            return ILLEGAL_MOVE;
        }

        let checkState = this.checkForCheck(isWhite);
        console.warn("check state:",checkState);
        let noLegalMoves = this.noLegalMoves(isWhite);
        console.warn("no legal moves:",noLegalMoves);
        if(checkState && noLegalMoves) {
            console.warn("check state and noLegalMoves", checkState, noLegalMoves);
            if(checkState === WHITE_IN_CHECK) return BLACK_WIN;
            else return WHITE_WIN;
        };
        console.warn("returning checkstate", checkState);
        if(checkState) return checkState;
        if(this.captured) return CAPTURE;
        return SIMPLE_MOVE;
    }

    kingUnderAttack(isWhite) {
        if (isWhite) {
            for (const piece of this.blackPieces) {
                const attackingSquares = piece.getAttackingSquares(this);
                for (const sqr of attackingSquares) {
                    if (this.squares[sqr[0]][sqr[1]] === this.whiteKing) {
                        return true;
                    }
                }
            }
        } else {
            for (const piece of this.whitePieces) {
                const attackingSquares = piece.getAttackingSquares(this);
                for (const sqr of attackingSquares) {
                    if (this.squares[sqr[0]][sqr[1]] === this.blackKing) {
                        return true;
                    }
                }
            }
        }

        return false;

    };

    checkForCheck(isWhite) {
        let isInCheck = this.kingUnderAttack(!isWhite);
        if (isInCheck) {
            if (isWhite) {
                console.log("black in check");
                this.inCheck = BLACK_IN_CHECK;
                return BLACK_IN_CHECK;
            }
            else {
                console.log("white in check");
                this.inCheck = WHITE_IN_CHECK;
                return WHITE_IN_CHECK;
            }
        }
        return false;
    }

    noLegalMoves(whitesMove){
        let hValue = miniMax2(MAX_DEPTH-2, !whitesMove, this);
        console.warn("calculating for legal moves with hvalue:",hValue);
        if(hValue === 10000 || hValue === -10000){
            console.log("draw");
            return DRAW;
        }
        else return false;
    }

}

