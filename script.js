/* Mathify AI: deterministic assessment, with no API calls or student-data storage. */
(() => {
  "use strict";

  const questions = [
    {
      name: "Sine basics",
      title: "Find both sine solutions.",
      equation: "sin(x) = 1/2",
      options: ["30°, 150°", "30°, 330°", "150°, 210°", "60°, 120°"],
      correct: 0,
      explanation:
        "Sine is positive in quadrants I and II. The reference angle is 30°.",
    },
    {
      name: "Cosine zeros",
      title: "Find where cosine is zero.",
      equation: "cos(x) = 0",
      options: ["0°, 180°", "90°, 270°", "45°, 225°", "180°, 360°"],
      correct: 1,
      explanation: "Cosine equals zero at 90° and 270° in the given interval.",
    },
    {
      name: "Tangent values",
      title: "Find the tangent solutions.",
      equation: "tan(x) = 1",
      options: ["45°, 225°", "45°, 135°", "90°, 270°", "135°, 315°"],
      correct: 0,
      explanation:
        "Tangent is positive in quadrants I and III, with a reference angle of 45°.",
    },
    {
      name: "Rearranging",
      title: "Rearrange, then solve.",
      equation: "2sin(x) − 1 = 0",
      options: ["60°, 120°", "30°, 330°", "30°, 150°", "150°, 210°"],
      correct: 2,
      explanation: "Rearranging gives sin(x) = 1/2, so x = 30° or x = 150°.",
    },
    {
      name: "Double angles",
      title: "Look closely at the double angle.",
      equation: "cos(2x) = 1",
      options: ["0°, 90°", "0°, 180°", "90°, 270°", "180°, 270°"],
      correct: 1,
      explanation:
        "cos(2x) = 1 when 2x = 360°k, where k is an integer. Therefore x = 180°k. Within the interval, x = 0° and 180°. The endpoint 360° is excluded.",
    },
    {
      name: "Negative sine",
      title: "Think about negative sine.",
      equation: "sin(x) = −√2/2",
      options: ["45°, 135°", "135°, 225°", "225°, 315°", "45°, 315°"],
      correct: 2,
      explanation:
        "Sine is negative in quadrants III and IV. The reference angle is 45°.",
    },
    {
      name: "Explain your thinking",
      title: "The answer matters. So does the why.",
      equation: "sin(x) = √3/2",
    },
  ];

  const rubric = [
    "Identifies the correct reference angle of 60°.",
    "Recognizes quadrants I and II.",
    "Finds both correct solutions, 60° and 120°.",
    "Provides a clear mathematical explanation.",
  ];

  const state = {
    current: 0,
    answers: Array(6).fill(null),
    written: "",
    submitted: false,
  };
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const icon = (name, extra = "") =>
    `<svg class="icon ${extra}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const letter = (index) => String.fromCharCode(65 + index);
  const wordCount = (text) =>
    text.trim() ? text.trim().split(/\s+/u).length : 0;
  const answered = () =>
    state.answers.filter((answer) => answer !== null).length +
    Number(Boolean(state.written.trim()));
  let toastTimer;

  function toast(message) {
    const element = $("#toast");
    clearTimeout(toastTimer);
    element.textContent = message;
    element.classList.add("is-visible");
    toastTimer = setTimeout(() => element.classList.remove("is-visible"), 2800);
  }

  function updateProgress() {
    const count = answered();
    $("#completion-count").textContent = `${count} of 7 answered`;
    $("#quiz-progress").setAttribute("aria-valuenow", String(count));
    $("#quiz-progress-fill").style.width = `${(count / 7) * 100}%`;
    $$(".question-step").forEach((button, index) => {
      const done =
        index < 6
          ? state.answers[index] !== null
          : Boolean(state.written.trim());
      button.classList.toggle("answered", done);
      button.setAttribute(
        "aria-label",
        `Question ${index + 1}: ${questions[index].name}${done ? ", answered" : ", unanswered"}`,
      );
      button.querySelector(".step-done").toggleAttribute("hidden", !done);
    });
  }

  function renderQuestion(focus = false) {
    const question = questions[state.current];
    const isWritten = state.current === 6;
    $("#question-counter").textContent =
      `QUESTION ${String(state.current + 1).padStart(2, "0")} / 07`;
    $$(".question-step").forEach((button, index) => {
      if (index === state.current) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });

    $("#question-content").innerHTML = `
      <div class="question-type">${icon(isWritten ? "pencil" : "book")}${isWritten ? "Written response · 4 rubric points · Teacher / self-review" : "Multiple choice · Select one answer"}</div>
      <h3 class="question-heading" id="question-heading" tabindex="-1">${question.title}</h3>
      <p class="question-instruction">Solve the equation for 0° ≤ x &lt; 360°.${isWritten ? "<br>Explain your solution using the reference angle and the unit circle." : ""}</p>
      <div class="equation-display"><span class="math">${question.equation}</span><span class="equation-interval">0° ≤ x &lt; 360°</span></div>
      ${
        isWritten
          ? `
        <label class="written-label" for="written-response">Your solution and mathematical explanation</label>
        <textarea class="written-response" id="written-response" name="written-response" rows="5" maxlength="5000" aria-describedby="written-guidance written-review-note" placeholder="Describe the reference angle, identify the relevant quadrants, and explain how you find all solutions…" required></textarea>
        <div class="written-helper"><span id="written-guidance">Use degrees. Show your reasoning, not just the answers.</span><span id="written-word-count">${wordCount(state.written)} words</span></div>
        <div class="review-notice" id="written-review-note">${icon("shield")}<span>Your response is not automatically graded. After submission, compare it with the model answer and use the four-point rubric for teacher or self-review.</span></div>
      `
          : `
        <fieldset class="answer-options"><legend>Solve ${question.equation} for 0° ≤ x &lt; 360°. Select one answer.</legend>
        ${question.options
          .map(
            (option, index) => `
          <label class="answer-option" for="answer-${state.current}-${index}">
            <input id="answer-${state.current}-${index}" type="radio" name="question-${state.current}" value="${index}" ${state.answers[state.current] === index ? "checked" : ""} required>
            <span class="option-letter">${letter(index)}</span><span>${option}</span>${icon("check", "option-check")}
          </label>`,
          )
          .join("")}
        </fieldset>
      `
      }`;

    if (isWritten) {
      const textarea = $("#written-response");
      // Assign through value: written input is never interpolated into HTML.
      textarea.value = state.written;
      textarea.addEventListener("input", () => {
        state.written = textarea.value;
        $("#written-word-count").textContent =
          `${wordCount(state.written)} words`;
        if (state.written.trim()) textarea.removeAttribute("aria-invalid");
        updateProgress();
      });
    } else {
      $$(".answer-option input").forEach((input) =>
        input.addEventListener("change", () => {
          state.answers[state.current] = Number(input.value);
          updateProgress();
        }),
      );
    }

    $("#previous-question").disabled = state.current === 0;
    $("#next-question").hidden = isWritten;
    $("#submit-quiz").hidden = !isWritten;
    $("#marking-note").textContent = isWritten
      ? "Reviewed with a four-point rubric"
      : "1 point per multiple-choice question";
    updateProgress();
    if (focus) $("#question-heading").focus({ preventScroll: true });
  }

  function navigateTo(index) {
    state.current = Math.max(0, Math.min(6, index));
    $("#quiz-error").hidden = true;
    renderQuestion(true);
    const rect = $("#quiz-workspace").getBoundingClientRect();
    if (rect.top < 75 || rect.top > innerHeight - 150) {
      $("#quiz-workspace").scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
    }
  }

  function showResults() {
    const score = state.answers.reduce(
      (total, answer, index) =>
        total + Number(answer === questions[index].correct),
      0,
    );
    const results = $("#quiz-results");
    results.innerHTML = `
      <div class="results-card">
        <div class="results-banner"><div class="results-score"><div class="score-ring" aria-label="Score ${score} out of 6"><div>${score}<span> / 6</span></div></div><div><span class="eyebrow">ASSESSMENT COMPLETE</span><h3>${score === 6 ? "Every angle, understood." : score >= 4 ? "A strong foundation to build on." : "Every attempt is a step forward."}</h3><p>${score} of 6 multiple-choice answers correct. Your written response is reviewed separately.</p></div></div><button class="button" type="button" id="try-again">${icon("reset")} Try Again</button></div>
        <div class="results-body"><h4>Your answers, with the reasoning.</h4>
          ${questions
            .slice(0, 6)
            .map((question, index) => {
              const correct = state.answers[index] === question.correct;
              return `<details class="result-item ${correct ? "correct" : "incorrect"}" ${!correct ? "open" : ""}>
              <summary><span class="result-status ${correct ? "correct" : "incorrect"}" aria-hidden="true">${correct ? "✓" : "×"}</span><span>Q${index + 1}. ${question.equation}</span><span class="result-tag">${correct ? "Correct · 1/1" : "Incorrect · 0/1"}</span>${icon("chevron", "details-chevron")}</summary>
              <div class="result-detail"><div class="result-answer"><span class="${correct ? "" : "incorrect-choice"}">Your answer: <strong>${letter(state.answers[index])}. ${question.options[state.answers[index]]}</strong></span>${!correct ? `<span>Correct answer: <strong>${letter(question.correct)}. ${question.options[question.correct]}</strong></span>` : "<span>Matches the correct answer.</span>"}</div><p class="result-explanation">${question.explanation}</p></div>
            </details>`;
            })
            .join("")}
          <section class="written-review" aria-labelledby="written-review-title"><span class="eyebrow section-kicker">QUESTION 07 / TEACHER OR SELF-REVIEW</span><h3 id="written-review-title">Make your reasoning visible.</h3><p>Solve sin(x) = √3/2 for 0° ≤ x &lt; 360°. This response has not been automatically evaluated.</p>
            <div class="written-review-grid"><div class="response-review-box"><h4>Your response</h4><p id="submitted-response" class="submitted-response"></p></div><div class="model-answer"><h4>Model answer</h4><p>The reference angle is <strong>60°</strong> because sin(60°) = √3/2. Sine is positive in <strong>quadrants I and II</strong>. In quadrant II, 180° − 60° = 120°. Therefore, <strong>x = 60° or x = 120°</strong>.</p></div></div>
            <div class="rubric-header"><h4>Four-point review rubric</h4><output id="rubric-score" aria-live="polite">Self-review: 0 / 4</output></div><div class="rubric-list">${rubric.map((criterion, index) => `<label class="rubric-item" for="rubric-${index}"><input id="rubric-${index}" class="rubric-check" type="checkbox" value="1"><span>${criterion}<small>1 point · Check if demonstrated</small></span></label>`).join("")}</div><p class="rubric-footnote">Select criteria yourself or with your teacher. This checklist records your review, not an AI score, and is separate from your ${score}/6 multiple-choice result.</p>
          </section>
        </div>
      </div>`;

    $("#submitted-response").textContent = state.written;
    $("#quiz-workspace").hidden = true;
    results.hidden = false;
    results.focus({ preventScroll: true });
    results.scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
    $("#try-again").addEventListener("click", resetQuiz);
    $$(".rubric-check").forEach((checkbox) =>
      checkbox.addEventListener("change", () => {
        $("#rubric-score").textContent =
          `Self-review: ${$$(".rubric-check:checked").length} / 4`;
      }),
    );
    toast(`Assessment submitted. Your score is ${score} out of 6.`);
  }

  function resetQuiz() {
    state.current = 0;
    state.answers = Array(6).fill(null);
    state.written = "";
    state.submitted = false;
    $("#quiz-results").hidden = true;
    $("#quiz-results").replaceChildren();
    $("#quiz-workspace").hidden = false;
    $("#quiz-error").hidden = true;
    renderQuestion(true);
    $("#quiz-workspace").scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
    toast("Fresh start. Your assessment has been reset.");
  }

  $("#question-nav").innerHTML = questions
    .map(
      (question, index) =>
        `<button type="button" class="question-step" data-question="${index}"><span class="question-number">${String(index + 1).padStart(2, "0")}</span><span class="question-step-name">${question.name}</span>${icon("check", "step-done")}</button>`,
    )
    .join("");
  $$(".question-step").forEach((button) =>
    button.addEventListener("click", () =>
      navigateTo(Number(button.dataset.question)),
    ),
  );
  $("#previous-question").addEventListener("click", () =>
    navigateTo(state.current - 1),
  );
  $("#next-question").addEventListener("click", () =>
    navigateTo(state.current + 1),
  );
  $("#quiz-form").addEventListener("submit", (event) => {
    event.preventDefault();
    if (state.submitted) return;
    // Enter on an early step navigates; it never submits an unfinished assessment.
    if (state.current < 6) {
      navigateTo(state.current + 1);
      return;
    }
    const missing = state.answers
      .map((answer, index) => (answer === null ? index + 1 : null))
      .filter(Boolean);
    if (!state.written.trim()) missing.push(7);
    if (missing.length) {
      state.current = missing[0] - 1;
      renderQuestion(true);
      $("#quiz-error").textContent =
        `Before submitting, complete question${missing.length > 1 ? "s" : ""} ${missing.join(", ")}. Your existing answers have been kept.`;
      $("#quiz-error").hidden = false;
      if (state.current === 6) {
        $("#written-response").setAttribute("aria-invalid", "true");
        $("#written-response").focus({ preventScroll: true });
      }
      return;
    }
    state.submitted = true;
    showResults();
  });

  renderQuestion();

  // The explorer is a local mathematical visualization, not an AI tool.
  function updateCircle() {
    const degrees = Number($("#angle-slider").value);
    const radians = (degrees * Math.PI) / 180;
    const cosine = Math.cos(radians);
    const sine = Math.sin(radians);
    const x = 200 + 112 * cosine;
    const y = 155 - 112 * sine;
    const format = (value) =>
      Math.abs(value) < 0.0005 ? "0.000" : value.toFixed(3);
    const axis = degrees % 90 === 0;
    const quadrant = axis
      ? degrees % 180 === 0
        ? "On the x-axis"
        : "On the y-axis"
      : `Quadrant ${["I", "II", "III", "IV"][Math.floor(degrees / 90)]}`;
    $("#angle-value").value = `${degrees}°`;
    $("#cos-value").textContent = format(cosine);
    $("#sin-value").textContent = format(sine);
    $("#quadrant-value").textContent = quadrant;
    $("#angle-slider").setAttribute(
      "aria-valuetext",
      `${degrees} degrees. ${quadrant}. Cosine ${format(cosine)}. Sine ${format(sine)}.`,
    );
    $("#radius-line").setAttribute("d", `M200 155 ${x} ${y}`);
    $("#cos-line").setAttribute("d", `M200 155H${x}`);
    $("#sin-line").setAttribute("d", `M${x} 155V${y}`);
    ["#unit-point", "#unit-point-halo"].forEach((selector) => {
      $(selector).setAttribute("cx", String(x));
      $(selector).setAttribute("cy", String(y));
    });
    const smallX = 200 + 35 * cosine;
    const smallY = 155 - 35 * sine;
    // A 360° sector is a circle; the SVG arc needs two segments at this endpoint.
    const sector =
      degrees === 360
        ? "M200 155h35a35 35 0 1 0-70 0a35 35 0 1 0 70 0Z"
        : `M200 155h35A35 35 0 ${degrees > 180 ? 1 : 0} 0 ${smallX} ${smallY}Z`;
    $("#angle-wedge").setAttribute("d", sector);
    $("#angle-svg-label").textContent = `${degrees}°`;
    $("#circle-description").textContent =
      `At ${degrees} degrees, cosine is ${format(cosine)} and sine is ${format(sine)}. ${quadrant}. Use the angle slider below to explore.`;
  }
  $("#angle-slider").addEventListener("input", updateCircle);
  updateCircle();

  // Keep one working explorer, moving it into the feed on smaller screens.
  const explorer = $("#explorer-card");
  const compactLayout = matchMedia("(max-width: 1100px)");
  let mobileExplorerOpen = false;
  function positionExplorer() {
    const slot = compactLayout.matches
      ? $("#mobile-explorer-slot")
      : $("#rail-explorer-slot");
    slot.append(explorer);
    explorer.open = compactLayout.matches ? mobileExplorerOpen : true;
  }
  explorer.addEventListener("toggle", () => {
    if (compactLayout.matches) mobileExplorerOpen = explorer.open;
  });
  compactLayout.addEventListener("change", positionExplorer);
  positionExplorer();

  const menu = $(".menu-toggle");
  const nav = $("#primary-nav");
  function closeMenu(returnFocus = false) {
    nav.classList.remove("is-open");
    menu.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-label", "Open navigation");
    menu.querySelector("use").setAttribute("href", "#i-menu");
    if (returnFocus) menu.focus();
  }
  menu.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") !== "true";
    nav.classList.toggle("is-open", open);
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute(
      "aria-label",
      open ? "Close navigation" : "Open navigation",
    );
    menu
      .querySelector("use")
      .setAttribute("href", open ? "#i-close" : "#i-menu");
  });
  nav
    .querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", () => closeMenu()));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open"))
      closeMenu(true);
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".nav-shell")) closeMenu();
  });
  matchMedia("(min-width: 701px)").addEventListener("change", (event) => {
    if (event.matches) closeMenu();
  });

  $$("[data-view]").forEach((button) =>
    button.addEventListener("click", () => {
      const teacherOnly = button.dataset.view === "teacher";
      $("#feedback-cards").classList.toggle("teacher-focus", teacherOnly);
      $$("[data-view]").forEach((toggle) =>
        toggle.setAttribute("aria-pressed", String(toggle === button)),
      );
      if (teacherOnly)
        $$(".feedback-details").forEach((details) => {
          details.open = true;
        });
    }),
  );

  async function copyText(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      /* Use the selection-based fallback when permission is unavailable. */
    }
    const previouslyFocused = document.activeElement;
    const helper = document.createElement("textarea");
    helper.value = text;
    helper.setAttribute("aria-label", "Prompt text for copying");
    helper.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0";
    document.body.append(helper);
    helper.select();
    let success = false;
    try {
      success = document.execCommand("copy");
    } catch {
      success = false;
    }
    helper.remove();
    if (previouslyFocused instanceof HTMLElement)
      previouslyFocused.focus({ preventScroll: true });
    return success;
  }

  $$(".copy-button").forEach((button) =>
    button.addEventListener("click", async () => {
      const prompt = document.getElementById(button.dataset.copy);
      button.disabled = true;
      const success = await copyText(
        prompt.textContent.replace(/\s+/gu, " ").trim(),
      );
      button.querySelector("span").textContent = success
        ? "Copied!"
        : "Select text to copy";
      button
        .querySelector("use")
        .setAttribute("href", success ? "#i-check" : "#i-copy");
      toast(
        success
          ? "Prompt copied to clipboard."
          : "Clipboard unavailable. Select the prompt text and copy it manually.",
      );
      if (!success) {
        const range = document.createRange();
        range.selectNodeContents(prompt);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      }
      setTimeout(() => {
        button.disabled = false;
        button.querySelector("span").textContent = "Copy prompt";
        button.querySelector("use").setAttribute("href", "#i-copy");
      }, 2200);
    }),
  );

  const reflection = $$("#reflection-text p")
    .map((paragraph) => paragraph.textContent)
    .join(" ");
  $("#reflection-word-count").textContent = `${wordCount(reflection)} words`;

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            $$(".nav-link, .feed-tab, .mobile-nav-link").forEach((link) => {
              const active =
                link.getAttribute("href") === `#${entry.target.id}`;
              link.classList.toggle("is-active", active);
              if (active) link.setAttribute("aria-current", "location");
              else link.removeAttribute("aria-current");
            });
          }
        });
      },
      { rootMargin: "-15% 0px -65% 0px", threshold: 0 },
    );
    $$("main > section").forEach((section) => observer.observe(section));
  }
})();
