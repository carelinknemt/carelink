---
paths:
  - 'resources/js/pages/dashboard/**, resources/js/pages/cms/**'
---

# Pages Cms

## Dashboard filter panels, full-width selects, icon tooltips
Every filter-enabled dashboard page uses the same Filters Card layout (Card with "Filters" CardTitle, fields in a sm:grid-cols-N grid depending on field count, live updates, no "Showing X-Y of Z" or "Results update as you type." text). Selects in forms/dialogs get className="w-full" to match input widths (never w-fit). Every icon-only action button is wrapped in Tooltip (use IconAction in components/ui/icon-action.tsx; for dropdown triggers use the Tooltip > DropdownMenu > TooltipTrigger > DropdownMenuTrigger nesting from shadcn).
