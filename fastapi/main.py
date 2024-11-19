from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import AutoModelForSequenceClassification, AutoTokenizer, pipeline
import torch
import numpy as np
from langdetect import detect

app = FastAPI()

# Input schema for essay submission
class Essay(BaseModel):
    content: str

# Load the pre-trained essay scoring model and tokenizer
model = AutoModelForSequenceClassification.from_pretrained("KevSun/Engessay_grading_ML")  # Ensure correct name
tokenizer = AutoTokenizer.from_pretrained("KevSun/Engessay_grading_ML")

# Load a translation model (Korean to English)
translator = pipeline("translation", model="Helsinki-NLP/opus-mt-ko-en")

# Scoring function
def score_essay(essay: str) -> dict:
    encoded_input = tokenizer(essay, return_tensors="pt", padding=True, truncation=True, max_length=512)
    model.eval()

    # Perform the prediction
    with torch.no_grad():
        outputs = model(**encoded_input)

    # Extract predictions
    predictions = outputs.logits.squeeze().numpy()
    item_names = ["cohesion", "syntax", "vocabulary", "phraseology", "grammar", "conventions"]

    # Handle edge cases for scaling
    if np.max(predictions) == np.min(predictions):  # Avoid division by zero
        scaled_scores = np.ones_like(predictions) * 3  # Assign average score if predictions are uniform
    else:
        # Scale predictions from the raw output to the range [1, 5]
        scaled_scores = 1 + 4 * (predictions - np.min(predictions)) / (np.max(predictions) - np.min(predictions))

    # Round scores to the nearest 0.5
    rounded_scores = np.round(scaled_scores * 2) / 2

    # Combine item names and their corresponding scores into a dictionary
    return {item: float(score) for item, score in zip(item_names, rounded_scores)}

# FastAPI endpoint
@app.post("/score-essay/")
async def score_essay_endpoint(essay: Essay):
    """
    @article{sun2024automatic,
      title={Automatic Essay Multi-dimensional Scoring with Fine-tuning and Multiple Regression},
      author={Kun Sun and Rong Wang},
      year={2024},
      journal={ArXiv},
      url={https://arxiv.org/abs/2406.01198}
    }
    """
    try:
        # Detect language of the input essay content
        detected_language = detect(essay.content)
        print(f"Detected language: {detected_language}")

        # If the content is in Korean, translate it to English
        if detected_language == "ko":
            translated_content = translator(essay.content)
            print(f"Translated Content: {translated_content}")
        else:
            translated_content = essay.content  # Assume content is already in English

        # Score the (translated or original) essay
        scores = score_essay(translated_content[0]["translation_text"])

        return {
            "original": essay.content,
            "translated": translated_content if detected_language == "ko" else None,
            "language_detected": detected_language,
            "scores": scores
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
