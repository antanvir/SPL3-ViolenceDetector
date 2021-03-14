from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

from violence_detector import ViolenceDetector

app = Flask(__name__)
CORS(app)


@app.route("/", methods=["GET"])
def get_example():
    response = jsonify(message="Simple server is running")
    return response


@app.route("/video", methods=["POST"])
def post_video():
    req_data = request.get_json()
    print("= POST DATA =\n", req_data['videoType'], "\n",  req_data['videoPath'], "\n", req_data['video'] != None)

    detector = ViolenceDetector()
    detector.check_for_violence(req_data['videoType'], req_data['videoPath'])
    
    return jsonify(message="POST request response returned")


if __name__ == "__main__":
    app.run(host="127.0.0.1", port="5000", debug=True)