import sys
import json
import os
import tensorflow as tf
from tensorflow.keras.applications.efficientnet import preprocess_input


os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
tf.get_logger().setLevel("ERROR")


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "final_efficientnetB4_skin_cancer.keras")

THRESHOLD = 0.3470901
IMG_SIZE = 224


model = tf.keras.models.load_model(MODEL_PATH, compile=False)


def preprocess_image(image_path):
    image = tf.io.read_file(image_path)
    
    # Use decode_jpeg for better control
    image = tf.image.decode_jpeg(image, channels=3)
    
    image = tf.image.resize(image, (IMG_SIZE, IMG_SIZE))
    image = tf.cast(image, tf.float32)
    
    image = preprocess_input(image)
    image = tf.expand_dims(image, axis=0)
    
    return image


def predict(image_path):
    img = preprocess_image(image_path)
    prob = model.predict(img, verbose=0)[0][0]

    label = "Malignant" if prob >= THRESHOLD else "Benign"

    return {
        "probability": float(prob),
        "prediction": label,
        "threshold": THRESHOLD
    }


if __name__ == "__main__":
    try:
        if len(sys.argv) < 2:
            raise ValueError("Image path not provided")

        image_path = sys.argv[1]

        if not os.path.exists(image_path):
            raise FileNotFoundError("Image file not found")

        result = predict(image_path)

        # IMPORTANT: Print ONLY JSON
        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({"error": str(e)}))