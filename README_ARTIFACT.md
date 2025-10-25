# news-out.tgz — static export of this site

Location: `./news-out.tgz`

Size: ~144 KB

## What this is

- A static export of the Next.js site (generated with `next export`).
- Contains the `out/` folder with static HTML/CSS/JS ready to be served by any static host.

## Quick extract & preview

1. Extract the archive:

```bash
cd /Users/lawrencecorso/Desktop/Development/news-1
tar -xzf news-out.tgz
```

2. Serve locally with Python (no install required):

```bash
cd out
python3 -m http.server 5000
# open http://localhost:5000
```

Or, if you prefer a small static server via npm:

```bash
# install once globally (optional)
npm install -g serve
serve out
```

If you need a different artifact (a trimmed source zip under 10 MB) I can create one — but it will omit `node_modules` and possibly other files and the recipient will need to run `npm install` before running the project.

If you'd like, I can move `news-out.tgz` to a different path or upload it to a remote location; tell me where.
