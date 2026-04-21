---
name: web-ppt-slide-export
description: Export visible text from static Web PPT HTML files into page-by-page Markdown for PDF, Word, or speaker-note workflows. Use when a slide deck stores each page in HTML `<section class="slide">` blocks and Codex needs to extract every page's content, preserve the deck's actual DOM order, or regenerate exports after slide edits.
---

# Web PPT Slide Export

## Overview

Export each slide's visible text from a static Web PPT HTML file into a Markdown document ordered by page appearance.

Use `scripts/export_slide_content.py` when the deck is already written in HTML and the main goal is content extraction rather than visual rendering.

## Workflow

1. Identify the input HTML file. Default to `index.html` when the project is a single-page deck.
2. Run the exporter:

```bash
python3 scripts/export_slide_content.py index.html -o exports/slide-content-export.md
```

3. Review the generated Markdown:
- Confirm the total page count at the top.
- Check that each section header uses sequential page numbers.
- Use the exported `原始页面 ID` line when you need to map content back to the source HTML.
4. Hand the Markdown off for PDF conversion, further copy-editing, or speaker-note cleanup.

## Output Rules

- Trust the exported page order more than numeric suffixes in IDs. Some decks use IDs like `slide-10-2` or reorder pages without renumbering.
- Expect the exporter to keep visible UI labels and demo text that are encoded in the HTML. This is intentional for content handoff.
- Expect layout, animation, and purely visual styling details to be omitted. The exporter is for text extraction, not visual reconstruction.
- Inspect the HTML first if the deck is rendered from runtime JavaScript data, canvas, or external APIs. This script is best for static, in-file slide markup.

## Resources

### scripts/

- `export_slide_content.py`: Parse a static slide deck HTML file and write a page-by-page Markdown export.
