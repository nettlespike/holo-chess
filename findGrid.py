import numpy as np

#function produces the distance between two coordinates
def distance(x1, y1, x2, y2):
    return abs(np.sqrt(np.square(x2-x1) + np.square(y2-y1)))

#function produces the coordinates of all the points on a line inbetween the grid
def findLinePts(x1,y1,x2,y2):
    coords_list = []
    length = distance(x1, y1, x2, y2)
    for i in range(1,17,2):
        coords_list.append(length*i)
    return coords_list

#Function produces the equation of the line in standard form
def line_equation(x1, y1, x2, y2):
    a = y2 - y1
    b = x1 - x2
    c = (x2 * y1) - (x1 * y2)
    return (a, b, c)

#Function produces the solution of two lines in standard form
def solveSystem(a1, b1, c1, a2, b2, c2):
    u = np.array([[a1, b1], [a2, b2]])
    v = np.array([c1, c2])
    x, y = np.linalg.solve(u, v)
    return (x, y)

def findCoords(x1,y1,x2,y2,x3,y3,x4,y4):
    coords_top = findLinePts(x1, y1, x2, y2)
    coords_bottom = findLinePts(x3, y3, x4, y4)
    coords_left = findLinePts(x1, y1, x3, y3)
    coords_right = findLinePts(x3, y3, x4, y4)

    verticalLines = []
    horizontalLines =[]

    finalList=[]

    for i in range(8):
        verticalLines.append(line_equation(coords_top[i], y1, coords_bottom[i], y3))
        horizontalLines.append(line_equation(x1, coords_left[i], x2, coords_right[i]))

    for i in range(8):
        finalList.append[solveSystem(verticalLines[i][0],verticalLines[i][1],verticalLines[i][2],horizontalLines[i][0],horizontalLines[i][1],horizontalLines[i][2])]

    return finalList

print(findCoords(0,8,8,8,0,0,8,0))


    



