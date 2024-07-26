from artifacts.create import create_album
from artifacts.retrive import retrive_key
from flask import Flask ,request, jsonify

app = Flask(__name__)

@app.route("/create",methods = ['POST'])
def create():
    file_name = request.json.get('file_name') #file_name -> The name of the file which as the photo

    data = create_album(str(file_name).strip())
    return jsonify(data)
    
@app.route("/retrive",methods = ['POST'])
def retrive():
    file_name = request.json.get('file_name') #file_name -> The path of the photo that to be compared
    known_path = request.json.get('known_path') #known_path -> The path for the file that has the unique faces
    
    retrive_key(file_name,known_path)


if __name__ == "__main__":
    app.run(debug=True)