# AGENTS.md

This file is the durable instruction entrypoint for future Codex sessions.

- Always read `docs/project-state.md` before making implementation decisions.
- Read `docs/_local/current-session.md` if it exists before starting work.
- Treat `docs/project-state.md` as durable repo memory.
- Treat `docs/_local/current-session.md` as local working memory.
- Update `docs/project-state.md` only when long-term architecture, roadmap, constraints, or important decisions change.
- Update `docs/_local/current-session.md` at the end of every meaningful task.
- Never store secrets in these files.
- Keep these files concise and useful.
- Prefer exact next steps, constraints, changed files, and verification commands over long prose.
- Follow existing repository architecture and conventions.
- Avoid noisy or speculative notes.
- Keep `AGENTS.md` small and durable.
- No comments in code unless truly necessary.
- Use descriptive and consistent names.
- Prefer reusable modules/components over large multi-purpose files.
- Write production-grade code with maintainable structure, strong typing, validation, and error handling.
- Do not guess missing requirements; state assumptions explicitly when needed.
- Avoid hardcoded values, hacks, and tightly coupled logic.
- Keep code modular, testable, and scalable.
- Write commit messages under 140 characters.
