import apiClient from './apiClient'
import { API_ENDPOINTS } from '@/config/api'

export interface CreateResumeRequest {
  job_description: string
  language: string
}

export interface CreateResumeResponse {
  resume_text: string
  success?: boolean
}

/**
 * Mock resume response for UI/UX development
 */
const MOCK_RESUME_RESPONSE: CreateResumeResponse = {
  resume_text: `#import "@preview/basic-resume:0.2.9": *

#let name = "Lukas Burtscher"
#let location = "Vienna, Austria"
#let email = "lukas.business99@gmail.com"
#let github = "github.com/lukasthekid"
#let linkedin = "linkedin.com/in/lukas-burtscher"
#let phone = "+436605750442"

#show: resume.with(
  author: name,
  location: location,
  email: email,
  github: github,
  linkedin: linkedin,
  phone: phone,
  accent-color: "#26428b",
  font: "New Computer Modern",
  paper: "us-letter",
  author-position: left,
  personal-info-position: left,
)

== Education

#edu(
  institution: "[TU Wien (Vienna University of Technology)]",
  location: "Vienna, AT",
  dates: dates-helper(start-date: "Sep 2023", end-date: "Jun 2025"),
  degree: "Master of Science in Data Science",
)
- GPA: 3.7/4.0
- Relevant Coursework: Deep Learning, Generative AI, Machine Learning, Database Systems

#edu(
  institution: "[TU Wien (Vienna University of Technology)]",
  location: "Vienna, AT",
  dates: dates-helper(start-date: "Sep 2019", end-date: "Jun 2023"),
  degree: "Bachelor of Science in Computer Science",
)
- GPA: 3.3/4.0
- Relevant Coursework: Algorithms, Distributed Systems, Software Engineering

== Work Experience

#work(
  title: "Software Engineer",
  location: "Vienna, AT",
  company: "CHECK24 GmbH",
  dates: dates-helper(start-date: "Sep 2022", end-date: "Jul 2025"),
)
- Developed and maintained microservices for financial products, integrating complex data flows across MongoDB, Elasticsearch, and Azure SQL Server for real-time reporting.
- Engineered document processing models utilizing LSTMs and word embeddings within an OCR pipeline to extract data from unstructured user documents.
- Deployed services via Jenkins, Docker, and Kubernetes, ensuring scalable and reliable operation within a high-traffic platform.

#work(
  title: "Data Science Instructor",
  location: "Vienna, AT",
  company: "Masterschool Institute of Technology",
  dates: dates-helper(start-date: "Apr 2025", end-date: "Current"),
)
- Led comprehensive data science courses, training aspiring data scientists in machine learning, statistics, and deep learning.
- Quantified customer groups for a travel company using unsupervised learning techniques (scikit-learn, R).

#work(
  title: "Fullstack Developer",
  location: "Vienna, AT",
  company: "IQSOFT GmbH",
  dates: dates-helper(start-date: "Jul 2021", end-date: "Aug 2022"),
)
- Developed location tracking applications for the Austrian Federal Railways (ÖBB), gaining experience in logistics-related software development.

== Projects

#project(
  name: "AI Powered Job Search Application",
  url: "",
)
- Developed and deployed an AI-driven job-matching platform using a custom RAG model to analyze user profiles and align them with multi-source job data.
- Built the system end-to-end with React, Django Ninja, and Python, implementing job–candidate scoring algorithms and containerizing the full stack with Docker.

#project(
  name: "Master Thesis: Enhancing Embedding-based Product Search",
  url: "",
)
- Engineered a two-tower neural retriever by training the GTE-Large encoder on 1.45M synthetic queries to enhance semantic product retrieval, outperforming zero-shot LLMs and BM25.
- Utilized Hugging Face, LLMs, Retrieval, Embeddings, TensorFlow, PyTorch, and CUDA for advanced model development.

== Skills

- *Programming Languages*: Python, Java, R, SQL, Scala, C++
- *Web Technologies*: React, HTTP, REST, OAuth/OIDC, RDF, Django Ninja, Spring Boot
- *Databases*: SQL/NoSQL, MongoDB, Elasticsearch, MySQL, PostgreSQL, Azure SQL Server
- *DevOps & Tools*: Docker, Kubernetes, Jenkins, Git, GNU/Linux (shell, tmux, gnu-tools), Sentry, Graylog
- *Machine Learning/Data Science*: TensorFlow, PyTorch, Scikit-learn, LLMs, Deep Learning, Generative AI, Regression and Classification
- *Cloud Platforms*: AWS, Azure ML, GCP`,
  success: true,
}

/**
 * Check if mock mode is enabled via environment variable
 */
function isMockMode(): boolean {
  return true
}

/**
 * Simulate API delay for realistic mock behavior
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Service for resume-related operations
 * The backend handles fetching user data via JWT token and calling the n8n webhook
 */
export const resumeService = {
  /**
   * Generate a resume using the backend endpoint
   * The backend will fetch user data from JWT token and call the n8n webhook
   * 
   */
  async createResume(data: CreateResumeRequest): Promise<CreateResumeResponse> {
    // Mock mode: return mock response with simulated delay
    if (isMockMode()) {
      // Simulate API delay (2-4 seconds)
      await delay(2000 + Math.random() * 2000)
      return MOCK_RESUME_RESPONSE
    }

    // Real API call
    const response = await apiClient.post<CreateResumeResponse>(
      API_ENDPOINTS.RESUMES.CREATE_RESUME,
      data,
      {
        timeout: 300000, // 5 minutes timeout for long-running generation
      }
    )
    return response.data
  },
}

