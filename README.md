# Profesional Stock — product website

Website of **Profesional Stock**, an offline-first point-of-sale and inventory system for small businesses in Argentina (sales, stock, cash register, purchases and reports on a Windows PC). This repository contains the public site and the AI assistant that answers visitors' questions.

**Live site:** https://matiasmedina846.github.io/Profesional-Stock---Landing/

Sitio de **Profesional Stock**, un sistema de ventas, stock y caja que funciona sin internet para comercios. Acá está la página pública y el asistente con IA que responde las dudas de los visitantes.

## Contents / Contenido

| Path | Description |
|------|-------------|
| `index.html` | Landing page: modules, industries (`img/rubros`), pricing and FAQ |
| `descargar.html`, `prueba.html` | Download and 15-day free trial activation guide |
| `vs-excel.html` | Comparison against managing a business with spreadsheets |
| `privacidad.html`, `terminos.html` | Privacy policy and terms |
| `404.html`, `robots.txt`, `sitemap.xml` | Error page and SEO files |
| `stocky-worker/` | **Stocky**, the website assistant: a Cloudflare Worker that calls the Claude API with a curated knowledge base (see its [README](stocky-worker/README.md)) |

## Tech

- Static HTML/CSS/JS hosted on **GitHub Pages**, no build step.
- **Stocky**: Cloudflare Workers (JavaScript) + Claude API, per-visitor rate limiting, fallback answers when the worker is unavailable, and a suite of 61 conversation test cases (`npm run probar` inside `stocky-worker/`).

## Notes

- The Windows installer (`ProfesionalStock-3.0.51.exe`) is currently served from this repository. A good next step is to publish it as a GitHub Release so the repository stays light.

---
Author: [Matias Medina](https://github.com/MatiasMedina846) · [LinkedIn](https://www.linkedin.com/in/matias-medina-german/)
