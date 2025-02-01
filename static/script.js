document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("generate-btn")
  const promptTextarea = document.getElementById("prompt")
  const outputDiv = document.getElementById("output")
  const codeElement = outputDiv.querySelector("code")
  const copyButton = outputDiv.querySelector(".copy-button")

  generateBtn.addEventListener("click", async () => {
    const prompt = promptTextarea.value.trim()

    if (!prompt) {
      alert("Please enter a prompt")
      return
    }

    try {
      generateBtn.disabled = true
      generateBtn.textContent = "Generating..."

      const response = await fetch("/generate-yaml", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()

      if (response.ok) {
        // Show the output container
        outputDiv.classList.remove("hidden")

        // Set and highlight the code
        codeElement.textContent = data.yaml
        Prism.highlightElement(codeElement)

        // Scroll to the output
        outputDiv.scrollIntoView({ behavior: "smooth" })
      } else {
        throw new Error(data.error || "Failed to generate YAML")
      }
    } catch (error) {
      alert(error.message)
    } finally {
      generateBtn.disabled = false
      generateBtn.textContent = "Submit Prompt"
    }
  })

  // Copy button functionality
  copyButton.addEventListener("click", () => {
    const textToCopy = codeElement.textContent
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        const originalText = copyButton.textContent
        copyButton.textContent = "Copied!"
        setTimeout(() => {
          copyButton.textContent = originalText
        }, 2000)
      })
      .catch((err) => {
        console.error("Failed to copy:", err)
      })
  })

  // Auto-resize textarea
  promptTextarea.addEventListener("input", function () {
    this.style.height = "auto"
    this.style.height = this.scrollHeight + "px"
  })
})

