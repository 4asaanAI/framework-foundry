
## Phase 1: Theme & Layout (do first — affects everything)
1. **New color system** — Light (#F5F3F0 base, #EEEBE7 surfaces, #E87A2E accent, #2B5797 nav) and Dark (#1A1A1A base, #2A2A2A cards, orange glow accents, blue nav)
2. **Header layout** — Search bar centered, icons right-aligned

## Phase 2: Global Search
3. **Command palette search** — Search across agents, chats, projects, skills, connectors, plugins, settings using cmdk

## Phase 3: Profile & Tokens
4. **Profile picture upload** — File upload to storage bucket, update avatar_url
5. **Dynamic token meter** — Real-time budget_used/budget_tokens display with live updates

## Phase 4: Directory / Library
6. **Directory dialog** — Tabbed modal (Skills, Connectors, Plugins) with search, filter, sort — like the Claude screenshot
7. **Add custom connector** — Manual add form (name, URL, OAuth fields) like second screenshot
8. **Skill upload** — Upload .json/.md skill files from local or create manually

## Phase 5: Chat Enhancements
9. **Projects ↔ Chat linking** — "Work in a project" dropdown pulls from projects table, can create new project inline
10. **@ agent split-screen** — When @agent is used, split chat view showing both agents side-by-side; secondary agent leaves when done

## Phase 6: Data Interlinking
11. **Real-time subscriptions** — Supabase realtime on agents, projects, tasks, connectors so changes propagate everywhere
12. **Cross-reference updates** — Editing agent name/prompt in one place updates all linked views
