Param(
    [string]$RemoteUrl
)

# make sure git is available
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Error "git command not found. Please install Git for Windows first."
    exit 1
}

# ask for remote url if not supplied
if (-not $RemoteUrl) {
    if (Get-Command gh -ErrorAction SilentlyContinue) {
        Write-Host "No repo URL provided. I'll try to create one using GitHub CLI (gh)."
        $defaultName = Read-Host "Repository name to create" -Default "misskwek-quiz"
        $visibility = Read-Host "Visibility (public/private)" -Default "public"
        gh repo create $defaultName --$visibility --confirm
        $RemoteUrl = "https://github.com/$($env:GITHUB_USER)/$defaultName.git"
        Write-Host "Created and set remote to $RemoteUrl"
    } else {
        $RemoteUrl = Read-Host "Enter your GitHub repo HTTPS URL (e.g. https://github.com/user/misskwek-quiz.git)"
    }
}

# initialize repository if necessary
if (-not (Test-Path .git)) {
    git init
}

# add files and commit
git add MISSKWEK.html MissKwek.png README.md

git commit -m "Initial quiz upload" 

# ensure branch name is main
git branch -M main

# add remote if it doesn't exist
$existing = git remote | Select-String -Pattern "^origin$"
if (-not $existing) {
    git remote add origin $RemoteUrl
} else {
    git remote set-url origin $RemoteUrl
}

# push to remote
Write-Host "Pushing to $RemoteUrl..."
try {
    git push -u origin main
    Write-Host "Push succeeded."
    Write-Host "If you haven't already, enable GitHub Pages in your repo settings."
} catch {
    Write-Error "Failed to push. Please ensure the repository exists and your network is working."
    exit 1
}
