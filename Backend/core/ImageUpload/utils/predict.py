import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np
import json
import os

# --- Load Model and Class Indices ---
MODEL_PATH = 'ImageUpload/cnn_model/plant_disease_model.h5'
CLASS_INDICES_PATH = 'ImageUpload/cnn_model/class_indices.json'

if not os.path.exists(MODEL_PATH) or not os.path.exists(CLASS_INDICES_PATH):
    raise FileNotFoundError(
        "Model file 'plant_disease_model.h5' or 'class_indices.json' not found. "
        "Please run the updated train_model.py first."
        f"{MODEL_PATH}, {CLASS_INDICES_PATH}"
    )

model = tf.keras.models.load_model(MODEL_PATH)
with open(CLASS_INDICES_PATH, 'r') as f:
    class_indices = json.load(f)

# Invert the dictionary to map index to class name
class_names = {v: k for k, v in class_indices.items()}

# --- New Recommendations for PlantVillage Dataset ---
RECOMMENDATIONS = {
    "Pepper__bell___Bacterial_spot": "Use copper-based fungicides. Avoid overhead watering. Rotate crops and remove infected plant debris.",
    "Pepper__bell___healthy": "Your pepper plant appears healthy. Ensure consistent watering and provide support as it grows.",
    "Potato___Early_blight": "Apply fungicides containing chlorothalonil or mancozeb. Ensure good air circulation and avoid water on leaves.",
    "Potato___Late_blight": "This is a serious disease. Use fungicides like metalaxyl or chlorothalonil immediately. Destroy infected plants to prevent spread.",
    "Potato___healthy": "Your potato plants look healthy. Continue to 'hill' soil around the base to protect tubers from sunlight.",
    "Tomato_Bacterial_spot": "Apply copper-based bactericides. Mulch around plants to prevent soil splash. Do not work with plants when they are wet.",
    "Tomato_Early_blight": "Prune lower leaves. Use fungicides like chlorothalonil. Stake plants to improve air circulation.",
    "Tomato_Late_blight": "A devastating disease. Act fast. Use targeted fungicides and remove all infected plants from the garden.",
    "Tomato_Leaf_Mold": "Ensure good ventilation, especially in greenhouses. Use fungicides. Some tomato varieties are resistant.",
    "Tomato_Septoria_leaf_spot": "Remove infected leaves immediately. Apply fungicides. Mulch heavily to reduce water splashing from soil.",
    "Tomato_Spider_mites_Two-spotted_spider_mite": "Use insecticidal soap or neem oil. Introduce predatory mites. Mist plants to increase humidity.",
    "Tomato__Target_Spot": "Improve air circulation. Apply a fungicide. Remove and destroy crop debris after harvest.",
    "Tomato__Tomato_YellowLeaf__Curl_Virus": "Control whiteflies, which spread the virus. Use insecticidal soap or reflective mulch. Remove infected plants.",
    "Tomato__Tomato_mosaic_virus": "There is no cure. Remove and destroy infected plants. Disinfect tools and wash hands after handling.",
    "Tomato_healthy": "Your tomato plant is healthy. Continue with regular watering and feeding, especially when fruit begins to form."
}


def predict_plant_disease(image_path):
    """
    Loads an image, preprocesses it, and predicts the plant disease using the PlantVillage model.
    """
    try:
        # Load and preprocess the image
        img = image.load_img(image_path, target_size=(128, 128))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array /= 255.0

        # Make prediction
        predictions = model.predict(img_array)
        predicted_class_index = np.argmax(predictions[0])
        confidence = float(np.max(predictions[0])) * 100

        # Get class name
        predicted_class_name = class_names[predicted_class_index]
        
        # Format the output
        parts = predicted_class_name.split('_')
        plant = parts[0]
        issue = ' '.join(parts[1:])

        health = "healthy" if "healthy" in issue.lower() else "disease"
        if health == "healthy":
            issue = "No disease detected"

        # Get recommendation
        recommendation = RECOMMENDATIONS.get(predicted_class_name, "General care is advised. No specific recommendation available.")

        return {
            "health": health,
            "confidence": round(confidence, 2),
            "plant": plant,
            "issue": issue,
            "recommendation": recommendation
        }

    except Exception as e:
        print(f"An error occurred during prediction: {e}")
        return {
            "error": "Failed to analyze image.",
            "details": str(e)
        }

