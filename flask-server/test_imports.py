import sys
import os

# Set up paths
sys.path.append(os.path.abspath("../machine-learning/models/chatbot"))
sys.path.append(os.path.abspath("../machine-learning/models/scoring"))

# Test imports
try:
    from speaking_test_model import df_field_values
    print("Successfully imported df_field_values.")
except ImportError as e:
    print(f"ImportError for df_field_values: {e}")
