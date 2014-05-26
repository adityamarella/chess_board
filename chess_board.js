

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

INITIAL_STATE_SIT_BLACK = [
       ["R","N","B","K","Q","B","N","R"],
       ["P","P","P","P","P","P","P","P"],
       ["s","s","s","s","s","s","s","s"],
       ["s","s","s","s","s","s","s","s"],
       ["s","s","s","s","s","s","s","s"],
       ["s","s","s","s","s","s","s","s"],
       ["p","p","p","p","p","p","p","p"],
       ["r","n","b","k","q","b","n","r"]];

INITIAL_STATE_SIT_WHITE = [
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
    //constants
    this.whiteCell = "white_cell";
    this.blackCell = "black_cell";

    //private
    this.prevDesti = -1;
    this.prevDestj = -1;
    this.prevSrci = -1; 
    this.prevSrcj = -1;

    //stores the selected piece coordinates
    this.clickedi = -1;
    this.clickedj = -1;
    //maintains the piece selection state
    this.clicked = false ; 

    //stores the current boardstate 
    this.boardState ;
 
    this.isWhiteMove = true;

    //if initial board state is INITIAL_STATE_SIT_BLACK
    //then initial direction should be -1 
    //else 1
    //this variable is initialized in createBoard function
    this.direction ; //1 for up -1 for down

    //castling state
    this.white_can_oo = true;
    this.white_can_ooo = true;
    this.black_can_oo = true;
    this.black_can_ooo = true;

    this.resetHilite = function()
    {
        if(this.prevDesti==-1)
            return;
        
        var td = document.getElementById("td_"+this.prevDesti+"_"+this.prevDestj);
        if( (this.prevDesti+this.prevDestj) % 2 == 0)
            td.className = this.blackCell;
        else
            td.className = this.whiteCell;

        if(this.prevSrci==-1)
            return;

        td = document.getElementById("td_"+this.prevSrci+"_"+this.prevSrcj);
        if( (this.prevSrci+this.prevSrcj) % 2 == 0)
            td.className = this.blackCell;
        else
            td.className = this.whiteCell;

        if(this.clickedi==-1)
            return;
        td = document.getElementById("td_"+this.clickedi+"_"+this.clickedj);
        if( (this.clickedi+this.clickedj) % 2 == 0)
            td.className = this.blackCell;
        else
            td.className = this.whiteCell;
    }

    this.createControls = function() 
    {
        var str = '<table border="0" cellspacing="0" cellpadding="0">';
        str += '<tr>';
        str += '<td>';
        str += '<input type="BUTTON" onfocus="this.blur()" onclick="javascript:moveToStart()" title="go to game start" value="<<" id="startButton">';
        str += '</td>';

        str += '<td width="3">';
        str += ''
        str += '</td>';

        str += '<td>';
        str += '<input type="BUTTON" onfocus="this.blur()" onclick="javascript:moveBack()" title="move backward" value="<" id="backButton">';
        str += '</td>';

        str += '<td width="3">';
        str += ''
        str += '</td>';

        str += '<td>';
        str += '-';
        str += '</td>';

        str += '<td width="3">';
        str += ''
        str += '</td>';

        str += '<td>';
        str += '<input type="BUTTON" onfocus="this.blur()" onclick="javascript:moveForward()" title="move forward" value=">" id="forwardButton">';
        str += '</td>';

        str += '<td width="3">';
        str += ''
        str += '</td>';

        str += '<td>';
        str += '<input type="BUTTON" onfocus="this.blur()" onclick="javascript:moveToEnd()" title="go to game end" value=">>" id="endButton">';
        str += '</td>';

        str += '</tr>';
        str += '</table>'; 
        document.getElementById('board_controls').innerHTML = str; 
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

    this.createBoard = function(boardState, direction)
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

        this.boardState = boardState;
        this.direction = direction;
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
   
    //!isSameColor() is not same as isDifferentColor() 
    this.isSameColor = function(srci, srcj, desti, destj)
    {
        return this.getColor(srci,srcj)*this.getColor(desti,destj) > 0;
    }
 
    this.isDifferentColor = function(srci, srcj, desti, destj)
    {
        return this.getColor(srci,srcj)*this.getColor(desti,destj) < 0;
    }

    this.attackedByWhite = function(i,j)
    {
        var state = this.boardState[i][j];
        this.boardState[i][j] = 'p';
        var p, q;
        for(p=0; p<8; p++) {
            for(q=0; q<8; q++) {
                var piece = this.boardState[p][q];
                if(piece!='s' && piece == piece.toUpperCase()) {
                    if(this.validMove(p,q,i,j)) {
                        this.boardState[i][j] = state;
                        return true;    
                    }
                }
            }
        }
        this.boardState[i][j] = state;
        return false;
    }

    this.attackedByBlack = function(i,j)
    {
        var state = this.boardState[i][j];
        this.boardState[i][j] = 'P';
        var p, q;
        for(p=0; p<8; p++) {
            for(q=0; q<8; q++) {
                var piece = this.boardState[p][q];
                if(piece!='s' && piece == piece.toLowerCase()) {
                    if(this.validMove(p,q,i,j)) {
                        this.boardState[i][j] = state;
                        return true;    
                    }
                }
            }
        }
        this.boardState[i][j] = state;
        return false;
    }

    this.hasBlockadeI = function(i1,i2,j)
    {
        var p,d;
        if(i2-i1 > 0)
            d=1;
        else
            d=-1;

        for(p=i1+d; p!=i2; p+=d) {
            if(this.boardState[p][j]!='s') {
                return true;
            }
        }
        return false;     
    }
     
    this.hasBlockadeJ = function(j1,j2,i)
    {
        var p;
        if(j2-j1 > 0)
            d=1;
        else
            d=-1;
        for(p=j1+d; p!=j2; p+=d) {
            if(this.boardState[i][p]!='s') {
                return true;
            }
        }
        return false;     
    }
 
    this.hasDiagonalBlockade = function(i1,j1,i2,j2)
    {
        var di = (i2-i1)>0?1:-1;
        var dj = (j2-j1)>0?1:-1;

        var len = Math.abs(i2-i1);
        var i = i1, j = j1;
        var p;
        for(p=1; p<len; p++) {
            i += di; j += dj;
            if(this.boardState[i][j]!='s') {
                return true;
            }
        }
        return false;
    }

    this.validPawnMove = function(srci, srcj, desti, destj)
    {
        var iDelta = Math.abs(srci - desti);
        var jDelta = Math.abs(destj - srcj);

        if((srci-desti)*this.direction<0 || iDelta>2 || jDelta>1)
            return false;

        if(jDelta==1 && iDelta==0)
            return false;

        if(iDelta==2 && !((this.direction>0 && srci==6) || (this.direction<0 && srci==1)) )
            return false;

        if(jDelta==0 && iDelta==1 && this.isDifferentColor(srci, srcj, desti, destj))
            return false;
       
        if(iDelta==1 && jDelta==1 ) {
            //enpassant check
            var prevSrci = this.prevSrci, prevSrcj = this.prevSrcj, prevDesti = this.prevDesti, prevDestj = this.prevDestj;
            if(prevSrcj == destj && prevDestj == destj && 
               (prevSrci==6 || prevSrci==1) &&
               Math.abs(prevSrci-prevDesti)==2) {
                //kill the opponent pawn 
                var cell = document.getElementById("td_"+prevDesti+"_"+prevDestj);
                cell.innerHTML = "";
                this.boardState[prevDesti][prevDestj] = 's';
            } 
            else { 
                if(!this.isDifferentColor(srci, srcj, desti, destj)) 
                    return false;
            }
        }
 
        return true;
    }

    this.validRookMove = function(srci, srcj, desti, destj)
    {
        var iDelta = Math.abs(srci - desti);
        var jDelta = Math.abs(srcj - destj);
       
        if(iDelta * jDelta != 0)
            return false;

        if(iDelta==0 && this.hasBlockadeJ(srcj,destj,srci))
            return false;        

        if(jDelta==0 && this.hasBlockadeI(srci,desti,srcj))
            return false;

        //take away castling privileges
        if(this.isWhiteMove) {
            if(this.direction==1) {
                if(srcj==7)
                    this.white_can_oo = false; 
                if(srcj==0)
                    this.white_can_ooo = false; 
            } else {
                if(srcj==7)
                    this.white_can_ooo = false; 
                if(srcj==0)
                    this.white_can_oo = false; 
            }
        } else {
            if(this.direction==1) {
                if(srcj==7)
                    this.black_can_ooo = false; 
                if(srcj==0)
                    this.black_can_oo = false; 
            } else {
                if(srcj==7)
                    this.black_can_oo = false; 
                if(srcj==0)
                    this.black_can_ooo = false; 
            }
        } 
        return true;
    }

    this.validKnightMove = function(srci, srcj, desti, destj)
    {
        var iDelta = Math.abs(srci - desti);
        var jDelta = Math.abs(srcj - destj);

        if( (iDelta == 2 && jDelta == 1) || (iDelta==1 && jDelta==2) )
            return true;
        return false;
    }

    this.validBishopMove = function(srci, srcj, desti, destj)
    {

        var iDelta = Math.abs(srci - desti);
        var jDelta = Math.abs(srcj - destj);
 
        if(iDelta!=jDelta)
            return false;
 
        if(this.hasDiagonalBlockade(srci,srcj,desti,destj))
            return false; 
       
        return true;
    }

    this.validQueenMove = function(srci, srcj, desti, destj)
    {
        return this.validRookMove(srci, srcj, desti, destj) || this.validBishopMove(srci, srcj, desti, destj);
    }

    //util function
    this.checkRowAttack = function(row, a, b)
    {
        var j;
        for(j=a; j<b; j++) { 
            if(this.isWhiteMove && this.attackedByBlack(row,j)) {
                return true; 
            }
            if(!this.isWhiteMove && this.attackedByWhite(row,j)) {
                return true; 
            }
        }
        return false;
    }

    this.validKingMove = function(srci, srcj, desti, destj)
    {
        var iDelta = Math.abs(srci - desti);
        var jDelta = Math.abs(srcj - destj);
        
        if(iDelta>1)
            return false;
     
        if(jDelta>2)
            return false;
       
        //check if king is trying to castle
        if(jDelta==2) {
            var canoo = this.isWhiteMove?this.white_can_oo:this.black_can_oo;
            var canooo = this.isWhiteMove?this.white_can_ooo:this.black_can_ooo;
            var rookSrcPositionj = 0; 
            var rookDestPositionj = 0; 
            var flag = true;
            if(canooo && srcj==3 && destj==5) {
                //check if srcj to 7 squares are attacked
                if(this.checkRowAttack(srci,srcj,8))
                    flag = false;
                rookSrcPositionj = 7;
                rookDestPositionj = 4;
            } else if(canooo && srcj==4 && destj==2) {
                //check if srcj to 0 squares are attacked
                if(this.checkRowAttack(srci,0,srcj))
                    flag = false;
                rookSrcPositionj = 0;
                rookDestPositionj = 3;
            } else if(canoo && srcj==3 && destj==1) {
                //check if srcj to 0 squares are attacked
                if(this.checkRowAttack(srci,0,srcj))
                    flag = false;
                rookSrcPositionj = 0;
                rookDestPositionj = 2;
            } else if(canoo && srcj==4 && destj==6) {
                //check if srcj to 7 squares are attacked
                if(this.checkRowAttack(srci,srcj,8))
                    flag = false;
                rookSrcPositionj = 7;
                rookDestPositionj = 5;
            } else {
                flag = false;
            }
            if(!flag)
                return false;
            else {
                //move the rook
                var srcCell = document.getElementById("td_"+srci+"_"+rookSrcPositionj);
                var destCell = document.getElementById("td_"+srci+"_"+rookDestPositionj);
                destCell.innerHTML = srcCell.innerHTML;
                srcCell.innerHTML = '';
                this.boardState[srci][rookDestPositionj] = this.boardState[srci][rookSrcPositionj];
                this.boardState[srci][rookSrcPositionj] = 's';
            }
        }

        if(this.isWhiteMove && this.attackedByBlack(desti, destj))
            return false;
        
        if(!this.isWhiteMove && this.attackedByWhite(desti, destj))
            return false;
         
 
        //take away castling privileges 
        if(this.isWhiteMove) {
            this.white_can_oo = false;
            this.white_can_ooo = false;
        } else {
            this.black_can_oo = false;
            this.black_can_ooo = false;
        }
        return true;
    }

    this.validMove = function(srci, srcj, desti, destj) 
    {
        var ret = true;
        var piece = this.boardState[srci][srcj];

        if(this.isDifferentColor(srci,srcj,desti,destj) && this.boardState[desti][destj].toLowerCase()=='k')
            return false;

        if(this.isSameColor(srci,srcj,desti,destj))
            return false;

        var str = piece.toLowerCase();
        switch(str) {
        case 'p':
            ret = this.validPawnMove(srci, srcj, desti, destj);
            break;
        case 'r': 
            ret = this.validRookMove(srci, srcj, desti, destj);
            break;
        case 'n':
            ret = this.validKnightMove(srci, srcj, desti, destj);
            break;
        case 'b':
            ret = this.validBishopMove(srci, srcj, desti, destj);
            break;
        case 'q':
            ret = this.validQueenMove(srci, srcj, desti, destj);
            break;
        case 'k':
            ret = this.validKingMove(srci, srcj, desti, destj);
            break;
        }
        return ret;
    }

    this.makeMoveUser = function(srci,srcj,desti,destj)
    {
        if(srci==desti && srcj==destj) {
            return false;
        }
     
        if(!this.validMove(srci, srcj, desti, destj)) {
            return false;
        }

        //make the move 
        this.boardState[desti][destj] = this.boardState[srci][srcj];
        this.boardState[srci][srcj] = 's';
        
        //check if this move is bringing the king under attack
        var x = this.findPieceCoordinates((this.isWhiteMove?'K':'k'));
        var attacked = false;
        if(this.isWhiteMove)
            attacked = this.attackedByBlack(x[0], x[1]); 
        else
            attacked = this.attackedByWhite(x[0], x[1]);
        if(attacked) { 
            //revert move and return
            this.boardState[srci][srcj] = this.boardState[desti][destj];
            this.boardState[desti][destj] = 's';
            return false;
        }

        //convert move to pgn notation
        this.getPGNMove(srci,srcj,desti,destj);

        //toggle turn
        this.isWhiteMove = !this.isWhiteMove;
        this.direction *= -1; 
        
        //change board rendering
        var srcCell = document.getElementById("td_"+srci+"_"+srcj);
        var destCell = document.getElementById("td_"+desti+"_"+destj);
        destCell.innerHTML = srcCell.innerHTML;
        srcCell.innerHTML = '';
        this.hiliteSquare(desti, destj);

        this.prevDesti = desti;
        this.prevDestj = destj;
        this.prevSrci = srci;
        this.prevSrcj = srcj;
        return true;
    }

    this.findPieceCoordinates = function(piece)
    {
        var i,j;
        for(i=0; i<8; i++) {
            for(j=0; j<8; j++) {
                if(this.boardState[i][j]==piece)
                    return [i,j];
            }
        }
        return [-1,-1];
    }

    this.getPGNMove = function(srci,srcj,desti,destj)
    {
        var srow = srcj, scol = String.fromCharCode('a'.charCodeAt(0)+srci);

    }
   
    this.hiliteSquare = function(i,j)
    {
        var hiliteClass = "highlight_white_cell";
        if((i+j)%2==0)
            hiliteClass = "highlight_black_cell";
        document.getElementById("td_"+i+"_"+j).className = hiliteClass;
    }

    this.onClicked = function(i,j)
    {

       var piece = this.boardState[i][j];
       
       //disallow click on empty squares
       //disallow click on wrong colored piece
       if(this.clicked==false && 
           (piece=='s' || 
            (this.isWhiteMove && piece==piece.toLowerCase()) ||
            (!this.isWhiteMove && piece==piece.toUpperCase())
           ))
           return ;

       //when the same color piece is clicked the second time, 
       //unhilite the old piece and hilite new piece and change
       //clicked coordinates
       if(this.clicked==true && piece!='s') {
           if(this.isWhiteMove && piece==piece.toUpperCase()) {
               this.clicked = false;
           }
           if(!this.isWhiteMove && piece==piece.toLowerCase()) {
               this.clicked = false;
           }
       }

       if(!this.clicked) {
           this.resetHilite();
           this.hiliteSquare(i,j);
           this.clickedi = i;
           this.clickedj = j;
           this.clicked = true;
       }
       else {
           if(this.makeMoveUser(this.clickedi, this.clickedj, i, j))
               this.clicked = false;
       }

    }

}

function init() 
{
    g_board = new ChessBoard();
    //g_board.createControls();
    g_board.createBoard(INITIAL_STATE_SIT_WHITE, 1);
}

function onClicked(i,j)
{
    g_board.onClicked(i,j);
}

function moveToStart()
{
     
}

function moveBack() 
{

}

function moveForward()
{

}

function moveToEnd()
{

}
