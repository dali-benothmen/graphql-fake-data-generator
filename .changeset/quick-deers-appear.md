---
"graphql-fake-data-generator": patch
---

Change fs.readFileSync to resolve the schema path with process.cwd() or \_\_dirname.
