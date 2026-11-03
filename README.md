# What They Stole ($WTS) — Ethereum website source

An independently hosted, static version of the token website. The page layout and visual effects are adapted from the reference website HTML and styles supplied in `New folder.rar`, with an Ethereum-inspired blue-violet palette, the approved $WTS logo, and $WTS copy and imagery. The site has no build step, application server, analytics, or wallet integration.

## Run locally

```sh
cd dist
python3 -m http.server 8000
```

Open `http://localhost:8000`. A local HTTP server also allows browser clipboard APIs to work.

## Deploy

This repo deploys automatically to **GitHub Pages** on every push to `main` via `.github/workflows/deploy.yml` (publishes the `dist/` folder). Live site: https://aaaa-web-deploy.github.io/WTS/

To update the site: edit files under `dist/`, then commit and push to `main` — Pages redeploys automatically.

You can also upload the **contents of `dist/`** to any other static host. The `.openai/hosting.json` file simply identifies the static directory and contains no project credentials.

## Configure official details

Edit `dist/config.js` and supply the verified contract address and official HTTPS links for X, Telegram, chart, and trade. The chain is preset to Ethereum. Without those values, the contract is hidden and social icons remain inactive. Do not publish unverified addresses or impersonate another project. Paths are relative, so the site can be deployed at a subpath.

## Files and behavior

- `dist/index.html`: page content and semantic markup.
- `dist/reference.css`: supplied reference-page styles, with asset URLs adapted for this project.
- `dist/wts.css`: $WTS layout adjustments and uncropped responsive imagery.
- `dist/ethereum.css`: Ethereum-inspired blue and violet palette, visible logo, spacing, and responsive refinements.
- `dist/config.js` and `dist/app.js`: configuration, scenario selector, scroll reveals, optional synthesized sound, and the reference-style departure animation.
- `dist/assets/`: approved logo, banner and story imagery, the four portraits, and three new visual assets for the rebuilt layout. No generated artwork has text.
- `dist/assets/story/01-the-prophecy.png` … `08-the-family-that-could-have-been.png`: eight-scene story mosaic used by the `#story` section.
- `dist/assets/fonts/`: locally hosted fallback fonts and license. Barlow Condensed and Space Grotesk are loaded from Google Fonts when reachable to match the reference; local alternatives keep the site readable if the font service is unavailable.

The election-night scenarios are speculative and the holographic map is decorative, not an election result. The project and visual story are fictional, independent satire; the site does not imply endorsement by the individuals depicted or Lucasfilm. Images preserve their proportions and are not cropped by CSS.
