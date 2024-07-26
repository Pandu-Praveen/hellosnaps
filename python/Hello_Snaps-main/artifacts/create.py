import cloudinary.uploader
import face_recognition as fr 
import matplotlib.pyplot as plt
import requests
import cloudinary
import cloudinary.api 
import cv2 as cv
import json
import os
import numpy as np
# from dotenv import load_dotenv
# load_dotenv()
UNIQUE_FACE_ENCODINGS = {}


PUBLIC_CLOUDINARY_CLOUD_NAME = "dn5fjw67n"
CLOUDINARY_API_KEY = "563745582142893"
CLOUDINARY_API_SECRET = "GqWGqqcGBwwia5xNbxI-g9oxSkw"


# if not all([PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET]):
#     raise ValueError("Some environment variables are missing. Please check your .env file.")
print(PUBLIC_CLOUDINARY_CLOUD_NAME,CLOUDINARY_API_KEY,CLOUDINARY_API_SECRET)

cloudinary.config( 
  cloud_name =PUBLIC_CLOUDINARY_CLOUD_NAME, 
  api_key = CLOUDINARY_API_KEY, 
  api_secret = CLOUDINARY_API_SECRET,
  secure = True
)

def generate_key(n):
    result = ""
    while n > 0:
        n -= 1  # Decrease n by 1 to make modulo operation compatible with 'A' being 1 not 0
        remainder = n % 26
        result = chr(65 + remainder) + result
        n = n // 26
    return result

def save_json(filename,META_DATA):
    with open(filename, "w") as outfile: 
        json.dump(META_DATA, outfile)


def save_img(filename,img,counter):

    key = generate_key(counter)
    img = cv.cvtColor(img,cv.COLOR_RGB2BGR)

    success, encoded_image = cv.imencode('.jpg', img)
    if success:
    # Convert the encoded image data to bytes and upload to Cloudinary
        img_data = encoded_image.tobytes()
        path = filename+"/Unique_Faces"
        cloudinary.uploader.upload_image(img_data,folder = path,public_id = key)
    # return key
    return key


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

def is_unique(img_enc):

    for face_enc in UNIQUE_FACE_ENCODINGS:
        known_face = np.array([UNIQUE_FACE_ENCODINGS[face_enc]])
        un_known_face = img_enc    

        dis = fr.face_distance(known_face, un_known_face)

        if dis < 0.35:
            return (False,face_enc)
    
    return (True,-1)

def find_faces(filename,img,META_DATA,person_count,image_name):

    face_locations = fr.face_locations(img)

    for face in face_locations:
        top, right, bottom, left = face
        crp_face = img[top:bottom, left:right]
        crp_enc = fr.face_encodings(img,[face])[0]

        unique , key = is_unique(crp_enc)
        if unique:
            person_count += 1
            key=save_img(filename,crp_face,person_count)
            UNIQUE_FACE_ENCODINGS[key] = crp_enc
            
        
        if key not in META_DATA:
            META_DATA[key]= []
        
        META_DATA[key].append(image_name)
            
    return person_count


def create_album(filename):
    META_DATA = {}
    PERSON_COUNT = 0
    create = cloudinary.api.create_folder(filename+"/Unique_Faces")
    response = cloudinary.api.resources(type='upload', prefix=filename) # Adjust max_results as per your needs

    # Extract image URLs from the response
    image_urls = [(resource['secure_url'],resource['public_id']) for resource in response['resources'] if resource['resource_type'] == 'image']
    for image_name,image_id in image_urls:
        img = read_image_from_url(image_name)

        PERSON_COUNT += find_faces(filename,img,META_DATA,PERSON_COUNT,image_id)
    
    return META_DATA

if __name__ == '__main__':
    print(create_album("TestFolder"))