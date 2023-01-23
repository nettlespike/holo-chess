#!/usr/bin/env python3
import cv2
import numpy as np
import matplotlib.pyplot as plt

HTTP = 'http://'
IP_ADDRESS = '100.64.73.118'
URL =  HTTP + IP_ADDRESS + ':4747/mjpegfeed?640x480'

cap = cv2.VideoCapture(URL)

# Corrective actions printed in the even of failed connection.
if cap.isOpened() is not True:
    print ('Connection Failed.')

# Connection successful. Proceeding to display video stream.
while cap.isOpened() is True:
    # Capture frame-by-frame
    ret, frame = cap.read()
    blur = cv2.blur(frame, (5, 5))
    blur2 = cv2.medianBlur(blur, 5)
    blur3 = cv2.GaussianBlur(blur2, (5, 5), 0)
    blurfinal = cv2.bilateralFilter(blur3, 9, 75, 75)
    colorhsv = cv2.cvtColor(blurfinal, cv2.COLOR_BGR2HSV)

    #Trying to detect white :( 
    
    lower_white = np.array([0, 0, 0])
    upper_white = np.array([0, 0, 255])
    white_mask = cv2.inRange(colorhsv, lower_white, upper_white)
   
    #Trying to detect black :(
    lower_black = np.array([0, 0, 0])
    upper_black = np.array([144, 78, 70])
    black_mask = cv2.inRange(colorhsv, lower_black, upper_black)
    
    #Trying to detect Blank Spaces
    upper_purple = np.array([162, 255, 170])
    lower_purple = np.array([38, 83, 0])
    purple_mask = cv2.inRange(colorhsv, lower_purple, upper_purple)    

   
    cv2.imshow('blurframe',blurfinal)    
    cv2.imshow('purple',purple_mask)
    cv2.imshow('white_mask', white_mask)
    cv2.imshow('black_mask', black_mask)
    
    #Exiting 
    key = cv2.waitKey(1)
    if key%256 == 32:
        break

cap.release()
cv2.destroyAllWindows()