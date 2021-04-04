import cv2
import pafy
import imutils
import numpy as np
from os import path
import tensorflow as tf

class ViolenceDetector:
    def __init__(self):
        self.resultType = "non-violent"
        self.timeOfViolence = set()
        self.dataset = []
        self.frame_nums = []
        self.fps = 0
    
    def check_for_violence(self, videoType="youtubeFile", path=""):
        if videoType == "youtubeFile":
            video = pafy.new(path)
            best = video.getbest(preftype="mp4")
            self.prepareDataset(best.url)         
        elif videoType == "folderFile":
            self.prepareDataset(path)

        self.predict(self.dataset)
        return (self.resultType, self.timeOfViolence)


    def prepareDataset(self, url):
        try:
            hog = cv2.HOGDescriptor()
            hog.setSVMDetector(cv2.HOGDescriptor_getDefaultPeopleDetector())

            vidcap = cv2.VideoCapture(url)
            total_frames = int(vidcap.get(cv2.CAP_PROP_FRAME_COUNT))
            self.fps = int(vidcap.get(cv2.CAP_PROP_FPS))
            startingFrame = (35 * self.fps) if (total_frames/self.fps) >= 100.0 else (15 * self.fps)
            print("\n== == == ==\n")
            print("Total Frames: ", total_frames, " FPS: ", self.fps)
            
            image_sequence = []
            vidcap.set(cv2.CAP_PROP_POS_FRAMES, startingFrame)
            while(vidcap.isOpened()):
                success, image_frame = vidcap.read()
                bounding_boxes = []
                if image_frame is not None:
                    resized = imutils.resize(image_frame, width=min(400, image_frame.shape[1]))
                    gray = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)
                    (bounding_boxes, weights) = hog.detectMultiScale(gray, winStride=(8, 8), scale=1.09)
                elif not success:
                    break
                if len(bounding_boxes) >= 2:
                    if image_frame is not None :
                        cur_frame = vidcap.get(cv2.CAP_PROP_POS_FRAMES)
                        self.frame_nums.append(int(cur_frame))
                        print(cur_frame)
                        for i in range(10):
                            vidcap.set(cv2.CAP_PROP_POS_FRAMES, cur_frame + i)
                            success, frame = vidcap.read()
                            if success:
                                resized_img = cv2.resize(frame, (100,100))
                                image_sequence.append(resized_img)
                            else:
                                break
                        if len(image_sequence) == 10:
                            self.dataset.append([image_sequence])
                            image_sequence = []
                            vidcap.set(cv2.CAP_PROP_POS_FRAMES, cur_frame + 10)
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break
            vidcap.release()
            print("Dataset Length: ", len(self.dataset))
        except Exception as err:
            print("** Oops! **\n", err)


    def predict(self, input_video_data):
        try:
            input_video_data = np.array(input_video_data).reshape(-1, 10, 100, 100, 3)
            input_video_data = input_video_data.astype(dtype=np.float32)/255

            trained_model_path = path.join(path.dirname(path.abspath(__file__)), "model", "ViolenceDetectionBD-20-9588.h5")
            cnn_bilstm_violence_model = tf.keras.models.load_model(trained_model_path)

            if len(input_video_data) >= 1:
                prediction = cnn_bilstm_violence_model.predict(input_video_data)

                violence_flag = False
                for frameIndex, pair in enumerate(prediction):
                    print(pair[1] - pair[0], pair)
                    if pair[1] - pair[0] >= 0.965:
                        violence_flag = True
                        self.timeOfViolence.add( int( (self.frame_nums[frameIndex]/self.fps) / 60) )
                        print(">> ", frameIndex, " ", self.frame_nums[frameIndex], " ", pair)                       

                self.resultType = "violent" if violence_flag == True else "non-violent"
                print("\nThis video is ", self.resultType, "\t Violence timestamps: ", list(self.timeOfViolence))
            else:
                self.resultType = "non-violent"
                print("\nThis video is ", self.resultType, "\t Violence timestamps: ", list(self.timeOfViolence))

        except Exception as err:
            print("** Oops! Error in Prediction! **\n", err)





if __name__ == "__main__":
    detector = ViolenceDetector()
    detector.check_for_violence("youtubeFile", "https://youtu.be/mGtMPLzbaxo")
    # https://www.youtube.com/watch?v=C0m1iTLbTUc
    # https://youtu.be/yACpDRmsXGU
    # https://youtu.be/mGtMPLzbaxo
    # model_path = path.join(path.dirname(path.abspath(__file__)), "model", "ViolenceDetectionBD-20-9588.h5")
    # print(path.exists(model_path))