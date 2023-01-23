# import required libraries
import cv2 

# read input image
img = cv2.imread('board-red.png')
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

# convert the input image to a grayscale
gray = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
print("hello2")
# Find the chess board corners
ret, corners = cv2.findChessboardCornersSB(gray, (7, 3), None)
print("hello3")

cv2.imshow('og_pic', img)
print(ret)
# if chessboard corners are detected
if ret == True:
   
   # Draw and display the corners
   img = cv2.drawChessboardCorners(img, (7, 3), corners,ret)
   cv2.imshow('Chessboard',img)
   cv2.waitKey(0)

cv2.destroyAllWindows()