import pafy

class ViolenceDetector:
    def __init__(self):
        self.resultType = ""
        self.timeOfViolences = []
    
    def check_for_violence(self, videoType="youtubeFile", path=""):
        if videoType == "youtubeFile":
            video = pafy.new(path)
            best = video.getbest(preftype="mp4")
            print("= Youtube Video Best-URL = ", best.url)
        elif videoType == "folderFile":
            "implement later"