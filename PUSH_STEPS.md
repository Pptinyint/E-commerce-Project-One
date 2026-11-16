# Push this project to your GitHub repo

Your repo: https://github.com/Pptinyint/E-commerce-Project-One
(It is currently empty — these steps fill it with this project.)

Run these commands **from inside this project folder**:

```bash
cd /home/hatch/workspace/github-projects/e-commerce-project-one
```

## 1. Initialise git and commit

```bash
git init
git add .
git commit -m "Initial commit: Angular e-commerce storefront (ShopKart)"
```

## 2. Connect your GitHub repo

```bash
git branch -M main
git remote add origin https://github.com/Pptinyint/E-commerce-Project-One.git
```

## 3. Push

```bash
git push -u origin main
```

GitHub will ask for your username and a **personal access token** (not your
password) the first time. If you don't have a token yet: GitHub → Settings →
Developer settings → Personal access tokens → Tokens (classic) → Generate new
token, tick the `repo` scope, and paste it as the password when pushing.

## Later updates

After changing code, push again with:

```bash
git add .
git commit -m "Describe your change here"
git push
```

## Troubleshooting

- `remote origin already exists` — the remote is already added; skip step 2
  and just run `git push -u origin main`.
- `node_modules` or `dist` should never be committed — they are listed in
  `.gitignore`. If `git status` shows them, check that `.gitignore` is present
  in the project root.
