

//Drawing functions begin

var g_board;
var g_piece_img = 
{
    "s":"",
    "p":"images/bp.png",
    "r":"images/br.png",
    "n":"images/bn.png",
    "b":"images/bb.png",
    "k":"images/bk.png",
    "q":"images/bq.png",
    "P":"images/wp.png",
    "R":"images/wr.png",
    "N":"images/wn.png",
    "B":"images/wb.png",
    "K":"images/wk.png",
    "Q":"images/wq.png"
};
INITIAL_STATE = [
       ["r","n","b","q","k","b","n","r"],
       ["p","p","p","p","p","p","p","p"],
       ["s","s","s","s","s","s","s","s"],
       ["s","s","s","s","s","s","s","s"],
       ["s","s","s","s","s","s","s","s"],
       ["s","s","s","s","s","s","s","s"],
       ["P","P","P","P","P","P","P","P"],
       ["R","N","B","Q","K","B","N","R"]];

function ChessBoard() 
{
    //private
    this.hilited_i=-1;
    this.hilited_j=-1;
    this.whiteCell = "white_cell";
    this.blackCell = "black_cell";
    this.boardState ; 
    this.isWhiteMove = true;
    this.direction = 1; //1 for up -1 for down

    this.resetHilite = function()
    {
        var td = document.getElementById("td_"+this.hilited_i+"_"+this.hilited_j);
        if( (this.hilited_i+this.hilited_j) % 2 == 0)
            td.className = this.blackCell;
        else
            td.className = this.whiteCell;
        this.hilited_i=-1;
        this.hilited_j=-1;
    }

    this.getImageHtml = function(i,j,piece)
    {
        var idSuffix = i+'_'+j;
        var str = '<img';
        str += ' id="img_'+idSuffix+'"';
        str += ' class="piece_image"';
        str += ' border="0"';
        str += ' src="'+g_piece_img[piece]+'"';
        str += ' name="'+piece+'"';
        str += '/>';
        return str;
    }

    this.drawBoard = function() 
    {
       var i=0, j=0;
       for(i=0; i<8; i++) {
           for(j=0; j<8; j++) {
               var piece = this.boardState[i][j];
               if(piece != 's')
                   document.getElementById('td_'+i+"_"+j).innerHTML = this.getImageHtml(i,j,piece);
           }
       } 

    }

    this.getCellHtml = function(i,j,piece,isWhite) 
    {
        var idSuffix = i+'_'+j;
        var cls = isWhite?this.whiteCell:this.blackCell;
        var color = isWhite?"#FFFFFF":"#000000";

        var str = '<td';
        str += ' id="td_'+idSuffix+'"';
        str += ' class="'+cls+'"';
        str += ' valign="middle"';
        str += ' bgcolor="'+color+'"';
        str += ' align="center"';
        str += ' onclick="onClicked('+i+','+j+')"'
        str += '>';
     
        str += '</td>'
        return str;
    }

    this.createBoard = function()
    {
        var i=0, j=0;
        var board = '<table id="board_table" cellSpacing="0" cellPadding="0" style="height: 400px">';
        for(i=0; i<8; i++) {
            board += '<tr>';
            for(j=0; j<8; j++) {
                var isWhite = ((i+j)%2 == 1);
                board += this.getCellHtml(i,j,0,isWhite);
            }
            board += '</tr>';
        }
        board += '</table>'
        document.getElementById('board_div').innerHTML = board;

        this.boardState = INITIAL_STATE;
        this.drawBoard();
    }

    /*
    *@returns -1 for black, 1 for white, 0 for blank
    */
    this.getColor = function(i,j)
    {
        var piece = this.boardState[i][j];
        if(piece == 's')
            return 0;
        if(piece == piece.toLowerCase()) 
            return -1;
        return 1; 
    }
     
    this.validatePawnMove = function(srci, srcj, desti, destj)
    {
        var srcPiece = this.boardState[srci][srcj];
        var destPiece = this.boardState[desti][destj];
        
        var rDelta = srci - desti;
        var cDelta = Math.abs(destj - srcj);

        if(rDelta*this.direction<0 || rDelta>2 || cDelta>1)
            return false;

        if(rDelta==2 && (this.direction<0 && srci!=6) && (this.direction>0 && srci!=1)) 
            return false;
       
        if(cDelta==1 && !(this.getColor(srci,srcj)*this.getColor(desti,destj) < 0) ) 
            return false;

        return true;
    }

    this.validateRookMove = function(srci, srcj, desti, destj)
    {
        return true;
    }

    this.validateKnightMove = function(srci, srcj, desti, destj)
    {
        return true;
    }

    this.validateBishopMove = function(srci, srcj, desti, destj)
    {
        return true;
    }

    this.validateQueenMove = function(srci, srcj, desti, destj)
    {
        return true;
    }

    this.validateKingMove = function(srci, srcj, desti, destj)
    {
        return true;
    }

    this.validateMove = function(srci, srcj, desti, destj) 
    {
        var ret = true;
        var piece = this.boardState[srci][srcj];
        if(piece == 's')
            return false;

        if(this.isWhiteMove && piece==piece.toLowerCase())
            return false;
            
        if(!this.isWhiteMove && piece==piece.toUpperCase())
            return false;

        var str = piece.toLowerCase();
        switch(str) {
        case 'p':
            ret = this.validatePawnMove(srci, srcj, desti, destj);
            break;
        case 'r': 
            ret = this.validateRookMove(srci, srcj, desti, destj);
            break;
        case 'n':
            ret = this.validateKnightMove(srci, srcj, desti, destj);
            break;
        case 'b':
            ret = this.validateBishopMove(srci, srcj, desti, destj);
            break;
        case 'q':
            ret = this.validateQueenMove(srci, srcj, desti, destj);
            break;
        case 'k':
            ret = this.validateKingMove(srci, srcj, desti, destj);
            break;
        }
        return ret;
    }

    this.makeMoveUser = function(srci,srcj,desti,destj)
    {
        if(srci==desti && srcj==destj) {
            this.resetHilite();
            return;
        }
     
        if(!this.validateMove(srci, srcj, desti, destj)) {
            this.resetHilite();
            return;
        }

        //toggle turn
        this.isWhiteMove = !this.isWhiteMove;
        this.direction *= -1; 

        //change board state
        this.boardState[desti][destj] = this.boardState[srci][srcj]
        this.boardState[srci][srcj] = 's'
        
        //change board rendering
        var srcCell = document.getElementById("td_"+srci+"_"+srcj);
        var destCell = document.getElementById("td_"+desti+"_"+destj);
        destCell.innerHTML = srcCell.innerHTML;
        srcCell.innerHTML = ''; 

        //resetting hilited coordinates
        this.resetHilite();
    }

    this.hiliteSquare = function(i,j)
    {
        var hiliteClass = "highlight_white_cell";
        if((i+j)%2==0)
            hiliteClass = "highlight_black_cell";
        document.getElementById("td_"+i+"_"+j).className = hiliteClass;
        this.hilited_i = i;
        this.hilited_j = j;
    }

    this.onClicked = function(i,j)
    {
       if(this.hilited_i==-1) 
           this.hiliteSquare(i,j);
       else
           this.makeMoveUser(this.hilited_i, this.hilited_j, i, j);
    }

}

function init() 
{
    g_board = new ChessBoard();
    g_board.createBoard();
}

function onClicked(i,j)
{
    g_board.onClicked(i,j);
}
