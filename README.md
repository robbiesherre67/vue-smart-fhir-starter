# Vue SMART on FHIR Starter

A lightweight Vue 3 + Vite demo application showing how SMART on FHIR authentication and FHIR R4 resource access can be integrated into a modern single-page application.  
Includes **Mock Mode** (local JSON), **Demo SMART Launch Mode** (visual simulated OAuth flow), and **real SMART OAuth** support for EHR launches.

---

Tech Stack

| Layer | Technology |
|-------|-------------|
| Front-end Framework | Vue 3 (Composition API, `<script setup>`) |
| Build Tool | Vite |
| Routing | Vue Router (hash mode for GitHub Pages) |
| FHIR Client | `fhirclient` (SMART on FHIR JS Client) |
| Mock Data | Static FHIR R4 JSON bundles under `/public/mock` |
| Deployment | GitHub Pages (via GitHub Actions) |

---
