

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

function ChessBoard() 
{
    //private
    this.hilited_i=-1;
    this.hilited_j=-1;
    this.white_cell = "white_cell";
    this.black_cell = "black_cell";

    this.resetHilite = function()
    {
        var td = document.getElementById("td_"+this.hilited_i+"_"+this.hilited_j);
        if( (this.hilited_i+this.hilited_j) % 2 == 0)
            td.className = this.black_cell;
        else
            td.className = this.white_cell;
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

    this.initBoard = function(boardArray) 
    {
       var i=0, j=0;
       for(i=0; i<8; i++) {
           for(j=0; j<8; j++) {
               var piece = boardArray[i].charAt(j);
               if(piece != 's')
                   document.getElementById('td_'+i+"_"+j).innerHTML = this.getImageHtml(i,j,piece);
           }
       } 

    }

    this.getCellHtml = function(i,j,piece,isWhite) 
    {
        var idSuffix = i+'_'+j;
        var cls = isWhite?this.white_cell:this.black_cell;
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

        var boardArray = ["rnbkqbnr","pppppppp","ssssssss","ssssssss","ssssssss","ssssssss","PPPPPPPP","RNBQKBNR"];

        this.initBoard(boardArray);
    }

     
    this.validatePawnMove = function(srci, srcj, desti, destj)
    {
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

    this.validateMove = function(piece, srci, srcj, desti, destj) 
    {
        var ret = true;
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
     
        var srcCell = document.getElementById("td_"+srci+"_"+srcj);
        var a = srcCell.innerHTML;
        if(a==null || a=='' ) {
            this.resetHilite();
            return;
        }

        var destCell = document.getElementById("td_"+desti+"_"+destj);
        var b = destCell.innerHTML;
        if(b==null || b=='' ) {
            this.resetHilite();
            return;
        }

        var piece = srcCell.firstChild.name;
        if(!this.validateMove(piece, srci, srcj, desti, destj)) {
            this.resetHilite();
            return;
        }

        destCell.innerHTML = a;
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
