import cv2
import numpy as np

def MouseEvent(event, x, y, flags, param):
    if event == cv2.EVENT_LBUTTONDOWN:
        print(x, y)

# Load image 
image = cv2.imread('badpaperboard.jpg')

#Convert image to HSV values
grayimg = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

cv2.namedWindow('GRAY')
cv2.setMouseCallback('GRAY', MouseEvent)

while(1):
    cv2.imshow('GRAY', grayimg)
    if cv2.waitKey(10) & 0xFF == 27:
        break


cv2.waitKey(0)
cv2.destroyAllWindows()
