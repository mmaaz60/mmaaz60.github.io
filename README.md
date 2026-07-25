# Muhammad Maaz personal research website

This is a clean static website for GitHub Pages. It has two main pages:

- `index.html`: profile, news, publications, experience, education, awards, and links.
- `timeline.html`: a chronological timeline of career and research milestones.

## Edit the website

Most updates only require editing one file:

```text
assets/js/data.js
```

Common edits:

- Add a news item: add an object to `news`.
- Add a paper: add an object to `publications`.
- Update the timeline: add or edit an object in `timeline`.
- Update profile links: edit `profile.links`.
- Update research interests: edit `profile.interests`.
- Update the CV: replace `assets/pdf/MuhammadMaazCV_Jul2526.pdf` with a newer file.

## Replace the photo

The current configuration uses the public image URL from your existing Wix site and falls back to `assets/img/profile.svg` if it fails to load.

For a fully self-hosted page:

1. Save your headshot as `assets/img/profile.jpg`.
2. Open `assets/js/data.js`.
3. Change `profile.image` to `assets/img/profile.jpg`.

## Run locally

Open `index.html` directly in a browser, or run:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploy with GitHub Pages

1. Create a GitHub repository, for example `mmaaz60.github.io`.
2. Upload all files in this folder to the repository root.
3. In GitHub, open Settings, then Pages.
4. Select the main branch and root folder.
5. Wait for GitHub Pages to publish the site.

## Optional custom domain

If you use a custom domain, add a file named `CNAME` at the repository root containing only the domain name, for example:

```text
www.mmaaz60.com
```

Also update `sitemap.xml` and the `url` field in the JSON-LD block inside `index.html`.
