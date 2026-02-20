---
layout: blog.njk
title: "Building Persona-Driven Demo Systems for Industrial Platforms"
date: 2025-08-01
tags: ["Product Management", "Demo Design", "MES", "blog"]
excerpt: "Selling complex industrial platforms starts with real user needs. Over the past year at Adatafy, I built three demo environments that our sales team now uses every week to win new clients. Here's what worked and why..."
---

Selling complex industrial software is less about showing every feature and more about solving real problems for specific people. Over the past year at Adatafy, I built demo environments for three platforms (Shiftconnector, Augmentir, and GoCanvas) that our sales team now uses every week. Here is how I approached each one from the viewpoint of key personas, the features I chose to highlight, and why the demos land in day to day operations.

## 1. Understanding Each Platform's Strengths

### Shiftconnector (MES System)

**Focus:** real-time shop-floor visibility, automated workflows, data capture for compliance.

**Strengths:**
- Workflow module that enforces standard operating procedures (SOPs)
- Real-time dashboards for OEE, quality, and throughput metrics
- Integration with PLCs and sensors for automated data ingestion

### Augmentir (Digital Workflows + Guided Procedures)

**Focus:** guided work instructions, skill-based routing, remote assistance.

**Strengths:**
- Step-by-step guided procedures with embedded videos and AR annotations
- Skill-based work assignment that routes tasks to qualified technicians
- Built-in feedback loops to capture field-level improvement suggestions

### GoCanvas (Mobile Forms & Data Collection)

**Focus:** flexible, code-free form building, offline data capture, custom reporting.

**Strengths:**
- Drag-and-drop form builder for checklists, inspections, audits
- Offline mode for remote or shielded industrial environments
- Easy export & integration with BI tools (Excel, Tableau, Power BI)

## 2. Putting Personas First

Each demo starts by defining who we're talking to and what pain they feel on a Monday morning:

| Persona | Top Pain Point | Demo Focus |
|---------|---------------|------------|
| Operations Manager | Lack of real-time visibility into line performance | Shiftconnector dashboards & alerts |
| Maintenance Lead | Unclear procedures & long repair times | Augmentir's guided work instructions |
| Quality Engineer | Paper-based inspections & audit prep headaches | GoCanvas mobile forms & report exports |

## 3. Demo Design Walk-through

### A. Shiftconnector Demo

**Persona:** Operations Manager
**Use Case:** Bypass interlocks procedure at an ethanol plant

**Key Features Shown:**
- **Workflow Module:** I configured a "Bypass Interlock" SOP that steps operators through each safety check, with digital sign-off at each stage.
- **Real-Time Dashboard:** Simulated sensor data feeds into an OEE dashboard, highlighting how a single mis-step would trigger an alert.
- **Data Drill-Down:** I demonstrate drilling from a high-level KPI down to the exact shift and operator who bypassed an interlock, showing traceability for compliance audits.

### B. Augmentir Demo

**Persona:** Maintenance Lead
**Use Case:** Guided valve replacement on a packaging line

**Key Features Shown:**
- **Step-by-Step Guidance:** I built a procedure with inline images and an AR overlay (simulated in the demo) that highlights the exact valve bolts to remove.
- **Skill-Routing Logic:** The demo user logs in; Augmentir automatically assigns the task only if their profile has the required safety certification.
- **Feedback Capture:** At the end, the user can record a quick voice note suggesting a tweak, which illustrates how continuous improvement gets fed back into the product team.

### C. GoCanvas Demo

**Persona:** Quality Engineer
**Use Case:** Daily line inspection & audit reporting

**Key Features Shown:**
- **Form Builder:** I show how to drag in a photo-capture field for "Cleanliness Check," a dropdown for "Pass/Fail," and a signature block for line manager approval.
- **Offline Submission:** I simulate "no network" on the tablet and show offline data being queued, then automatically uploaded when connectivity returns.
- **Custom Reports:** Finally, I export the week's inspection data into a Tableau-compatible CSV, demonstrating fast audit prep.

## 4. Why This Approach Works

- **Persona Empathy:** By framing each session around a real user's daily struggles, prospects immediately see relevance.
- **Use Case Authenticity:** I research industry best practices (for example, ethanol plant interlock standards and packaging line maintenance checklists) so the demo feels like real work, not a toy.
- **Feature Prioritization:** Instead of overwhelming with every toggle and report, I showcase the three features each persona cares about most.
- **Interactive & Measurable:** Prospects can click through steps themselves and see how easy it is to gather data, generate reports, or escalate issues, which builds confidence and speeds up decisions.

## Conclusion

Crafting a demo system isn't just about "turn features on." It's about telling a story that mirrors a prospect's day, speaks their language, and shows exactly how the platform will transform their workflows. Whether it's a safety-critical SOP in Shiftconnector, an AR-enhanced procedure in Augmentir, or a mobile inspection app in GoCanvas, focusing on persona pain points and common industrial use cases ensures every demo session becomes a powerful selling moment.
