---
title: "Cybersecurity Dataset Construction & LoRA Fine-Tuning of a SAST LLM"
tagline: "LLM finetuning · LoRA · MCP · vLLM"
summary: "Built a code vulnerability dataset and specialized an open-source language model at Orange to audit application source code security entirely in-house."
category: "dl"
domains: ["llm", "cybersecurity"]
stack: ["LoRA", "Qwen", "Serena MCP", "LSP", "Tree-sitter", "vLLM", "Hugging Face", "PyTorch", "GCP"]
cta:
  url: "/assets/Recommandation_Orange_Romain_Sebire.pdf"
  label: "View recommendation"
  icon: "medal"
featured: true
order: 0
date: "Mar – Sep 2026"
cover: "/images/projects/sast-llm-fine-tuning/cover.webp"
environment: "CoT Distillation: Claude Haiku 4.5 & Sonnet 4.6 API\nLoRA Training: GCP GPU NVIDIA H100 (80 GB)\nInference & Deployment: vLLM server (REST API)"
---

This project aims to design a sovereign Static Application Security Testing (SAST) model for source code auditing. Using a custom code extraction and knowledge distillation pipeline, a high-quality dataset of over 11,700 vulnerable and patched code samples was built. An open-source model (Qwen 3.6 27B) was then fine-tuned with LoRA on this corpus, providing an in-house solution that protects sensitive source code while keeping operating costs under control.

## Context

This work was carried out during my 6-month end-of-studies internship at Orange, within the DEFY security team.

With cyberattacks growing more frequent and sophisticated, leveraging AI for code auditing has become essential to overcome the limitations of existing solutions:
* **Traditional SAST tools**: Relying on fixed syntactic rules and pattern matching, they do not understand application business logic and generate a high volume of false positives that pentesters must manually review.
* **Proprietary models and third-party APIs**: The team developed an agent-based SAST tool querying proprietary frontier models via API. While effective, this setup raises major issues at scale regarding cost, vendor dependency, and data sovereignty, as sensitive internal source code cannot be sent to external servers.

The goal of my internship was therefore to build a sovereign, on-premise alternative: construct a web-focused cybersecurity dataset, specialize an open-source model, deploy it behind an API, and evaluate the impact of fine-tuning.

## Data

Building a high-quality training corpus was the first major challenge, as public vulnerability databases do not directly provide usable source code.

* **Public vulnerability databases**: Collected and consolidated metadata from the NVD (National Vulnerability Database) and Google's OSV database (including GitHub Security Advisories), focusing on web technologies (PHP, Java, Go, JavaScript, TypeScript, Python, Ruby).
* **Missing source code**: Public CVE records only provide a short text summary, a weakness category (CWE), a severity score (CVSS), and a link to the fixing Git commit, without containing the actual vulnerable code snippets.

## Methodology

The engineering pipeline was structured around five main steps, from targeted code extraction to model deployment and evaluation.

### 1. Method-Level Source Code Extraction
Extracting entire files from fixing commits would flood the LLM's context window with unrelated code. A custom extraction pipeline was therefore built to reconstruct only the relevant data flow from entry point to vulnerability:
* **Tree-sitter**: Generates Abstract Syntax Trees (AST) to isolate the modified method along with the helper functions it calls.
* **LSP servers and Serena MCP**: Runs a Language Server Protocol instance on the cloned repository to trace the call stack backwards and identify calling functions up to public application endpoints.
* **Vulnerable and safe code pairs**: To prevent the model from raising systematic false alarms, each CVE yields two training samples: the vulnerable flow from the parent commit and the patched flow from the fixing commit.

### 2. Knowledge Distillation and Chain-of-Thought
Because raw CVE descriptions are too brief and inconsistent to teach a model how to reason, a knowledge distillation step was implemented:
* **Analysis generation**: A teacher model analyzes both the vulnerable code and its patch to write a step-by-step Chain-of-Thought (CoT) explanation detailing the tainted data flow or the effectiveness of the security fix.
* **Confidence-based routing**: The first pass is handled by Claude Haiku 4.5, which also outputs a self-assessed confidence score. When confidence is too low on complex cases, the analysis escalates to Claude Sonnet 4.6, significantly reducing API costs while maintaining high explanation quality.
* **Format alignment**: Distilled explanations were formatted to match Qwen 3.6's native thinking structure so the training process builds naturally on its pre-trained reasoning habits.

![Dataset sample visualization interface (vulnerable / patched pair) with CoT analysis and quality pipeline verdict](/images/projects/sast-llm-fine-tuning/dataset-sample.webp)

### 3. Noise Filtering
To ensure training quality, successive filters removed noisy records: commits modifying only tests or documentation, methods with extreme lengths, analyses with low confidence scores, and samples exceeding the 4,096-token window. This filtering produced a final dataset of 11,726 balanced samples (51% vulnerable and 49% safe) spanning 341 CWE categories.

### 4. LoRA Fine-Tuning and vLLM Deployment
* **Model selection**: Qwen 3.6 27B (dense version) was selected after outperforming its Mixture-of-Experts variant on coding and logical reasoning benchmarks.
* **LoRA training in BF16**: Training was executed on an NVIDIA H100 GPU (80 GB VRAM) on GCP. This memory capacity allowed loading the model natively in BF16 precision without destructive quantization, training only the LoRA adapters (0.9% of parameters) with loss masking applied to the input prompt.
* **Prompt engineering**: The system prompt was designed to require the model to list and verify existing security controls before looking for vulnerabilities, helping reduce false alarms.
* **Merging and inference server**: After training, the LoRA adapters were merged into the base weights and the unified model was deployed via vLLM behind a REST API.

## Results

To measure the impact of specialization, the fine-tuned model was evaluated against the Qwen 3.6 27B baseline on a held-out test set of 300 real samples (150 vulnerable and 150 safe). An LLM-as-a-Judge protocol verified whether the generated explanation accurately matched the ground-truth vulnerability mechanism.

| Evaluation Metric | Baseline Model | Fine-Tuned Model (LoRA) | Change |
| :--- | :---: | :---: | :---: |
| Real vulnerability detection (Recall) | 48.7 % | 61.3 % | + 12.7 % |
| Security protection identification | 86.7 % | 85.3 % | - 1.3 % |
| Safe code validated without false alerts | 22.0 % | 28.7 % | + 6.7 % |
| Overall detection score | 67.7 % | 73.3 % | + 5.7 % |

* **Impact of fine-tuning**: Specialization improved the model's ability to detect and explain real vulnerabilities by nearly 13%, demonstrating stronger data-flow tracing.
* **Limitations and next steps**: While precision improved, single-pass false positives remain high for a 27B model. These findings helped define two next steps for the project: scaling up to a larger open-source model and adopting a two-pass multi-agent architecture where an investigator agent explores the repository to gather missing context and filter out false positives.
