#find all red dots on an image and give the coordinates 
import cv2
import numpy as np

# Load image 
image = cv2.imread('badboard.jpg')

#Convert image to HSV values
grayimg =  cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

cv2.imshow('Gray_scale', grayimg)

cv2.waitKey(0)
cv2.destroyAllWindows()
