"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Prism from "prismjs"
import "prismjs/components/prism-yaml"
import "prismjs/themes/prism-tomorrow.css"

export default function YAMLGenerator() {
  const [prompt, setPrompt] = useState("")
  const [yaml, setYaml] = useState("")

  const handleSubmit = async () => {
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
        setYaml(data.yaml)
      }
    } catch (error) {
      console.error("Failed to generate YAML:", error)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-900 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-4">
          <label className="block text-lg text-zinc-200">Paste your Prompt here:</label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="I want a Node.js service with auto-scaling and 1 GB of memory"
            className="min-h-[100px] bg-zinc-800 border-zinc-700 text-zinc-200 placeholder:text-zinc-400"
          />
          <Button onClick={handleSubmit} className="bg-red-500 hover:bg-red-600 text-white">
            Submit Prompt
          </Button>
        </div>

        {yaml && (
          <div className="space-y-4">
            <h2 className="text-lg text-zinc-200">Optimized Prompt:</h2>
            <div className="relative group">
              <pre className="p-4 bg-zinc-800 rounded-lg overflow-x-auto">
                <code
                  className="language-yaml"
                  dangerouslySetInnerHTML={{
                    __html: Prism.highlight(yaml, Prism.languages.yaml, "yaml"),
                  }}
                />
              </pre>
              <Button
                onClick={() => navigator.clipboard.writeText(yaml)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                variant="secondary"
                size="sm"
              >
                Copy
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

