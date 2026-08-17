import re
from typing import List, Set

class SkillNormalizer:
    SYNONYM_MAP = {
        # Frontend
        "react.js": "React",
        "reactjs": "React",
        "react": "React",
        "next.js": "Next.js",
        "nextjs": "Next.js",
        "vue.js": "Vue.js",
        "vuejs": "Vue.js",
        "vue": "Vue.js",
        "angular.js": "Angular",
        "angularjs": "Angular",
        "angular": "Angular",
        "typescript": "TypeScript",
        "ts": "TypeScript",
        "javascript": "JavaScript",
        "js": "JavaScript",
        "html5": "HTML",
        "html": "HTML",
        "css3": "CSS",
        "css": "CSS",
        "tailwind": "Tailwind CSS",
        "tailwindcss": "Tailwind CSS",

        # Backend & Languages
        "python": "Python",
        "python3": "Python",
        "node": "Node.js",
        "node.js": "Node.js",
        "nodejs": "Node.js",
        "express": "Express.js",
        "express.js": "Express.js",
        "expressjs": "Express.js",
        "fastapi": "FastAPI",
        "django": "Django",
        "flask": "Flask",
        "java": "Java",
        "golang": "Go",
        "go": "Go",
        "c++": "C++",
        "cpp": "C++",
        "c#": "C#",
        "csharp": "C#",

        # Databases
        "postgres": "PostgreSQL",
        "postgresql": "PostgreSQL",
        "postgresdb": "PostgreSQL",
        "mongo": "MongoDB",
        "mongodb": "MongoDB",
        "mysql": "MySQL",
        "sqlite": "SQLite",
        "redis": "Redis",

        # DevOps & Cloud
        "aws": "AWS",
        "amazon web services": "AWS",
        "docker": "Docker",
        "k8s": "Kubernetes",
        "kubernetes": "Kubernetes",
        "gcp": "Google Cloud",
        "google cloud": "Google Cloud",
        "azure": "Azure",
        "ci/cd": "CI/CD",
        "cicd": "CI/CD",
        "git": "Git",
        "github": "GitHub",

        # AI & ML
        "machine learning": "Machine Learning",
        "ml": "Machine Learning",
        "deep learning": "Deep Learning",
        "dl": "Deep Learning",
        "nlp": "NLP",
        "natural language processing": "NLP",
        "tensorflow": "TensorFlow",
        "pytorch": "PyTorch",
        "scikit-learn": "scikit-learn",
        "sklearn": "scikit-learn",
    }

    @classmethod
    def normalize_skill(cls, raw_skill: str) -> str:
        if not raw_skill:
            return ""
        cleaned = raw_skill.strip()
        lower_key = cleaned.lower()
        
        # Check dictionary map
        if lower_key in cls.SYNONYM_MAP:
            return cls.SYNONYM_MAP[lower_key]
        
        # Title case default for unknown skills
        return cleaned.title()

    @classmethod
    def normalize_skills(cls, raw_skills: List[str]) -> List[str]:
        seen: Set[str] = set()
        normalized_list: List[str] = []
        
        for s in raw_skills:
            norm = cls.normalize_skill(s)
            if norm and norm.lower() not in seen:
                seen.add(norm.lower())
                normalized_list.append(norm)
                
        return normalized_list
