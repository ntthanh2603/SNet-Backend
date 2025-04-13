from ultralytics import YOLO
import cv2
from typing import Dict, Any
import numpy as np

PATH_MEDIAS_POSTS = '/home/asus/Code/SNet-Backend/public/medias-posts/'
CLASS_NAME = ["Normal", "Violent", "Adult"]
class AIService:
    def __init__(self):
        # Load YOLOv8n model
        self.model = YOLO('model-ai/yolov8n.pt')
        
    async def classify_image(self, image_path: str) -> Dict[str, Any]:
        try:
            # Read image
            image = cv2.imread(PATH_MEDIAS_POSTS + image_path)

            if  image is None:
                raise ValueError("Could not read image")

            # Run inference
            results = self.model(image)
            
            detections = {}

            for result in results:
                probs = result.probs  
                for class_id, prob in enumerate(probs.data):
                    class_name = CLASS_NAME[class_id]
                    detections[class_name] = round(float(prob), 2)

            return {
                'success': True,
                "image_name": image_path,
                'detections': detections, 
            }

        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

