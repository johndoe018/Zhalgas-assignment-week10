# MathAssess AI — AI-Supported Assessment Platform

A static, interactive mathematics assessment exploring **trigonometric equations** and the role of teacher judgment in AI-assisted feedback.

**Created by:** Maizhanov Zhalgas  
**Student ID:** 240105093  
**Assignment:** Build an AI-Supported Assessment Platform  
**Language:** English

- Repository: https://github.com/johndoe018/Zhalgas-assignment-week10
- GitHub Pages address: https://johndoe018.github.io/Zhalgas-assignment-week10/

## Features

- Responsive navy, indigo, and violet interface with mobile navigation and keyboard focus indicators.
- Interactive SVG unit-circle explorer, including degree angles, cosine, sine, quadrant labels, and axis cases.
- Exactly seven questions: six multiple-choice questions and one written response.
- Previous/next controls, direct question navigation, answer retention, completion progress, and missing-answer validation.
- Deterministic marking out of six, individual answer explanations, correct/incorrect labels, and a complete reset.
- Written response shown alongside a model solution and a separate four-point teacher/self-review checklist.
- Four explicitly fictional feedback examples, with AI drafts, teacher-reviewed scores and comments, and explanations of teacher changes.
- Side-by-side comparisons, expandable feedback panels, and a teacher-focus view.
- Three reusable prompts with clipboard copying, confirmation, and a fallback when Clipboard API permission is unavailable.
- The supplied personal reflection, unchanged, with a **139-word** count.
- Reduced-motion support, semantic controls, accessible labels, and a skip link.

## Responsible AI use

This website **does not call an AI service**. Multiple-choice marking uses a fixed answer key. The written response is **not automatically evaluated**; a teacher or the learner must use the rubric.

All sample responses, AI feedback, teacher feedback, and scores are prewritten demonstration content supplied in the assignment brief. The displayed prompts are examples for transparency and reuse; the website does not execute them.

Answers are held only in JavaScript memory for the current page session. There are no accounts, analytics, cookies, databases, API keys, or uploads. Reloading or selecting **Try Again** clears the attempt.

### Rubric and the supplied sample scores

Each written-response criterion is worth one point:

1. Identifies the reference angle of 60°.
2. Recognizes quadrants I and II.
3. Finds both solutions, 60° and 120°.
4. Provides a clear mathematical explanation.

The brief specifies teacher scores **A: 4/4, B: 2/4, C: 2/4, D: 1/4**. These are preserved exactly. B, C, and D require a holistic partial-credit interpretation: a strict all-or-nothing application of the four criteria would not yield those same scores. An expandable note explains the distinction and the importance of documenting a consistent partial-credit policy before real assessment. The self-review checklist uses the four binary criteria directly.

## Answer key

All angles are measured in degrees and satisfy **0° ≤ x < 360°**.

| Question | Equation        | Correct option   | Complete solution set |
| -------- | --------------- | ---------------- | --------------------- |
| 1        | sin(x) = 1/2    | A                | 30°, 150°             |
| 2        | cos(x) = 0      | B                | 90°, 270°             |
| 3        | tan(x) = 1      | A                | 45°, 225°             |
| 4        | 2sin(x) − 1 = 0 | C                | 30°, 150°             |
| 5        | cos(2x) = 1     | B                | 0°, 180°              |
| 6        | sin(x) = −√2/2  | C                | 225°, 315°            |
| 7        | sin(x) = √3/2   | Written response | 60°, 120°             |

For Question 5, 2x = 360°k, so x = 180°k. The endpoint 360° is excluded. For Question 7, the reference angle is 60°, sine is positive in quadrants I and II, and 180° − 60° = 120°.

## Files and technology

```text
index.html                         Semantic content and SVG illustration
style.css                          Responsive styling and local font declaration
script.js                          Quiz, review rubric, explorer, menu, and clipboard
README.md                          Project documentation
.nojekyll                          Serve the static project without Jekyll
assets/inter-latin-variable.woff2   Self-hosted Inter variable font
assets/OFL.txt                      Inter font license
```

Built with HTML5, CSS3, and vanilla ES6+ JavaScript. Icons are inline SVG. [Inter](https://fonts.google.com/specimen/Inter) is a Google Font, self-hosted from the `@fontsource-variable/inter` distribution under the SIL Open Font License. No CDN or other third-party runtime requests are needed. System fonts provide fallback for characters outside the bundled Latin subset.

## Run locally

Open `index.html` directly, or serve this folder with any static web server:

```sh
python -m http.server 8000
```

Then open http://localhost:8000. A local server improves clipboard support across browsers. All educational interactions run in the browser; Python is only an optional development server.

## Publish on GitHub Pages

1. Keep the website and `assets/` at the root of the default branch, `main`.
2. Open **Settings → Pages** in this repository.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Select **main** and **/(root)**, then **Save**.
5. Wait for the Pages deployment to finish and open https://johndoe018.github.io/Zhalgas-assignment-week10/.

Every local asset uses a relative path, so the site supports GitHub Pages project subdirectories. There is no build command, package installation, server process, or secret to configure. The repository must be public for GitHub Pages on a free account.

## Verification

The seven complete solution sets were independently checked with symbolic mathematics over the required half-open interval. Browser QA covers full-score, zero-score, and mixed-score submissions; incomplete and whitespace-only responses; answer retention; reset; safe display of written input; the independent rubric; all clipboard buttons; feedback views; unit-circle boundary values; mobile navigation; section links; and responsive widths from 320 to 1920 pixels.

The site is also checked for browser errors, horizontal overflow, static asset loading under a GitHub Pages-style project subdirectory, and WCAG A/AA accessibility issues. Direct `file://` testing is restricted by the managed browser's policy; static HTTP operation is verified. Manual review remains useful for the quality of mathematical explanations and real-world assistive-technology behavior.
