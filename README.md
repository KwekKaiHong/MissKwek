# Ms.Kwek Life Fun Quiz

This repository contains a simple single-page quiz game called **Ms.Kwek — Life Fun Quiz**.

The game consists of one HTML file and one PNG image, and can be hosted using GitHub Pages.

## Quick deployment (lazy mode)

A PowerShell script is included to initialize the repo and push to GitHub. Run the following from the `C:\Ms.Kwek` folder:

```powershell
# open PowerShell in this directory
.\deploy.ps1
```

If you have the [GitHub CLI](https://cli.github.com/) (`gh`) installed and authenticated, the script can even create the repository for you. Otherwise it will prompt for an existing repository URL.

The script will ask you for the GitHub repository URL (e.g. `https://github.com/<your‑user>/Ms.Kwek-quiz.git`) and then automatically:

1. run `git init` if needed
2. add the HTML, PNG and this README
3. commit with a message
4. create a `main` branch
5. add the remote
6. push to GitHub

After pushing, enable GitHub Pages on the `main` branch under the **Settings → Pages** tab of your repo. The site will be available at `https://<your‑user>.github.io/<repo-name>/`.

## Updating the game

Edit `Ms.Kwek.html` locally, then commit and push again:

```powershell
git add Ms.Kwek.html
git commit -m "update game"
git push
```

That's it. Share the URL with Miss Kwek and enjoy!



