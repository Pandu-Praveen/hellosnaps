from artifacts.create import create_album
from artifacts.retrive import retrive_key
from flask import Flask ,request, jsonify
import json
app = Flask(__name__)



@app.route("/summa",methods = ['POST'])
def summa():
    # data = request.get_json()
    workspace_id = request.json.get('workspaceId')
    print(workspace_id)
    
    # Process the data (for example, just returning it for now)
    response = {
        "message": f"Received workspaceId: {workspace_id}"
    }
    
    return jsonify(response)


@app.route("/create",methods = ['POST'])
def create():
    file_name = request.json.get('file_name') #file_name -> The name of the file which as the photo

    data = create_album(str(file_name).strip())
    return jsonify(data)
    
@app.route("/retrive",methods = ['POST'])
def retrive():
    file_name = request.json.get('file_name') #file_name -  > The path of the photo that to be compared
    known_path = request.json.get('known_path') #known_path -> The path for the file that has the unique faces
    
    retrive_key(file_name,known_path)


if __name__ == "__main__":
    app.run(debug=True)