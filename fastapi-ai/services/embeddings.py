from sentence_transformers import SentenceTransformer
from PIL import Image

class Embeddings:

    def __init__(self, model_name: str = 'clip-ViT-B-32'):
        self.model = SentenceTransformer(model_name)

    def get_embedding_text(self, text: str) -> list:
        return self.model.encode(text).tolist()

    def get_embedding_image(self, image: Image.Image) -> list:
        return self.model.encode(image).tolist()