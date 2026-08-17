import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class SemanticMatcher:
    @staticmethod
    def calculate_similarity(text1: str, text2: str) -> float:
        """
        Calculates cosine similarity between two text documents (0 to 100).
        Uses TF-IDF vectorization locally without external API dependencies.
        """
        if not text1 or not text2:
            return 0.0
        
        try:
            vectorizer = TfidfVectorizer(stop_words="english")
            tfidf_matrix = vectorizer.fit_transform([text1, text2])
            sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            
            # Scale to 0-100 percentage range
            score = float(sim * 100.0)
            return round(min(100.0, max(0.0, score)), 2)
        except Exception:
            return 50.0 # Graceful fallback neutral score if vectorization fails
