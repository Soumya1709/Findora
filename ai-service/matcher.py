from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

print("Loading AI Model...")

model = SentenceTransformer("all-MiniLM-L6-v2")

print("AI Model Ready")


def get_embedding(text: str):
    return model.encode(text)


def calculate_similarity(text1: str, text2: str):

    emb1 = get_embedding(text1)
    emb2 = get_embedding(text2)

    similarity = cosine_similarity(
        [emb1],
        [emb2]
    )[0][0]

    return float(similarity)