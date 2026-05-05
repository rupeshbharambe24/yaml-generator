# Spheron YAML Generator

A small Flask web app that uses the Gemini API to generate Spheron Infrastructure Composition Language (ICL) YAML configurations from natural-language prompts.

## What it does

You describe your deployment in plain English (services, compute, storage, region, etc.) and the app calls Gemini to draft a corresponding `spheron-deploy.yaml`. The output is parsed with PyYAML, re-serialized for clean indentation, and validated before being returned to the user.

## Tech Stack

- Backend: Flask, Flask-CORS
- LLM: Google Gemini (`gemini-pro` via `google-generativeai`)
- YAML parsing/validation: PyYAML
- Frontend: HTML + Tailwind + Prism.js for syntax highlighting
- Deployment: Dockerfile + `render.yaml` (Render) and `spheron-deployment.yaml` (Spheron)

## Project Structure

```
yaml-generator/
├── app.py                      # Flask backend (/, /generate-yaml endpoints)
├── templates/                  # index.html
├── static/                     # static assets
├── script.js, index.tsx        # client-side logic
├── styles.css, prism-custom.css, tailwind.config.ts
├── Dockerfile
├── render.yaml                 # Render deployment config
├── spheron-deployment.yaml     # Spheron ICL example
├── requirements.txt
└── .env.example
```

## Setup

```bash
git clone https://github.com/rupeshbharambe24/yaml-generator.git
cd yaml-generator

python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Edit .env and set GEMINI_API_KEY

python app.py
```

Open `http://localhost:5000` and submit a prompt.

## API

`POST /generate-yaml`
```json
{ "prompt": "deploy a node.js service with 2 CPU and 8Gi RAM in us-central" }
```
Returns:
```json
{ "yaml": "version: \"1.0\"\nservices:\n  ..." }
```

## Notes

This is a small utility project — a single-purpose wrapper around an LLM call with light YAML validation. Not intended for production use without further hardening (rate limits, output schema enforcement, auth).
