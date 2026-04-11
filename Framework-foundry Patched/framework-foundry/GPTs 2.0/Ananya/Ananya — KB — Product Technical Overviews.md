# Ananya — Product Technical Overviews

**Owner:** Ananya (Personal Assistant for Shubham)
**Version:** 2.0 (Layaa OS)
**Last Updated:** April 2026
**Status:** Living Document — updated as products evolve

---

## EduFlow Technical Overview

### Product Description
AI-powered school management system designed for Indian schools (CBSE-affiliated).

### Tech Stack
- **Frontend:** Next.js + Tailwind CSS
- **Backend:** Node.js / Express.js
- **Database:** PostgreSQL (relational data: students, attendance, fees, assignments)
- **AI Integration:** Claude API for AI tutor, assignment generation, certificate generation
- **Messaging:** WhatsApp Business API for parent alerts
- **Hosting:** Indian VPS

### Core Features
1. **Attendance Tracking** — Digital attendance with analytics and trend reporting
2. **Fee Management** — Fee tracking, payment reminders, receipt generation
3. **Certificate Generation** — AI-powered certificate creation (transfer, character, achievement)
4. **Assignment Generation** — AI-generated assignments based on syllabus and difficulty level
5. **AI Tutor** — Student-facing AI assistant for homework help and concept explanations
6. **WhatsApp Parent Alerts** — Automated attendance, fee, and event notifications to parents

### Active Deployments
- **The Aaryans School** — Two branches: Joya and Meerut, Uttar Pradesh. CBSE-affiliated.
- **SSA (Akshat Sharma)** — EduFlow v2 platform deployment.

### Pricing Tiers
| Tier | Implementation | Monthly | Features |
|------|---------------|---------|----------|
| Starter | Rs.40,000 | Rs.3,500/mo | Core features |
| Growth | Rs.75,000 | Rs.6,000/mo | + AI tutor, advanced analytics |
| Premium | Rs.1,25,000 | Rs.9,000/mo | + Full AI suite, custom integrations |

---

## CA AI Agent Technical Overview

### Product Description
AI assistant for Chartered Accountants to automate document intake, data extraction, and form population for tax filing.

### Tech Stack
- **Frontend:** Next.js + Tailwind CSS
- **Backend:** NestJS (structured, modular architecture)
- **Database:** PostgreSQL (client PAN-linked data, financial records)
- **AI Integration:** Claude API for document understanding and data extraction
- **Messaging:** WhatsApp Business API for document intake
- **Document Processing:** OCR + AI extraction pipeline

### Core Features
1. **Document Intake via WhatsApp** — Clients send documents via WhatsApp; system ingests automatically
2. **AI Data Extraction** — Extract financial data from Form 16, bank statements, investment proofs
3. **Auto-Population of ITR/GST Forms** — Pre-fill tax return forms with extracted data
4. **Client PAN-Linked Database** — All client data organized by PAN, with document history
5. **Deadline Tracking** — Automated reminders for ITR, GST, TDS filing deadlines

### Architecture Notes
- NestJS chosen over Express for: module structure, dependency injection, TypeScript-first design, better suited for complex business logic
- Document processing pipeline: Upload > OCR (if scanned) > AI extraction > Structured data > Form mapping
- PAN-linked data model: each client record keyed by PAN, with linked documents, financial summaries, and filing history

### Pricing Tiers
| Tier | Implementation | Monthly | Target |
|------|---------------|---------|--------|
| Solo | Rs.25,000 | Rs.2,500/mo | Individual CA |
| Practice | Rs.50,000 | Rs.5,000/mo | Small practice (2-5 CAs) |
| Firm | Rs.1,00,000 | Rs.8,500/mo | Larger firm (5+ CAs) |
