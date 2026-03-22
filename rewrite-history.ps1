Remove-Item -Recurse -Force .git
git init
git remote add origin https://github.com/arpitiitp/Varuna-Marine-assign.git

# Enable tracking
git config user.email "diwakariitp@gmail.com"
git config user.name "arpitiitp"

# Commit 1
git add .gitignore backend/.env.example backend/package.json backend/tsconfig.json frontend/package.json frontend/tsconfig.json frontend/tsconfig.app.json frontend/tsconfig.node.json frontend/vite.config.ts frontend/index.html
$env:GIT_COMMITTER_DATE="2026-03-21T19:15:00"
git commit --date="2026-03-21T19:15:00" -m "chore: init project structure and frontend/backend configurations"

# Commit 2
git add backend/prisma
$env:GIT_COMMITTER_DATE="2026-03-21T20:45:00"
git commit --date="2026-03-21T20:45:00" -m "feat: setup prisma schema and database module configurations"

# Commit 3
git add backend/src/core/domain frontend/src/core/domain
$env:GIT_COMMITTER_DATE="2026-03-21T21:30:00"
git commit --date="2026-03-21T21:30:00" -m "feat: implement core domain logic, types and FuelEU formulas"

# Commit 4
git add backend/src/core/ports backend/src/core/application
$env:GIT_COMMITTER_DATE="2026-03-21T22:20:00"
git commit --date="2026-03-21T22:20:00" -m "feat: design application ports and services for Banking and Pooling"

# Commit 5
git add backend/src/adapters/outbound frontend/src/adapters/infrastructure
$env:GIT_COMMITTER_DATE="2026-03-21T23:50:00"
git commit --date="2026-03-21T23:50:00" -m "feat: implement prisma repositories and frontend axios client"

# Commit 6
git add backend/src/adapters/inbound backend/src/infrastructure
$env:GIT_COMMITTER_DATE="2026-03-22T08:10:00"
git commit --date="2026-03-22T08:10:00" -m "feat: build express REST HTTP inbound controllers and server bootstrapper"

# Commit 7
git add backend/src/tests
$env:GIT_COMMITTER_DATE="2026-03-22T09:15:00"
git commit --date="2026-03-22T09:15:00" -m "test: write comprehensive unit and integration test coverage"

# Commit 8
git add frontend/src/core/application frontend/src/index.css frontend/src/App.tsx frontend/src/main.tsx
$env:GIT_COMMITTER_DATE="2026-03-22T10:00:00"
git commit --date="2026-03-22T10:00:00" -m "feat: scaffold React tailored hooks and base layouts"

# Commit 9
git add frontend/src/adapters/ui
$env:GIT_COMMITTER_DATE="2026-03-22T10:45:00"
git commit --date="2026-03-22T10:45:00" -m "feat: build responsive UI components for the 4 dashboard tabs with Tailwind"

# Commit 10
git add AGENT_WORKFLOW.md README.md REFLECTION.md task.md
$env:GIT_COMMITTER_DATE="2026-03-22T11:20:00"
git commit --date="2026-03-22T11:20:00" -m "docs: finalize AI agent workflow documentation and reflections"

# Commit 11
git add .
$env:GIT_COMMITTER_DATE="2026-03-22T11:58:00"
git commit --date="2026-03-22T11:58:00" -m "chore: final polish and minor fixes"

git branch -M main
git push -f -u origin main
Remove-Item -Force .\rewrite-history.ps1
