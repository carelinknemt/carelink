---
paths:
  - resources/js/data/kms-docs.ts
---

# Data

## KMS docs content lives in code, rendered by pages/kms.tsx
The employee Knowledge Base (/kms) content is a typed block structure (paragraph, steps, callout, table) in resources/js/data/kms-docs.ts. Adding docs = adding a category/article there; no backend or CMS changes needed. The page renders inside the dashboard shell and uses hash URLs (#/category/article) for shareable article links. Do not move content into the CMS; the docs are intentionally code-based.
