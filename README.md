# Spheron YAML Generator

## 🚀 Overview
The **Spheron YAML Generator** is an AI-powered tool designed to automate the creation of **Infrastructure Composition Language (ICL)** files for deploying applications on the **Spheron Network**. This tool helps developers generate structured YAML files compatible with **Spheron CLI (sphnctl)**, enabling seamless cloud deployments.

## 🌟 Features
- **Automated ICL File Generation** – No need to manually write YAML files.
- **Customizable Infrastructure** – Define services, compute, storage, and networking configurations.
- **Multi-Service Support** – Works for frontend, backend, databases, and GPU-powered apps.
- **Optimized for Spheron Deployment** – Ensures smooth integration with **Spheron CLI**.
- **Multi-Region & Pricing Support** – Configure deployment locations and cost-effective resource allocation.

## 📌 Prerequisites
Before using the generator, ensure you have:
- **Docker** installed ([Get Docker](https://docs.docker.com/get-docker/))
- **WSL 2** (if using Windows) ([Install WSL](https://learn.microsoft.com/en-us/windows/wsl/install))
- **Spheron CLI** installed ([Spheron Docs](https://docs.spheron.network/user-guide/deploy-your-app))

## 📥 Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/rupeshbharambe2004/spheron-yaml-generator.git
   cd spheron-yaml-generator
   ```
2. Install dependencies:
   ```sh
   pip install -r requirements.txt  # If using Python
   ```

## 🛠️ Usage
1. Run the YAML Generator:
   ```sh
   python app.py  # If using Python
   ```
2. Follow the prompts to input deployment details.
3. The tool generates an `spheron-deploy.yaml` file.
4. Deploy using **Spheron CLI**:
   ```sh
   sphnctl deploy -f spheron-deploy.yaml
   ```

## 📄 Example ICL File
```yaml
version: "1.0"
services:
  my-app:
    image: my-docker-image:latest
    expose:
      - port: 3000
        as: 80
        to:
          - global: true
profiles:
  name: app-profile
  mode: provider
  duration: 1h
  compute:
    my-app:
      resources:
        cpu:
          units: 2
        memory:
          size: 8Gi
        storage:
          - size: 50Gi
  placement:
    default:
      attributes:
        region: us-central
      pricing:
        my-app:
          token: CST
          amount: 3
deployment:
  my-app:
    default:
      profile: my-app
      count: 1
```

## 🔥 Contributing
We welcome contributions! Feel free to fork the repo and submit pull requests.

## 📧 Contact
For any questions, reach out via **[issues](https://github.com/rupeshbharambe2004/yaml-generator/issues)** or **rupeshbharambe2004@example.com**.

🚀 **Deploy on Spheron and scale effortlessly!**

