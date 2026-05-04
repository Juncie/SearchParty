# Search Party

## AI-Assisted Job Hunt Platform & Chrome Extension

---

# Overview

Search Party is a Chrome Extension + Web Platform designed to drastically reduce the time and friction involved in applying for jobs.

The platform enables users to create multiple reusable **Applicant Profiles** tailored toward different career paths (Frontend Developer, Full Stack Engineer, Shopify Developer, etc.), then intelligently assist users with:

- Job application autofill
- ATS-optimized resume generation
- Tailored cover letter generation
- Job extraction and analysis
- Application tracking
- Reusable answers for common application questions

The Chrome Extension acts as the user-facing assistant during job applications while the web platform manages profiles, documents, AI generation, and application history.

---

# Core Product Goals

## Primary Goal

Reduce a 20–45 minute job application process into a 3–5 minute workflow while keeping the user in control.

---

# Product Objectives

## MVP Objectives

### Applicant Profiles

Users can:

- Create multiple profiles
- Store work history
- Store education
- Store skills/projects
- Store links and social profiles
- Upload/Store resume variations
- Upload/Store cover letter variations

---

### Autofill Assistance

The extension can:

- Detect application fields
- Match fields against user profile data
- Autofill common fields safely
- Ask for confirmation when confidence is low

---

### AI Assistance

The platform can:

- Generate cover letters
- Tailor resumes
- Generate answers to common application questions

---

### Application Tracking

Users can:

- Save jobs
- Track application status
- Save notes
- Track generated documents
- Save application answers

---

# Non-Goals (MVP)

The MVP WILL NOT:

- Auto-submit applications
- Apply to jobs in bulk
- Circumvent ATS protections
- Fully support all ATS systems
- Promise "guaranteed ATS scores"
- Fabricate user experience/credentials

---

# Tech Stack

# Monorepo

```txt
/apps
  /web
  /extension

/packages
  /shared
  /db
  /ai
  /docs
  /ui
  /utils
```
