---
layout: blog.njk
title: "Why Industrial AI Needs Evidence First: Building PharmaOps Copilot"
date: 2026-06-01
tags: ["Industrial AI", "LLM / GenAI", "Pharma Manufacturing", "RAG", "Agentic AI", "blog"]
excerpt: "LLMs are powerful—but in pharma manufacturing, a confident hallucination can stop a batch release or trigger a false deviation escalation. I built PharmaOps Copilot to explore what a genuinely trustworthy industrial AI copilot looks like: evidence-first architecture, GxP-aware guardrails, a CDF-ready data abstraction, and a 12-case eval suite to keep it honest."
---

*How I built a CDF-ready, evidence-grounded copilot for pharma batch deviation triage*

## Introduction

Industrial AI is not the same problem as consumer chat. In a pharma plant, a model does not get to be "mostly right." A batch deviation investigation touches quality, production, maintenance, SOP compliance, and sometimes regulatory risk. If a copilot invents a citation, overstates a release decision, or hides uncertainty behind confident wording, it can make operators slower, not faster.

I built **PharmaOps Copilot** to explore what a practical, trustworthy industrial AI assistant should look like. The project is a local-first React dashboard and guardrailed AI copilot for a synthetic pharma manufacturing scenario: Batch B-104, a batch delayed by CIP timing issues, pH drift, a temperature excursion, operator notes, work orders, and SOP references.

The goal was not to build a chatbot that sounds smart. The goal was to build a copilot that can explain what happened, cite the evidence it used, identify what still needs human review, and stay inside the lane for GxP-sensitive work.

## Why This Kind of Copilot Matters

Industrial teams already have data. The problem is that the data is scattered across historians, MES systems, ERP systems, CMMS tools, lab records, shift logs, and PDFs. When something goes wrong, engineers and quality teams spend valuable time reconstructing the story:

- What event started the deviation?
- Which time-series tags crossed limits?
- Were there active work orders on related equipment?
- Did operator notes mention a known process issue?
- Which SOP sections apply?
- Is this a maintenance review, quality review, or escalation decision?

A useful industrial copilot should reduce the time spent hunting for context. It should not replace QA, release decisions, or engineering judgment. It should assemble the right evidence quickly and make the human review sharper.

## The Core Design Principle: Evidence Before Reasoning

The most important architectural choice in PharmaOps Copilot is that the LLM never starts with an empty prompt. Before any narrative is generated, the backend builds a deterministic evidence packet using tool-like functions. That packet includes events, anomalies, work orders, operator notes, SOP sections, and calculated time-series statistics.

> **Design rule:** The model can reason over assembled evidence, but it cannot create evidence. Citations come from deterministic data retrieval, not from model memory.

This matters because industrial users need traceability. A sentence like "the pH drift likely contributed to the delay" is only useful if the user can see the supporting event ID, the relevant time window, and the SOP section that defines the expected behavior.

## How It Was Built

### 1. Local-First Industrial Data Model

The project uses synthetic JSON data as the local source of truth. I modeled the core objects around industrial concepts: assets, equipment, batches, deviations, events, work orders, time-series tags, and files. This makes the prototype easy to run locally while still reflecting how real industrial platforms organize operational data.

The frontend talks to an `IDataProvider` abstraction. Today, that provider reads from local generated data. In a production version, the same interface could be backed by a `CdfDataProvider` that maps those concepts to Cognite Data Fusion assets, equipment, time series, activities, and files.

### 2. React Dashboard + Express API

The UI is a React dashboard built with TypeScript, Vite, and Tailwind CSS. It gives users a batch-centric view of the deviation: timeline, process signals, events, work orders, and copilot answers. The backend is an Express service that handles agent orchestration, retrieval, evidence building, and guardrail enforcement.

### 3. Evidence Builder

The evidence builder is the heart of the system. For each question, it gathers structured facts before the LLM is called. For example, when asked why Batch B-104 was delayed, the system pulls together:

- Batch and deviation metadata
- CIP delay events and operator notes
- pH and temperature anomalies from time-series statistics
- Related maintenance work orders
- Applicable SOP sections with citation IDs

The result is a bounded context window that is smaller, cleaner, and more trustworthy than dumping raw documents into a prompt.

### 4. Retrieval and RAG

For SOP references, I implemented a lightweight keyword retriever over a small document set. This is intentionally simple for the bounded demo, but the architecture leaves room for vector retrieval and embeddings later. The important pattern is the same: retrieve grounded document sections first, then allow the copilot to summarize them with citations.

### 5. Guardrails for GxP-Sensitive Work

The copilot is designed to avoid making release, safety, or final quality decisions. If a user asks whether a batch can be released, the system routes the answer toward QA review instead of pretending to be an authority. A post-processor also neutralizes overreaching phrasing so responses stay framed as decision support, not decision replacement.

> **Industrial AI lesson:** Guardrails are not just about blocking bad words. They encode operating boundaries, accountability, and escalation paths.

### 6. Evaluations

I added a 12-case evaluation suite that checks for required mentions, banned phrasing, and expected evidence IDs. This gives the project a repeatable way to catch regressions when changing prompts, tools, retrieval logic, or guardrails.

For example, a good triage answer should mention the CIP delay, pH drift, temperature excursion, and relevant work orders. A bad answer would claim the batch is safe to release or cite an evidence ID that was never retrieved.

## Why It Is CDF-Ready

One of the reasons I built the data layer as an abstraction is that industrial AI is only as strong as the contextualized data foundation underneath it. Cognite Data Fusion is built around that idea: connecting raw industrial data to assets, equipment, time series, activities, documents, and relationships so applications can reason over operational context instead of isolated tags.

PharmaOps Copilot mirrors that pattern locally. The local data provider acts as a stand-in for the future CDF provider. Batch records can map to activities, equipment to asset hierarchy, signals to time series, SOPs to files, and deviations to domain-specific activities. That makes the project more than a one-off demo; it is a prototype for how an industrial agent could sit on top of a contextualized data platform.

## What I Learned

- **Industrial agents need tools, not just prompts.** The copilot should call deterministic functions, calculate stats, retrieve citations, and only then generate a narrative.
- **Trust comes from provenance.** Users need to know where an answer came from, especially in regulated environments.
- **Good AI UX is escalation-aware.** Sometimes the right answer is "this needs QA review," not a more confident paragraph.
- **Evaluation is product work.** Evals encode the behaviors that matter: required facts, forbidden claims, citation accuracy, and safe operating boundaries.
- **Contextualized data is the unlock.** A copilot becomes dramatically more useful when events, assets, time series, work orders, and SOPs are connected into one operational view.

## Why This Matters for Industrial Teams

Plants do not need AI that adds another layer of noise. They need AI that helps operators, engineers, and quality teams move faster without losing control. A copilot like PharmaOps can shorten investigations, improve shift handovers, surface relevant SOP guidance, and give leaders a clearer view of what happened during a deviation.

Most importantly, it supports the human decision maker. It does not decide batch release. It does not replace QA. It does not hide uncertainty. It organizes evidence and makes the next action easier to reason about.

## Conclusion

PharmaOps Copilot is a prototype, but it captures the direction I think industrial AI needs to go: agentic, contextualized, evidence-grounded, and built with real operating constraints in mind. The exciting part is not that an LLM can write a nice summary. The exciting part is that a properly designed copilot can connect messy industrial data into a useful operating narrative while preserving traceability and human accountability.

That is the kind of AI I want to build: practical systems that help heavy industry move from fragmented data to faster, safer, more confident decisions.
