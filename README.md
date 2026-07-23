# whb_site — What Health Becomes

Static site. No build step, no dependencies. Edit HTML, commit, it's live.

## Deploy to GitHub Pages

1. Create a repo named `whb_site` on GitHub.
2. Push these files to the `main` branch (everything at the repo root — `index.html` must be top level).
3. Repo → **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main`, folder: `/ (root)`. Save.
4. Same page, **Custom domain**: enter `whathealthbecomes.com`. (The `CNAME` file already declares it.)
5. At your registrar, add DNS records for the apex domain — four A records pointing at GitHub:
   ```
   A  @  185.199.108.153
   A  @  185.199.109.153
   A  @  185.199.110.153
   A  @  185.199.111.153
   ```
   And one for www:
   ```
   CNAME  www  <your-github-username>.github.io
   ```
6. Wait for DNS to propagate (minutes to a few hours), then check **Enforce HTTPS** in Settings → Pages.

## Structure

```
index.html                        Home
essays/index.html                 Essay list
essays/<slug>/index.html          One essay
concepts/index.html               Glossary index
concepts/<slug>/index.html        One concept — the canonical definition
about/index.html                  About
assets/style.css                  All styling. Design tokens at the top.
assets/theme.js                   Light/dark toggle
CNAME, robots.txt, sitemap.xml    Deploy + discoverability
.nojekyll                         Tells Pages to serve files as-is
```

## URL rule (do not break this)

Every essay and concept lives at its own permanent directory path. Once a URL is public it never changes — the whole point of the concepts section is to be the canonical, citable source for these terms. If a title changes, keep the old slug.

## Adding an essay

1. `cp -r essays/the-aperture-problem essays/your-new-slug`
2. Edit the new `index.html`: title, description, canonical URL, `<h1>`, dek, prose, sources.
3. Add an `<article class="entry">` block to `essays/index.html` and to the homepage list.
4. Add the URL to `sitemap.xml`.

## Adding a concept

Same pattern in `concepts/`. Keep the definition first, one paragraph, quotable — that's the part AI systems and other writers will cite. Then elaboration, then "Where this appears."

## Changing the look

All color and type live in `:root` and `[data-theme="dark"]` at the top of `assets/style.css`. The three accent colors are the three clocks — `--clock1` lifetime, `--clock2` months, `--clock3` minutes. Changing them updates the wordmark, the hero, the links, and every diagram accent at once.

## Before publishing

- [ ] Employer outside-publication policy confirmed
- [ ] Family sign-off on the Section 1 story
- [ ] Real Substack URL in the Subscribe button (`index.html`)
- [ ] Real LinkedIn + email in `about/index.html`
- [ ] Add an OG share image (1200×630) and reference it in the meta tags
