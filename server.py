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
            print("= Request has Video file = ", video_file.filename)
            if video_file.filename != "":
                folderPath = path.join(path.dirname(path.abspath(__file__)), 'sample')
                # folderExists = path.exists(path.join(path.dirname(path.abspath(__file__)), 'sample'))
                print("HERE - 1")
                if not path.exists(folderPath):
                    print("HERE - 2")
                    os.makedirs(folderPath)
                filepath = path.join(folderPath, video_file.filename)
                video_file.save(filepath)
                videoPath = filepath
        print(videoPath)
        detector = ViolenceDetector()
        resultType, timeOfViolence = detector.check_for_violence(videoType, videoPath)
        
        return jsonify({ "type": resultType, "timestamps": list(timeOfViolence) })
    except Exception as err:
        return jsonify({ "type": "error", "timestamps": [] })


if __name__ == "__main__":
    app.run(host="127.0.0.1", port="5000", debug=True)