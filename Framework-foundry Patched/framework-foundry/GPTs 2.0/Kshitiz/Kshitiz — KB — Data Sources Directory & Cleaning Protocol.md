# Kshitiz — Data Sources Directory & Cleaning Protocol

**Owner:** Kshitiz (Master Research & Data Analyst)
**Version:** 2.0 (Layaa OS)
**Last Updated:** April 2026
**Status:** Living Document — updated as data sources are discovered

---

## A-Level Sources (Primary)

| Source | Type | Data Available | Access |
|--------|------|---------------|--------|
| MeitY (Ministry of Electronics & IT) | Government | AI policy, digital India stats, IT industry data | Public — meity.gov.in |
| NASSCOM | Industry body | Indian IT/BPO/AI market size, workforce data, reports | Members + public summaries |
| MCA (Ministry of Corporate Affairs) | Government | Company registrations, filings, incorporations | Public — mca.gov.in |
| RBI | Regulator | Financial sector data, payment systems data | Public — rbi.org.in |
| DPIIT | Government | Startup registrations, FDI data, industrial policy | Public — dpiit.gov.in |
| MSME Census/Udyam portal | Government | MSME statistics, registrations by sector/state | Public — udyamregistration.gov.in |

---

## B-Level Sources (Published Research)

| Source | Type | Data Available | Cost |
|--------|------|---------------|------|
| NASSCOM-BCG/McKinsey Reports | Industry + consulting | AI adoption, digital transformation, market sizing | Free summaries, full reports paid |
| Gartner | Analyst firm | Technology market forecasts, Hype Cycle, Magic Quadrant | Paid (use free summaries) |
| Statista | Data aggregator | Market sizes, industry stats, survey data | Freemium |
| Inc42 / YourStory | Startup media | Indian startup funding, market trends, ecosystem data | Free |
| Tracxn | Startup intelligence | Indian startup data, funding rounds, competitor tracking | Freemium |
| IBEF (India Brand Equity Foundation) | Government-backed | Sector-specific reports on Indian industries | Free — ibef.org |
| RedSeer Consulting | India-focused | Indian internet economy, digital adoption | Free summaries |

---

## C-Level Sources (Secondary)

| Source | Type | Use Case |
|--------|------|----------|
| LinkedIn Sales Navigator | Professional network | Account research, decision maker identification |
| Google Trends | Search data | Trend identification, demand signals |
| SimilarWeb | Web analytics | Competitor traffic analysis, digital benchmark |
| Glassdoor/AmbitionBox | Employment | Company size estimation, culture signals |
| News articles (ET, Mint, etc.) | Business media | Current events, funding announcements, market signals |

---

## Data Cleaning & Preparation Checklist

Before any data enters an analysis:

- [ ] **Source verified** — Is this from a credible, identifiable source?
- [ ] **Date checked** — How old is this data? Flag if >2 years.
- [ ] **Geography confirmed** — Is this India-specific? Global data may not apply.
- [ ] **Segment matched** — Does this apply to SMEs/startups, or is it enterprise data?
- [ ] **Currency confirmed** — INR or USD? Conversion rate used? Year of conversion?
- [ ] **Sample size noted** — How many respondents/data points? Flag if <100.
- [ ] **Methodology reviewed** — Survey? Census? Estimate? Model?
- [ ] **Outliers identified** — Any data points that seem anomalous?
- [ ] **Duplicates removed** — Same data point from multiple sources counted once
- [ ] **Bias assessment** — Who funded the study? What is the reporting incentive?
