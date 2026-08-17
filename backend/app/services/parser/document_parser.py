import io
from pypdf import PdfReader
import docx

class DocumentParser:
    @staticmethod
    def extract_text_from_pdf(file_bytes: bytes) -> str:
        try:
            reader = PdfReader(io.BytesIO(file_bytes))
            text_content = []
            for page in reader.pages:
                extracted = page.extract_text()
                if extracted:
                    text_content.append(extracted)
            return "\n".join(text_content).strip()
        except Exception as e:
            raise ValueError(f"Failed to parse PDF document: {str(e)}")

    @staticmethod
    def extract_text_from_docx(file_bytes: bytes) -> str:
        try:
            doc = docx.Document(io.BytesIO(file_bytes))
            text_content = [paragraph.text for paragraph in doc.paragraphs if paragraph.text.strip()]
            return "\n".join(text_content).strip()
        except Exception as e:
            raise ValueError(f"Failed to parse DOCX document: {str(e)}")

    @classmethod
    def parse_file(cls, file_bytes: bytes, filename: str) -> str:
        ext = filename.split(".")[-1].lower()
        if ext == "pdf":
            return cls.extract_text_from_pdf(file_bytes)
        elif ext in ["docx", "doc"]:
            return cls.extract_text_from_docx(file_bytes)
        else:
            raise ValueError(f"Unsupported file format '.{ext}'. Only PDF and DOCX files are allowed.")
