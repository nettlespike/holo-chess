#given coordinates determine if pixel is red, black, or white :D 
import cv2
import numpy as np

# Load image 
image = cv2.imread('board-full-red-dot.png')

#Convert image to HSV values
hsvimg = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

#red_mask
lower_red = np.array([0, 110, 0])
upper_red = np.array([179,255,255])
red_mask = cv2.inRange(hsvimg, lower_red, upper_red)

coord_x = 400
coord_y = 857

if np.any(image[coord_x][coord_y] == 0):
    print("BLACK!")
elif np.any(~image[coord_x][coord_y]==0):
    print("White!")
elif np.any(red_mask[coord_x][coord_y]!=0):
    print("RED!")

cv2.imshow('img', image)
#print(image[coord_x][coord_y])


cv2.waitKey(0)
cv2.destroyAllWindows()
