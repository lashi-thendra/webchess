const ILLEGAL_MOVE = "Illegal move";
const SIMPLE_MOVE = "move";
const CAPTURE = "capture";
const WHITE_IN_CHECK = "white in check";
const BLACK_IN_CHECK = "black in check";
const DRAW = "draw";
const BLACK_WIN = "black win";
const WHITE_WIN = "white win";
const PROMOTION_W = 'white promotion';
const PROMOTION_B = 'black promotion';
const PROMO_W_CHECK = 'white promo + check';
const PROMO_B_CHECK = 'black promo + check';
const PROMO_W_CAP = 'white promo + capture';
const PROMO_B_CAP = 'black promo + capture';

const PAWN_VALUE = 1;
const ROOK_VALUE = 5;
const KNIGHT_VALUE = 3;
const BISHOP_VALUE = 3;
const QUEEN_VALUE = 9;
const KING_VALUE = 100;


const PAWN = "P";
const ROOK = "R";
const KNIGHT = "N";
const BISHOP = "B";
const QUEEN = "Q";
const KING = "K";

let maxDepth = 3;
let gameInOn = true;