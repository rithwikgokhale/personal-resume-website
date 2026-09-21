---
layout: blog.njk
title: "Why Industrial AI Needs Evidence First: Building PharmaOps Copilot"
date: 2026-09-20
tags: ["Industrial AI", "LLM / GenAI", "Pharma Manufacturing", "RAG", "Agentic AI", "blog"]
excerpt: "PharmaOps Copilot contextualizes siloed MES, historian, CMMS, QMS, and engineering data, then answers deviation questions from a deterministic evidence packet. GPT-4, Claude, or Gemini only write the narrative. 21/21 evals, including jailbreak refusal."
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

### 1. Messy IT/OT/ET into one model

The generator emits siloed MES, historian, CMMS, QMS, and engineering exports. A contextualization step resolves those exports into one JSON model and writes a join report a human can review. That is the part that matches real plants: the hard problem is identity, units, and clocks, not the chat box.

The unified model is mapped the way a CDF deployment would be mapped: ISA-95 site/area/unit and ISA-88 batch structure, high-volume events as a Records-style stream, and the deviation itself as a `PharmaDeviation` extension. The app still runs locally through an `IDataProvider`. A `CdfDataProvider` is a stub, and the Toolkit YAML under `cdf/` is a module skeleton, not a deployed project.

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

### 4. Hybrid retrieval, three model providers, and MCP

SOP lookup is hybrid keyword plus TF-IDF over a bounded document set. There is no vector database. On CDF, the same job is Atlas `askDocument`. The evidence-packet contract does not change when the retriever changes.

Narrative is optional. With no API key the copilot stays deterministic. With a key, the same packet can be rewritten by GPT-4, Claude, or Gemini. The user question and the packet are wrapped as data, with an instruction hierarchy so text inside a question or a document cannot override the system rules.

The same tool families are also served from a local MCP server shaped like Industrial MCP: query, time-series datapoints, and document ask. `npm run export:atlas` writes an Atlas agent, skill, and CLI eval suite from the guardrails and eval cases.

### 5. Guardrails for GxP-Sensitive Work

The copilot is designed to avoid making release, safety, or final quality decisions. If a user asks whether a batch can be released, the system routes the answer toward QA review instead of pretending to be an authority. A post-processor also neutralizes overreaching phrasing so responses stay framed as decision support, not decision replacement.

> **Industrial AI lesson:** Guardrails are not just about blocking bad words. They encode operating boundaries, accountability, and escalation paths.

### 6. Evaluations

The suite is 21 cases, and they pass. They check required mentions, banned phrases, and expected evidence IDs, including adversarial jailbreak and prompt-injection attempts.

A good triage answer has to mention the CIP delay, pH drift, temperature excursion, and the relevant work orders, and it has to cite IDs that were actually retrieved. A bad answer claims the batch is safe to release, or follows an instruction hidden in the question.

## Why It Is CDF-Ready

One of the reasons I built the data layer as an abstraction is that industrial AI is only as strong as the contextualized data foundation underneath it. Cognite Data Fusion is built around that idea: connecting raw industrial data to assets, equipment, time series, activities, documents, and relationships so applications can reason over operational context instead of isolated tags.

PharmaOps mirrors that locally, without a CDF tenant. ISA-88/95 views, a Records-style event stream, a `PharmaDeviation` extension, a local Industrial MCP server, and an Atlas agents-as-code export are all runnable from the repo. The project site walks through the architecture, the evals, and the field notes from building it: identity matching, units and clocks, policy guardrails, and evals-as-code. The value figures on that site are a worked discovery example, not a customer result.

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
