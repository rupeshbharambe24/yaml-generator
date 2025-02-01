import re
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import google.generativeai as genai
import os
import yaml
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-pro")

def generate_yaml(prompt):
    """
    Generate YAML configuration in Spheron's ICL format using Gemini API.
    """
    input_text = f"""
    Generate a valid Spheron YAML configuration based on the following requirements:
    - {prompt}
    The YAML should strictly adhere to Spheron's Infrastructure Composition Language (ICL) specifications.
    Refer to the Spheron ICL documentation for the correct format: https://docs.spheron.network/user-guide/icl
    Example YAML:
    ```yaml
    version: "2.0"
    modules:
      - name: data_source
        type: io.spheron.data_sources.csv
        parameters:
          path: "my_data.csv"
          sep: ","
          header: "true"
    ```
    Generate the YAML configuration:
    ```yaml
    """
    
    response = model.generate_content(input_text)
    generated_text = response.text

    # Extract YAML block using regex
    matches = re.findall(r"```yaml(.*?)```", generated_text, re.DOTALL)
    
    if matches:
        yaml_block = matches[0].strip()
    else:
        yaml_block = generated_text.strip()  # Use entire response if no clear YAML block

    # Remove extra backticks that might break YAML
    yaml_block = yaml_block.replace("```", "").strip()

    # Validate & format YAML
    try:
        # Try to parse the YAML to check its validity
        parsed_yaml = yaml.safe_load(yaml_block)  # Ensure it's valid
        formatted_yaml = yaml.dump(parsed_yaml, default_flow_style=False, sort_keys=False)  # Correct indentation
        return formatted_yaml
    except yaml.YAMLError as e:
        print(f"❌ Invalid YAML: {e}")
        return None

def validate_yaml(yaml_text):
    """
    Validate the generated YAML to ensure proper formatting.
    """
    try:
        yaml.safe_load(yaml_text)  # Check if YAML is valid
        return True
    except yaml.YAMLError as e:
        print(f"❌ YAML Validation Error: {e}")
        return False

@app.route("/")
def index():
    return render_template("index.html")  # Serve index.html

@app.route("/generate-yaml", methods=["POST"])
def generate_yaml_endpoint():
    try:
        data = request.json
        prompt = data.get("prompt")
        
        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400

        yaml_output = generate_yaml(prompt)
        
        if not yaml_output or not validate_yaml(yaml_output):
            return jsonify({"error": "Failed to generate valid YAML"}), 500

        return jsonify({"yaml": yaml_output})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
