#    Federation
#    Copyright (C) 2011 Michael Babich
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU Affero General Public License as
#    published by the Free Software Foundation, either version 3 of the
#    License, or (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU Affero General Public License for more details.
#
#    You should have received a copy of the GNU Affero General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.

import Image, ImageDraw, sys

class Hex():
    def __init__(self, x_shift, y_shift):
        # These are the coordinates of the upper left hex. All other coordinates are shifted.
        self.points = [[14, 0], [43, 0], [57, 27], [43, 54], [14, 54], [0, 27]]

        for point in self.points:
            point[0] += x_shift
            point[1] += y_shift

    # Draws lines through every adjacent point in the hexagon.
    def draw(self, img):
        for i in range(6):
            start = i
            if i != 5:
                end = i + 1
            else:
                end = 0

            img.line([self.points[start][0], self.points[start][1], self.points[end][0], self.points[end][1]])

class Board():
    def __init__(self, hex_grid, border):
        # Gets index positions to act like x/y coordinates.
        X = 0
        Y = 1

        # * These constants make generating work. Do not mess with them unless you know what you're doing. * #
        # Size of the hexes.
        HEX_SIZE   = (57, 54)

        # Offsets each X and every other Y.
        HEX_OFFSET = (43, 27)

        # Space between the even Xs.
        HALF_X     = 15

        # Magicly fixes the x_pixels and y_pixels calculations for any border size.
        MAGIC      = (11, 1)

        # Sets up the board sizejmnk in pixels.
        x_pixels   = (hex_grid[X] * HEX_SIZE[X] / 2) + hex_grid[X] * HALF_X + (border * 2) + MAGIC[0]
        y_pixels   = hex_grid[Y] * HEX_SIZE[Y] + HEX_OFFSET[Y] + (border * 2) + MAGIC[1]
        self.board_size = (x_pixels, y_pixels)

        # Fills a hexagon list with Hex objects with pixel coordinates.
        self.hexagons = []

        for i in range(hex_grid[Y]):
            x = 0 + border
            y = i * HEX_SIZE[Y] + border

            for j in range(hex_grid[X]):
                self.hexagons.append(Hex(x, y))
                x += HEX_OFFSET[X]

                if j % 2: y -= HEX_OFFSET[Y]
                else: y += HEX_OFFSET[Y]

        image_name = 'test.png'

        self.drawImage(image_name)
        self.makePage(image_name)

    def drawImage(self, image_name):
        # Draws the hexagons onto a test.png.
        img = Image.new('RGB', self.board_size)

        draw = ImageDraw.Draw(img)

        for hexagon in self.hexagons:
            hexagon.draw(draw)

        img.save('../html/%s' % image_name, 'PNG')      

    def makePage(self, image_name):
        page_meta = '<META HTTP-EQUIV="CONTENT-TYPE" CONENT="text/html; charset=utf8">\n'

        page_css  = '<link href="style.css"\n        rel="stylesheet"\n        type="text/css" />\n'

        page_img  = '<body>\n  <b><big><a href="index.html">Federation</a>' + '&nbsp;&nbsp;<img src="sphere.png" align="top" title="Name"></img> John Doe' + '&nbsp;&nbsp;<img src="sphere.png" align="top" title="Federation"></img> Pirates' + '&nbsp;&nbsp;<img src="sphere.png" align="top" title="Credits"></img> 200' + '&nbsp;&nbsp;<img src="sphere.png" align="top" title="Income"></img> 10' + '&nbsp;&nbsp;<img src="sphere.png" align="top" title="Research Points"></img> 20' + '&nbsp;&nbsp;<img src="sphere.png" align="top" title="Ships"></img> 4' + '&nbsp;&nbsp;<img src="sphere.png" align="top" title="Fleets"></img> 1' + '&nbsp;&nbsp;<img src="sphere.png" align="top" title="Territories"></img> 2</big></b>\n  <center><img src="%s" usemap="#hex"></img></center>\n  <map name="hex">\n' % image_name

        page_head = '<!DOCTYPE HTML>\n<html>\n<head>\n  %s  <title>Federation</title>\n  %s</head>\n%s' % (page_meta, page_css, page_img)

        page_foot = '</map>\n</body>\n</html>'

        map_base  = '<area shape="poly" coords="%i %i %i %i %i %i %i %i %i %i %i %i" href="hex%s.html"> '

        img_map   = '    '

        for i in range(len(self.hexagons)):
            img_map += map_base % (self.hexagons[i].points[0][0],
                                  self.hexagons[i].points[0][1],
                                  self.hexagons[i].points[1][0],
                                  self.hexagons[i].points[1][1],
                                  self.hexagons[i].points[2][0],
                                  self.hexagons[i].points[2][1],
                                  self.hexagons[i].points[3][0],
                                  self.hexagons[i].points[3][1],
                                  self.hexagons[i].points[4][0],
                                  self.hexagons[i].points[4][1],
                                  self.hexagons[i].points[5][0],
                                  self.hexagons[i].points[5][1],
                                  str(i % 40) + 'x' + str(i / 40))

        webpage = open('../html/test.html', 'w')
        webpage.write(page_head + img_map + page_foot)
        webpage.close()

def main():
    # Variables.
    hex_grid   = (40, 40)
    border     = 10

    board = Board(hex_grid, border)

main()
