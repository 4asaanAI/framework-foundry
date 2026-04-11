# Kshitiz — Reporting & Technical Reference

**Owner:** Kshitiz (Master Research & Data Analyst)
**Version:** 2.0 (Layaa OS)
**Last Updated:** April 2026
**Status:** Living Document — updated as reporting standards evolve

---

## Insights & Patterns Log Template

| Date | Insight | Source | Confidence | Relevant To | Action Suggested | Status |
|------|---------|--------|-----------|-------------|-----------------|--------|
| [Date] | [What was discovered] | [Data source] | [H/M/L] | [Which agent/decision] | [What should be done with this insight] | [New/Shared/Acted On] |

---

## Technical Glossary

| Term | Definition | Context at Layaa AI |
|------|-----------|-------------------|
| **TAM** | Total Addressable Market — total revenue opportunity if 100% market share | Used in investor pitches, market sizing |
| **SAM** | Serviceable Addressable Market — segment reachable with current business model | Used in strategic planning |
| **SOM** | Serviceable Obtainable Market — realistic capture in 3 years | Used in revenue projections |
| **CAC** | Customer Acquisition Cost — total cost to acquire one paying customer | Veer tracks; you validate benchmark |
| **LTV** | Lifetime Value — total revenue from a customer over relationship | Veer calculates; you validate methodology |
| **MQL** | Marketing Qualified Lead — lead that meets marketing criteria | Rishi tracks; you validate conversion benchmarks |
| **SQL** | Sales Qualified Lead — lead that meets sales criteria | Rishi tracks pipeline |
| **CAGR** | Compound Annual Growth Rate — annualized growth over multiple years | Used in market sizing and trend analysis |
| **NPS** | Net Promoter Score — customer loyalty metric (-100 to +100) | Industry benchmark reference |
| **ARR/MRR** | Annual/Monthly Recurring Revenue | Rishi tracks; SaaS client benchmark |
| **ICP** | Ideal Customer Profile — target customer characteristics | Mira defines; you provide data to validate |

---

## SQL Query Templates (Reference)

For querying PocketBase or any structured data:

```sql
-- Pipeline conversion by stage
SELECT stage, COUNT(*) as count,
       AVG(deal_value) as avg_value,
       SUM(deal_value) as total_value
FROM pipeline
WHERE created >= DATE('now', '-90 days')
GROUP BY stage;

-- Client engagement metrics
SELECT client_name, 
       COUNT(DISTINCT project_id) as projects,
       SUM(revenue) as total_revenue,
       AVG(satisfaction_score) as avg_satisfaction
FROM client_data
GROUP BY client_name;

-- Monthly trend analysis
SELECT strftime('%Y-%m', created) as month,
       COUNT(*) as count,
       SUM(value) as total_value
FROM [table]
GROUP BY month
ORDER BY month;
```

---

## Visualization & Reporting Reference

### When to Use Which Visualization

| Data Type | Best Visualization | Tool |
|-----------|-------------------|------|
| Comparison across categories | Bar chart (horizontal for many categories) | Excel, Tableau |
| Trend over time | Line chart | Excel, Tableau |
| Part-to-whole | Pie chart (max 5 segments) or stacked bar | Excel |
| Distribution | Histogram or box plot | Excel, Python |
| Correlation | Scatter plot | Excel, Python |
| Geographic | Map/heat map | Tableau, Power BI |
| Multiple metrics | Dashboard with KPI cards | Tableau, Power BI |
| Funnel data | Funnel chart | Power BI, custom |

### Report Formatting Standards
- Title: Clear, specific (not "Market Report" but "Indian EdTech Market Size Analysis, Q1 2026")
- Executive summary: Always first, always 2-3 sentences max
- Key findings: Numbered, evidence-tagged, actionable
- Data tables: Sorted by most important column, clearly labeled units
- Footnotes: Source citations, methodology notes, limitations
- Audit block: Mode, confidence, evidence status, assumptions

---

*This knowledge base is Kshitiz's reference for reporting standards and technical tools. Update whenever reporting standards evolve or new analytical tools are adopted. All updates follow the institutional memory protocol.*
