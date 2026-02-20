---
layout: blog.njk
title: "Building AI Copilots Sellers Can Trust"
date: 2026-02-20
tags: ["AI", "Product", "Commerce", "Reliability", "Small Business", "blog"]
excerpt: "What I learned building a seller ops copilot: tool-first AI, structured outputs, and guardrails that keep recommendations honest."
---

Most small business owners do not have time to be analysts.

They have inventory arriving, employees to schedule, payments to reconcile, and customers waiting. Even when sellers have dashboards and exports, the hard part still shows up at the exact wrong moment: turning data into a decision without second guessing everything.

That is why I am excited about AI in commerce. Not because AI can talk, but because it can reduce the time between "what happened" and "what should I do next."

## The gap I keep seeing

The gap is not a lack of data. The gap is a lack of decision clarity.

Sellers ask questions like:
- What changed this week and why?
- What should I reorder today?
- Are we staffed correctly for tomorrow?
- Which items are quietly underperforming?
- What can I do right now to improve the next 7 days?

A good copilot should make those questions easier to answer. But it has to be trustworthy. If it is wrong with confidence, it is worse than useless.

## My rule for seller copilots: trust is the product

A seller will forgive a UI glitch. They will not forgive a confident recommendation that costs them money.

So when I started building my Seller Ops Copilot work sample, I anchored it around one principle:

The model should never be allowed to invent numbers or "sound right" without evidence.

That decision shaped everything else.

## The architecture I keep coming back to (tool-first and schema-first)

Instead of letting the model generate answers from vibes, I force it to do two things:
1) call tools that compute real metrics
2) return a structured response that a UI can render reliably

Here is the flow:

Seller question
  |
  v
LLM chooses tools to call (no numbers yet)
  |
  v
Typed tools compute metrics from structured data
  |
  v
LLM writes final response using tool outputs only
  |
  v
Schema validation + confidence + assumptions + sources

This is the difference between a fun demo and something that could actually be used.

## How I built it (my iteration loop)

I did not start by writing prompts. I started the way I would on a real product team:
- define the user problem
- define the output experience
- define constraints and failure modes
- then design the AI layer

My iteration loop looked like this:

1) Write the human logic first
   - What is a "good answer" for sales, inventory, staffing?
   - What should show up as metric cards?
   - What should every recommendation include so it is actionable?

2) Generate a first draft contract
   - I used Cursor/Codex to scaffold the data tools, API layer, and UI quickly.
   - I used an LLM to propose an initial system prompt and a structured output schema.

3) Run tests and collect failures
   The first versions were messy. Typical failure modes:
   - invalid JSON
   - missing fields
   - invented numbers
   - overly confident recommendations with shaky assumptions
   - answers that skipped the actual question

4) Feed failures back into the model
   I treated the prompt and schema like a product interface:
   - tighten the system prompt with explicit "JSON only" rules
   - make the schema stricter so it is hard to drift
   - add rules for missing data and ambiguity
   - add a "repair step" when parsing fails

5) Repeat until boring
   The best AI products feel boring in the best way.
   Predictable, grounded, consistent.

This is a standard best practice for AI product work: treat prompts like a spec, validate outputs like an API, and iterate until behavior is stable.

## Guardrails that matter in real life

These are the guardrails I consider non negotiable for seller copilots.

### 1) No invented numbers
If a number is shown, it must come from a tool result. If the data is missing, the assistant should say so clearly and ask for what it needs.

### 2) Structured outputs, not free-form text
A UI needs stable fields, not a vibe. So I require every response to include:
- answer_markdown (human readable summary)
- metrics (a small set of cards)
- actions (ranked recommendations)
- sources (what tools were used)
- warnings (assumptions, gaps, staleness)
- followups (good next questions)

### 3) Confidence and assumptions
Every action includes:
- confidence (low, med, high)
- assumptions (what must be true for this to work)

This keeps the system honest and gives sellers a way to judge risk.

### 4) Clarify before guessing
If the seller asks "How am I doing?" with no date range, the correct response is not a guess.
The correct response is a clarifying question with suggested ranges (last 7 days, last 30 days, month to date).

## A concrete example: schema-first output (code snippet)

Here is a simplified version of the structured output contract I use (TypeScript + Zod). The key idea is that the UI can trust the shape, and the model is forced into it.

```ts
import { z } from "zod";

const Confidence = z.enum(["low", "med", "high"]);

export const CopilotOutputSchema = z.object({
  answer_markdown: z.string().min(1),

  metrics: z.array(z.object({
    label: z.string().min(1),
    value: z.string().min(1),
    unit: z.string().optional(),
    trend: z.enum(["up", "down", "flat"]).optional(),
    delta: z.string().optional(),
  })).max(6),

  actions: z.array(z.object({
    title: z.string().min(1),
    rationale: z.string().min(1),
    expected_impact: z.string().min(1),
    confidence: Confidence,
    assumptions: z.array(z.string()).max(8),
  })).max(3),

  sources: z.array(z.object({
    type: z.enum(["table", "context", "rule"]),
    detail: z.string().min(1),
  })).min(1),

  warnings: z.array(z.string()).max(10),
  followups: z.array(z.string()).max(3),
});
```

This is not "extra process." It is how you make AI outputs behave like a product surface instead of a chat transcript.

## Evaluation: the part most demos skip

Prompts are brittle. Tool definitions change. Data changes. Without evaluation, you will ship regressions.

So I keep a lightweight evaluation set:
- 30 to 50 canonical questions a seller would actually ask
- expected tool calls for each
- forbidden behavior (like invented metrics)
- pass/fail checks on schema validity and basic grounding

This is another best practice: ship the evaluation harness with the product, not as an afterthought.

## Why this is exciting (and why Square)

I am excited about this space because it combines product craft and real world impact. When sellers get clarity faster, they waste less time, make fewer expensive mistakes, and compete better.

Square is one of the few companies positioned to do this at scale because its products sit directly in the day to day workflows of sellers. The opportunity is not "add AI." The opportunity is "use AI to make the right decisions easier, with trust built in."

That is the kind of product work I want to do.

## Links

- [Seller Ops Copilot live demo](https://rithwikgokhale.github.io/Seller-Ops-Copilot/)
- [Seller Ops Copilot code](https://github.com/rithwikgokhale/Seller-Ops-Copilot)
