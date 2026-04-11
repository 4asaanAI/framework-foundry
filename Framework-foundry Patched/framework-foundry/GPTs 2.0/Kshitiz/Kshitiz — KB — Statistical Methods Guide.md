# Kshitiz — Statistical Methods Guide

**Owner:** Kshitiz (Master Research & Data Analyst)
**Version:** 2.0 (Layaa OS)
**Last Updated:** April 2026
**Status:** Living Document — updated as research methodologies are refined

---

## When to Use Which Method

| Analysis Need | Method | When | Key Requirements |
|--------------|--------|------|-----------------|
| Compare two groups | T-test / Mann-Whitney | A/B testing results, before/after comparison | Sample size >30 for parametric; check normality |
| Compare multiple groups | ANOVA / Kruskal-Wallis | Comparing across ICP segments, channels, time periods | Equal variance assumption for ANOVA |
| Identify relationships | Correlation (Pearson/Spearman) | Checking if two metrics move together | Clearly state "correlation, not causation" |
| Predict outcomes | Regression (Linear/Logistic) | Revenue forecasting inputs, churn prediction | Minimum 10 observations per predictor |
| Segment data | Cluster Analysis | Customer segmentation, market segmentation | Standardize variables, choose K carefully |
| Track trends over time | Time Series Analysis | Revenue trends, market growth, seasonal patterns | Minimum 12 data points for meaningful trend |
| Measure uncertainty | Confidence Intervals | Any point estimate in a report | Always report CI alongside point estimates |

---

## Common Statistical Pitfalls to Avoid

- **Simpson's Paradox** — A trend that appears in several groups of data reverses when groups are combined. Always check aggregation effects.
- **Survivorship Bias** — Only looking at successful companies when benchmarking. Include failure rates.
- **Small Sample Bias** — Indian SME market data often has n<100. Always flag sample size.
- **Selection Bias** — Survey respondents are not representative. Note who was NOT surveyed.
- **Anchoring** — First data point seen disproportionately influences interpretation. Seek multiple sources.
- **Recency Bias** — Weighting recent data too heavily. Look at 3-5 year trends, not just last quarter.
