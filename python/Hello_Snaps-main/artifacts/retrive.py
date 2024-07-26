import json
import requests
import cv2 as cv
import numpy as np
import cloudinary
import cloudinary.api
import face_recognition as fr
import os


def read_image_from_url(url):
    try:
        # Send a GET request to the URL to fetch the image
        response = requests.get(url)
        
        # Check if the request was successful
        if response.status_code == 200:
            # Convert the response content to a numpy array
            image_array = np.frombuffer(response.content, np.uint8)
            # Decode the image array using OpenCV
            image = cv.imdecode(image_array, cv.IMREAD_COLOR)
            image_rgb = cv.cvtColor(image,cv.COLOR_BGR2RGB)
            return image_rgb
        else:
            print("Failed to retrieve image. Status code:", response.status_code)
            return None
    except Exception as e:
        print("Error:", e)
        return None

def retrive_key(filename,knownpath):

    img = read_image_from_url(filename)
    img_enc = fr.face_encodings(img)[0]
    response = cloudinary.api.resources(type='upload', prefix=knownpath) 

    # Extract image URLs from the response
    image_urls = [(resource['secure_url'],resource['public_id']) for resource in response['resources'] if resource['resource_type'] == 'image']
    for kn_path,kn_id in image_urls:
        kn_img = read_image_from_url(kn_path)
        kn_enc = fr.face_encodings(kn_img)[0]
        dist = fr.face_distance([img_enc], kn_enc)
        if dist[0] < 0.35:
            return kn_path
    
    return -1
    
if __name__ == '__main__':
    retrive_key("TestFolder/Users/testone","TestFolder/Unique_Faces")
