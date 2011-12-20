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

function getCoords(x_shift, y_shift) {
    var coords = [[14, 0], [43, 0], [57, 27], [43, 54], [14, 54], [0, 27]];

    for (var i = 0; i < coords.length; i++) {
        coords[i][0] += x_shift;
        coords[i][1] += y_shift;
    }

    return coords;
}

function getCoordCenter(hex_coords) {
    return [(hex_coords[0][0] + hex_coords[1][0]) / 2, hex_coords[2][1]];
}

function draw(coords) {
    var board = document.getElementById('board').getContext('2d');

    board.strokeStyle = '#aaaaaa';
    board.lineWidth = 1;
    board.beginPath();

    board.moveTo(coords[0][0], coords[0][1]);

    for (var i = 1; i < coords.length; i++) {
        board.lineTo(coords[i][0], coords[i][1]);        
    }

    board.closePath();
    board.stroke();
}

function board() {
    const X = 0;
    const Y = 1;

    const HEX_SIZE = [57, 54];
    const HEX_OFFSET = [43, 27];

    var hex_grid = [40, 40];

    // Half of the total hex width, half of the middle (odd) hex width, and an extra 14 gives the max.
    boardimg.x_max = (hex_grid[X] / 2) * HEX_SIZE[X] + (hex_grid[X] / 2) * 29 + 14;

    // The total hex height, plus the y offset, gives the max.
    boardimg.y_max = (HEX_SIZE[Y] * hex_grid[Y] + HEX_OFFSET[Y]);

    /* fixme: code to center the board on start
    if (boardimg.moved == false) {
        boardimg.x = - boardimg.x_max / 2;
        boardimg.y = - boardimg.y_max / 2;
    } */

    var off_x = boardimg.x;
    var off_y = boardimg.y;

    var hexagons = [];

    setSize("#333333");

    for (var i = 0; i < hex_grid[Y]; i++) {
        x = 0 + off_x;
        y = i * HEX_SIZE[Y] + off_y;

        for (var j = 0; j < hex_grid[X]; j++) {
            hexagons.push(getCoords(x, y));
            x += HEX_OFFSET[X];

            if (j % 2) {
                y -= HEX_OFFSET[Y];
            } else {
                y += HEX_OFFSET[Y];
            }
        }
    }

    for (var i = 0; i < hexagons.length; i++) {
        draw(hexagons[i]);
    }
}

function setSize(color) {
    var x_pixels = window.innerWidth;
    var y_pixels = window.innerHeight;

    var board = document.getElementById('board');
    board.setAttribute("width", x_pixels - 260);
    board.setAttribute("height", y_pixels - 88);

    boardimg.y_height = y_pixels - 88;
    boardimg.x_height = x_pixels - 260;

    var sidebar = document.getElementById('sidebar');
    sidebar.setAttribute("width", 220);
    sidebar.setAttribute("height", y_pixels - 88);

    side_canvas = sidebar.getContext('2d');
    side_canvas.fillStyle = "#888888";
    side_canvas.fillRect(0, 0, 220, y_pixels - 88);

    side_canvas.fillStyle = color;

    side_canvas.fillRect(10, 10, 200, 150);

    side_canvas.fillRect(10, 165, 50, 50);

    var footer = document.getElementById('footer');

    footer.setAttribute("width", x_pixels - 35);
    footer.setAttribute("height", 30);

    foot_canvas = footer.getContext('2d');
    foot_canvas.fillStyle = "#888888";
    foot_canvas.fillRect(0, 0, x_pixels - 35, 30);

    var header = document.getElementById('header');

    header.setAttribute("width", x_pixels - 35);
    header.setAttribute("height", 30);

    head_canvas = header.getContext('2d');
    head_canvas.fillStyle = "#888888";
    head_canvas.fillRect(0, 0, x_pixels - 35, 30);
}

window.onresize = function(event) {
    board();
}

function keyActions(event) {
    const SCROLL = 20;

    boardimg.moved = true;

    // Left scrolls left.
    if (event.keyCode == 37) {
        if (boardimg.x + SCROLL <= 0) {
            boardimg.x += SCROLL;
        }
    }

    // Up scrolls up.
    if (event.keyCode == 38) {
        if (boardimg.y + SCROLL <= 0) {
            boardimg.y += SCROLL;
        }
    }

    // Right scrolls right.
    if (event.keyCode == 39) {
        if (boardimg.x - boardimg.x_height >= - boardimg.x_max) {
            boardimg.x -= SCROLL;
        }
    }

    // Down scrolls down.
    if (event.keyCode == 40) {
        if (boardimg.y - boardimg.y_height >= - boardimg.y_max) {
            boardimg.y -= SCROLL;
        }
    }

    board();

/*    switch (event.keyCode) {
    case 71: // 'g'
        break;
    }
*/
}

// Accurately captures location of mouse on board canvas.
function mouseMove(event) {
    var x = event.clientX - 10 - boardimg.x;
    var y = event.clientY - 45 - boardimg.y;

    if (x < 0 || x > boardimg.x_height) {
        x = false;
    }

    if (y < 0 || y > boardimg.y_height) {
        y = false;
    }

    alert(x + ', ' + y);
}

window.addEventListener('keydown', keyActions, true);
document.addEventListener('mousemove', mouseMove, true)

boardimg = new Object();
boardimg.moved = false;
boardimg.x = 0;
boardimg.y = 0;

board();
