import os
from os import path
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

from violence_detector import ViolenceDetector

app = Flask(__name__)
CORS(app)


@app.route("/", methods=["GET"])
def get_example():
    response = jsonify(message="Violence Detector backend server is running.")
    return response


@app.route("/video", methods=["POST"])
def post_video():
    try:
        videoType = request.form['videoType']
        videoPath = request.form['videoPath']
        hasVideo = request.form['hasVideo']
        print("= POST DATA =\nType: ", videoType, "\nURL: ",  videoPath, "\nIncludes_Video: ", hasVideo)
        
        if hasVideo == "true":
            video_file = request.files['file']
            if video_file.filename != "":
                folderPath = path.join(path.dirname(path.abspath(__file__)), 'sample')
                if not path.exists(folderPath):
                    os.makedirs(folderPath)
                filepath = path.join(folderPath, video_file.filename)
                video_file.save(filepath)
                videoPath = filepath
        detector = ViolenceDetector()
        resultType, timeOfViolence = detector.check_for_violence(videoType, videoPath)   

        if hasVideo == "true":
            os.remove(videoPath)
        response = jsonify({ "type": resultType, "timestamps": list(timeOfViolence) })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    except Exception as err:
        response = jsonify({ "type": "error", "timestamps": [] })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response


if __name__ == "__main__":
    app.run(host="127.0.0.1", port="5000", debug=True)