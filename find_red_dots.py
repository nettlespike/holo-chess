#find all red dots on an image and give the coordinates 
import cv2
import numpy as np

# Load image 
image = cv2.imread('board-full-red-dot.png')

#Convert image to HSV values
hsvimg = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

#Setting lower and upper color bounds and making mask of all pixels in that range
lower_red = np.array([0, 110, 0])
upper_red = np.array([179,255,255])
red_mask = cv2.inRange(hsvimg, lower_red, upper_red)

# Display red mask
cv2.imshow('Red_mask', red_mask)
#cv2.imshow('og', image)

#find centroids:
contours, heiarchies = cv2.findContours(red_mask, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
coords = []
for i in contours:
    M = cv2.moments(i)
    if M['m00'] != 0:
        cx = int(M['m10']/M['m00'])
        cy = int(M['m01']/M['m00'])
        cv2.drawContours(image, [i], -1, (0, 255, 0), 2)
        cv2.circle(image, (cx, cy), 7, (0, 0, 255), -1)
        cv2.putText(image, "center", (cx - 20, cy - 20),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 2)
    coords.append((cx, cy))

print(coords)

cv2.waitKey(0)
cv2.destroyAllWindows()

