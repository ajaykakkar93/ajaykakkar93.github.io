# deploy.ps1 - Push portfolio to GitHub Pages
# Repo: https://github.com/ajaykakkar93/ajaykakkar93.github.io

$ErrorActionPreference = "Stop"
$repoUrl = "https://github.com/ajaykakkar93/ajaykakkar93.github.io.git"
$branch  = (git symbolic-ref --short HEAD 2>$null)
if (-not $branch) { $branch = "main" }

Set-Location $PSScriptRoot

# ── Init git if not already a repo ──────────────────────────────────────────
if (-not (Test-Path ".git")) {
    Write-Host "Initializing git repository..." -ForegroundColor Cyan
    git init
    git remote add origin $repoUrl
} else {
    # Ensure remote is correct
    $remotes = git remote
    if ($remotes -notcontains "origin") {
        git remote add origin $repoUrl
    } else {
        git remote set-url origin $repoUrl
    }
}

# ── Stage all changes ────────────────────────────────────────────────────────
Write-Host "`nStaging all changes..." -ForegroundColor Cyan
git add -A

# ── Check if there's anything to commit ─────────────────────────────────────
$status = git status --porcelain
if (-not $status) {
    Write-Host "Nothing to commit - repo is up to date." -ForegroundColor Green
    exit 0
}

# ── Commit ───────────────────────────────────────────────────────────────────
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
$msg = "Update portfolio - $timestamp"
Write-Host "Committing: $msg" -ForegroundColor Cyan
git commit -m $msg

# ── Push ─────────────────────────────────────────────────────────────────────
Write-Host "`nPushing to $branch..." -ForegroundColor Cyan
git push -u origin $branch --force

Write-Host "`nDeployed! Live at https://ajaykakkar93.github.io" -ForegroundColor Green
