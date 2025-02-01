function clearChat() {
  const chatOutput = document.getElementById("chat-output")
  chatOutput.innerHTML = ""
}

document.getElementById("new-chat").addEventListener("click", clearChat)

async function generateYaml() {
  const prompt = document.getElementById("prompt").value.trim()
  const chatOutput = document.getElementById("chat-output")
  const generateBtn = document.getElementById("generate-btn")

  if (!prompt) {
    alert("Please enter a prompt.")
    return
  }

  // Disable the button and show loading state
  generateBtn.disabled = true
  generateBtn.querySelector(".send-icon").style.color = "#cccccc"

  // Add user message to chat
  const userMessage = document.createElement("div")
  userMessage.classList.add("message", "user-message")
  userMessage.textContent = prompt
  chatOutput.appendChild(userMessage)

  // Clear input and adjust height
  const promptTextarea = document.getElementById("prompt")
  promptTextarea.value = ""
  promptTextarea.style.height = "auto"

  try {
    const response = await fetch("/generate-yaml", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    })

    const data = await response.json()

    if (response.ok) {
      // Add bot message to chat
      const botMessage = document.createElement("div")
      botMessage.classList.add("message", "bot-message")

      // Create a pre element for YAML formatting
      const yamlPre = document.createElement("pre")
      yamlPre.textContent = data.yaml

      // Create a copy button
      const copyButton = document.createElement("button")
      copyButton.classList.add("copy-button")
      copyButton.textContent = "Copy"
      copyButton.onclick = () => {
        navigator.clipboard.writeText(data.yaml).then(() => {
          copyButton.textContent = "Copied!"
          setTimeout(() => {
            copyButton.textContent = "Copy"
          }, 2000)
        })
      }

      // Append YAML and copy button to bot message
      botMessage.appendChild(yamlPre)
      botMessage.appendChild(copyButton)
      chatOutput.appendChild(botMessage)
    } else {
      // Show error message
      const errorMessage = document.createElement("div")
      errorMessage.classList.add("message", "error-message")
      errorMessage.textContent = data.error || "Failed to generate YAML."
      chatOutput.appendChild(errorMessage)
    }
  } catch (error) {
    // Show connection error
    const errorMessage = document.createElement("div")
    errorMessage.classList.add("message", "error-message")
    errorMessage.textContent = "Failed to connect to the server."
    chatOutput.appendChild(errorMessage)
  } finally {
    // Re-enable the button
    generateBtn.disabled = false
    generateBtn.querySelector(".send-icon").style.color = "#10a37f"

    // Scroll to bottom of chat
    chatOutput.scrollTop = chatOutput.scrollHeight
  }
}

// Auto-resize textarea
const textarea = document.getElementById("prompt")
textarea.addEventListener("input", function () {
  this.style.height = "auto"
  this.style.height = this.scrollHeight + "px"
})

