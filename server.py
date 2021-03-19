from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from os import path

from violence_detector import ViolenceDetector

app = Flask(__name__)
CORS(app)


@app.route("/", methods=["GET"])
def get_example():
    response = jsonify(message="Simple server is running")
    return response


@app.route("/video", methods=["POST"])
def post_video():
    videoType = request.form['videoType']
    videoPath = request.form['videoPath']
    hasVideo = request.form['hasVideo']
    print("= POST DATA =\nType: ", videoType, "\nURL: ",  videoPath, "\nIncludes_Video: ", hasVideo)
    if hasVideo == "true":
        print("= Request has Video file =\n")
        video_file = request.files['file']
        if video_file.filename != "":
            filepath = path.join("sample", video_file.filename)
            video_file.save(filepath)
            videoPath = filepath

    detector = ViolenceDetector()
    detector.check_for_violence(videoType, videoPath)
    
    return jsonify(message="POST request response returned")


if __name__ == "__main__":
    app.run(host="127.0.0.1", port="5000", debug=True)