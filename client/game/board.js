//    Federation
//    Copyright (C) 2011 Michael Babich
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    You should have received a copy of the GNU General Public License
//    along with this program.  If not, see <http://www.gnu.org/licenses/>.

function Board (hex_grid) {
    this.HEX_SIZE   = [57, 54];
    this.HEX_OFFSET = [43, 27];

    this.X = 0;
    this.Y = 1;

    this.hex_grid = hex_grid;

    this.x      = 0;
    this.y      = 0;
    this.moved  = false;
    this.gridOn = false;

    this.board = function() {
        // Half of the total hex width, half of the middle (odd) hex width, and an extra 14 gives the max.
        this.x_max = (this.hex_grid[this.X] / 2) * this.HEX_SIZE[this.X] + (this.hex_grid[this.X] / 2) * 29 + 14;

        // The total hex height, plus the y offset, gives the max.
        this.y_max = (this.HEX_SIZE[this.Y] * this.hex_grid[this.Y] + this.HEX_OFFSET[this.Y]);

        /*
        // fixme: code to center the board on start
        if (this.moved == false) {
           this.x = - this.x_max / 2;
           this.y = - this.y_max / 2;
        }
        */

        var canvas_set = new setCanvases();

        canvas_set.setAll();

        this.hexSetup();
    }

    this.hexSetup = function () {
        var off_x = this.x;
        var off_y = this.y;

        this.hexagons = [];

        for (var i = 0; i < this.hex_grid[this.Y]; i++) {
            x = 0 + off_x;
            y = i * this.HEX_SIZE[this.Y] + off_y;

            for (var j = 0; j < this.hex_grid[this.X]; j++) {
                this.hexagons.push(this.getCoords(x, y));
                x += this.HEX_OFFSET[this.X];

                if (j % 2) {
                    y -= this.HEX_OFFSET[this.Y];
                } else {
                    y += this.HEX_OFFSET[this.Y];
                }
            }
        }

        if (this.gridOn == true) {
            this.grid();
        }
    }

    this.grid = function () {
        if (this.gridOn == false) {
            this.gridOn = true;
        }

        for (var i = 0; i < this.hexagons.length; i++) {
            this.drawGrid(this.hexagons[i]);
        }
    }

    this.getCoords = function (x_shift, y_shift) {
        var coords = [[14, 0], [43, 0], [57, 27], [43, 54], [14, 54], [0, 27]];

        for (var i = 0; i < coords.length; i++) {
            coords[i][0] += x_shift;
            coords[i][1] += y_shift;
        }

        return coords;
    }

    this.getCoordCenter = function (hex_coords) {
        return [(hex_coords[0][this.X] + hex_coords[1][this.X]) / 2, hex_coords[2][this.Y]];
    }

    this.drawGrid = function (coords) {
        var board_canvas = document.getElementById('board').getContext('2d');

        board_canvas.strokeStyle = '#aaaaaa';
        board_canvas.lineWidth = 1;
        board_canvas.beginPath();

        board_canvas.moveTo(coords[0][0], coords[0][1]);

        for (var i = 1; i < coords.length; i++) {
            board_canvas.lineTo(coords[i][0], coords[i][1]);        
        }

        board_canvas.closePath();
        board_canvas.stroke();
    }
}

var board = new Board([40, 40]);

function setCanvases() {
    this.color1 = "#333333";
    this.color2 = "#888888";

    this.x = window.innerWidth;
    this.y = window.innerHeight;

    this.setAll = function() {
        this.setBoard();
        this.setSidebar();
        this.setFooter();
        this.setHeader();
    }

    this.setStart = function(id, x, y) {
        var canvas = document.getElementById(id);

        canvas.setAttribute("width", x);
        canvas.setAttribute("height", y);

        return canvas.getContext("2d");
    }

    this.setBoard = function () {
        board.x_height = this.x - 260;
        board.y_height = this.y - 88;

        var boardc = this.setStart("board", board.x_height, board.y_height);
    }

    this.setSidebar = function () {
        var sidebar = this.setStart("sidebar", 220, this.y - 88);

        sidebar.fillStyle = this.color1;
        sidebar.fillRect(10, 10, 200, 150);
        sidebar.fillRect(10, 165, 50, 50);

        sidebar.fillStyle = "#cccccc";
        sidebar.textBaseline = 'top'
        sidebar.font = 'bold 14px sans-serif'
        sidebar.fillText("Sol", 70, 167);
        sidebar.font = 'bold 12px sans-serif'
        sidebar.fillText("Star", 70, 187);
        sidebar.fillText("Earthlings", 70, 202);
    }

    this.setFooter = function () {
        var footer = this.setStart("footer", this.x - 35, 30);

        footer.fillStyle = "#cccccc";
        footer.textBaseline = 'top'
        footer.font = 'bold 14px sans-serif'
        footer.textAlign = "center";
        footer.fillText("May 2500", 50, 7);
        footer.fillText("Forums", 200, 7);
        footer.fillText("Wiki", 350, 7);
        footer.fillText("Developers", 500, 7);
    }

    this.setHeader = function () {
        var header = this.setStart("header", this.x - 35, 30);
        header.fillStyle = "#cccccc";
        header.textBaseline = 'top'
        header.font = 'bold 14px sans-serif'
        // Server Name Federation Credits Income Research Points Ships Fleets Territories
        header.textAlign = "center";
        header.fillText("Federation", 50, 7);
        header.fillText("John Doe", 175, 7);
        header.fillText("Pirates", 260, 7);
        header.fillText("200", 330, 7);
        header.fillText("10", 400, 7);
        header.fillText("20", 450, 7);
        header.fillText("4", 500, 7);
        header.fillText("1", 550, 7);
        header.fillText("2", 600, 7);
        header.textAlign = "right";
        header.fillText("(10, 10)", this.x - 35, 7);
    }
}

function keyActions(event) {
    const SCROLL = 20;

    board.moved = true;

    // Left scrolls left.
    if (event.keyCode == 37) {
        if (board.x + SCROLL <= 0) {
            board.x += SCROLL;
        }
    }

    // Up scrolls up.
    if (event.keyCode == 38) {
        if (board.y + SCROLL <= 0) {
            board.y += SCROLL;
        }
    }

    // Right scrolls right.
    if (event.keyCode == 39) {
        if (board.x - board.x_height >= - board.x_max) {
            board.x -= SCROLL;
        }
    }

    // Down scrolls down.
    if (event.keyCode == 40) {
        if (board.y - board.y_height >= - board.y_max) {
            board.y -= SCROLL;
        }
    }

    board.board();

    switch (event.keyCode) {
    case 71: // 'g'
        board.grid();
        break;
    }
}

// Accurately captures location of mouse on board canvas.
function mouseMove(event) {
    var x = event.clientX - 10 - board.x;
    var y = event.clientY - 45 - board.y;

    if (x < 0 || x > board.x_height) {
        x = false;
    }

    if (y < 0 || y > board.y_height) {
        y = false;
    }

    // alert(x + ', ' + y);
}

window.onresize = function(event) {
    board.board();
}

window.onload = function(event) {
    board.board();
}

window.addEventListener('keydown', keyActions, true);
document.addEventListener('mousemove', mouseMove, true)
