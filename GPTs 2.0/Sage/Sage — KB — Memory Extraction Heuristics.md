# Sage — KB — Memory Extraction Heuristics

> Best practices for extracting high-quality memories from conversations, including the extraction mindset, quality rubrics, conversation-type-specific heuristics, and confidence assignment guidelines.

---

## 1. The Extraction Mindset

Think of memory extraction like a journalist taking notes during an interview. You are not transcribing — you are identifying the newsworthy facts. A 30-minute conversation might produce 3 key facts worth remembering forever.

**Golden Rule:** If a future agent, reading only this memory (without the conversation), would find it useful and understandable — it is a good memory.

---

## 2. Extraction Quality Rubric

| Quality Level | Description | Example |
|--------------|-------------|---------|
| **Excellent** | Specific, actionable, standalone, includes context | "Aaryans School Meerut branch requested SMS alerts for attendance (not just WhatsApp) as of April 2026." |
| **Good** | Clear fact, slightly less context | "Aaryans School wants SMS alerts for attendance." |
| **Acceptable** | Captures the fact but lacks specificity | "Client wants SMS alerts." |
| **Poor** | Vague, not standalone | "They want something different for notifications." |
| **Rejected** | Cannot be understood without conversation context | "She said yes to that." |

---

## 3. Extraction Heuristics by Conversation Type

### Strategy Discussions (Kabir, Founders)
- Extract: Decisions made, options considered, reasoning behind choices
- Extract: Strategic priorities and their order
- Extract: Founder preferences about approach
- Skip: Brainstorming that led nowhere, tentative "what if" scenarios

### Client Conversations (Arjun, Rohit, Yuvaan)
- Extract: Client name, company, industry, size, pain points
- Extract: Budget signals, timeline expectations, decision-maker identity
- Extract: Feature requests, complaints, positive feedback
- Skip: Small talk, scheduling logistics, repeated introductions

### Technical Discussions (Ujjawal, Dev, Shubham)
- Extract: Architecture decisions and rationale
- Extract: Technology choices (what was chosen AND what was rejected, and why)
- Extract: Performance benchmarks, constraints, requirements
- Skip: Debugging sessions (too granular), speculative architecture

### Financial/Legal Discussions (Aarav, Anne, Abhay, Veer)
- Extract: Pricing decisions, margin calculations, compliance deadlines
- Extract: Contract terms agreed upon, legal risks identified
- Extract: Filing dates, registration numbers, deadline changes
- Skip: Draft iterations (only final version matters), calculation steps

### Marketing/Content Discussions (Mira, Tara, Zoya)
- Extract: Campaign decisions, target audience changes, brand voice rulings
- Extract: Performance data and benchmarks
- Extract: Content format preferences, posting schedule decisions
- Skip: Content drafts (stored elsewhere), brainstorming that was discarded

---

## 4. Confidence Assignment Guide

| Scenario | Starting Confidence | Rationale |
|----------|-------------------|-----------|
| Founder explicitly states a fact | 0.95 | Highest authority source |
| Founder makes a decision | 0.90 | Clear decision with authority |
| Agent reports validated data | 0.85 | Evidence-backed |
| Agent makes a recommendation | 0.60 | Could change; recommendation not decision |
| User mentions something in passing | 0.50 | Casual mention, may not be precise |
| Inferred from conversation context | 0.40 | Not explicitly stated |
| Contradicts existing memory | 0.30 | Needs investigation before trust |

---

*This document is part of the Sage Knowledge Base. It covers the foundational practices for extracting high-quality memories from all conversation types across Layaa AI's agent workforce.*
