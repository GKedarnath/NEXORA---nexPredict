(() => {
  "use strict";

  const DIMENSIONS = [
    "risk",
    "curiosity",
    "analysis",
    "social",
    "speed",
    "planning",
    "exploration",
    "convenience"
  ];

  const LETTERS = ["A", "B", "C", "D"];
  const QUESTIONS_PER_SESSION = 6;
  const SESSION_KEY = "nexora-glc-decision-count";

  /**
   * Question bank. Each option contributes weighted points to hidden dimensions.
   * Add questions by copying this shape. Keep exactly four options.
   */
  const QUESTION_BANK = [
    {
      id: "twenty-minutes",
      prompt: "You have 20 minutes before your next session. What do you do?",
      options: [
        { text: "Explore something you've never seen before", scores: { exploration: 3, curiosity: 2, risk: 1 } },
        { text: "Find the most comfortable place nearby", scores: { convenience: 3, planning: 1 } },
        { text: "Catch up with someone you haven't spoken to", scores: { social: 3, curiosity: 1 } },
        { text: "Finish something you've been postponing", scores: { planning: 3, analysis: 1, speed: 1 } }
      ]
    },
    {
      id: "two-routes",
      prompt: "You're given two routes to the same destination.",
      options: [
        { text: "The fastest route, even if unfamiliar", scores: { speed: 3, risk: 2, exploration: 1 } },
        { text: "The familiar route with predictable traffic", scores: { convenience: 3, planning: 2 } },
        { text: "The scenic route", scores: { curiosity: 2, exploration: 3 } },
        { text: "Check the data before deciding", scores: { analysis: 3, planning: 2 } }
      ]
    },
    {
      id: "panel-mic",
      prompt: "A panel opens the floor for one last question. You have a thought forming.",
      options: [
        { text: "Stand up and ask it now", scores: { risk: 3, speed: 2, social: 1 } },
        { text: "Wait to see if someone else asks it first", scores: { analysis: 2, convenience: 2 } },
        { text: "Turn to the person beside you and test the idea", scores: { social: 3, curiosity: 1 } },
        { text: "Note it down and look into it after the session", scores: { planning: 3, analysis: 2 } }
      ]
    },
    {
      id: "networking",
      prompt: "The break begins. The room splits in four directions.",
      options: [
        { text: "Walk up to a group you do not know", scores: { social: 2, risk: 3, exploration: 1 } },
        { text: "Find a quiet corner and review the agenda", scores: { planning: 3, analysis: 1, convenience: 1 } },
        { text: "Rejoin people you already met this morning", scores: { social: 2, convenience: 2 } },
        { text: "Scan the room, then choose the most useful conversation", scores: { analysis: 3, social: 1 } }
      ]
    },
    {
      id: "two-tools",
      prompt: "You can try only one version of the same tool.",
      options: [
        { text: "The experimental build with new features", scores: { curiosity: 3, risk: 2, exploration: 1 } },
        { text: "The stable version everyone already uses", scores: { convenience: 3, planning: 1 } },
        { text: "Ask the person next to you which they would pick", scores: { social: 3 } },
        { text: "Compare the spec sheet first", scores: { analysis: 3, planning: 2 } }
      ]
    },
    {
      id: "empty-slot",
      prompt: "A session is cancelled. You suddenly have an open hour.",
      options: [
        { text: "Wander into a track you did not register for", scores: { exploration: 3, curiosity: 2, risk: 1 } },
        { text: "Use the hour to rest and reset", scores: { convenience: 3 } },
        { text: "Set up a conversation you have been meaning to have", scores: { social: 3, planning: 1 } },
        { text: "Map the rest of the day and tighten your plan", scores: { planning: 3, analysis: 2 } }
      ]
    },
    {
      id: "keynote",
      prompt: "A keynote is moving fast. How do you keep up?",
      options: [
        { text: "Listen for one idea you can act on immediately", scores: { speed: 3, curiosity: 1 } },
        { text: "Capture a structured set of notes", scores: { planning: 3, analysis: 2 } },
        { text: "Watch how the room reacts, then form your view", scores: { social: 2, analysis: 1 } },
        { text: "Follow the most surprising claim and sit with it", scores: { curiosity: 3, exploration: 2 } }
      ]
    },
    {
      id: "lunch",
      prompt: "Lunch has a long queue for the featured menu and a short queue for the usual options.",
      options: [
        { text: "Join the long queue. You want the featured plate", scores: { curiosity: 2, exploration: 2 } },
        { text: "Take the short queue and save time", scores: { speed: 3, convenience: 2 } },
        { text: "See who is in each line, then choose", scores: { social: 3, analysis: 1 } },
        { text: "Watch how fast each queue is actually moving", scores: { analysis: 3, planning: 1 } }
      ]
    },
    {
      id: "conflict",
      prompt: "Two people you respect give you opposite advice on the same decision.",
      options: [
        { text: "Pick a direction quickly and learn by doing", scores: { speed: 3, risk: 2 } },
        { text: "Gather one more independent view", scores: { social: 2, analysis: 2 } },
        { text: "List the trade-offs before you move", scores: { analysis: 3, planning: 2 } },
        { text: "Choose the path that feels less rehearsed", scores: { exploration: 3, curiosity: 2, risk: 1 } }
      ]
    },
    {
      id: "booth",
      prompt: "You pass a stall you have never seen, and another you already know is useful.",
      options: [
        { text: "Stop at the unfamiliar stall first", scores: { exploration: 3, curiosity: 2, risk: 1 } },
        { text: "Go to the known stall. You know the value", scores: { convenience: 3, planning: 1 } },
        { text: "Ask someone leaving the new stall what it is", scores: { social: 2, analysis: 2, curiosity: 1 } },
        { text: "Glance at both, then decide with a time limit", scores: { speed: 2, analysis: 2 } }
      ]
    },
    {
      id: "team-call",
      prompt: "Your team needs a call on a live issue during the conference.",
      options: [
        { text: "Propose a decision and invite pushback", scores: { speed: 2, risk: 2, social: 1 } },
        { text: "Collect options, then decide together", scores: { social: 3, planning: 1 } },
        { text: "Ask for the numbers before anyone speaks", scores: { analysis: 3, planning: 2 } },
        { text: "Try a small experiment before a full decision", scores: { curiosity: 2, exploration: 2, risk: 2 } }
      ]
    },
    {
      id: "last-session",
      prompt: "It is the last slot of the day. You can still choose where to sit.",
      options: [
        { text: "Front row. You want the full intensity", scores: { risk: 2, curiosity: 2, speed: 1 } },
        { text: "An aisle seat near the exit, just in case", scores: { convenience: 3, planning: 1 } },
        { text: "Beside someone interesting from earlier", scores: { social: 3 } },
        { text: "Wherever the conversation afterwards is likely to be richest", scores: { analysis: 2, social: 1, exploration: 1 } }
      ]
    },
    {
      id: "evening",
      prompt: "The official programme ends. You have an unplanned evening.",
      options: [
        { text: "Find a neighbourhood you have never walked", scores: { exploration: 3, curiosity: 2 } },
        { text: "Return to the hotel and recover", scores: { convenience: 3, planning: 1 } },
        { text: "See who is still around and join them", scores: { social: 3, curiosity: 1 } },
        { text: "Plan tomorrow first, then decide the evening", scores: { planning: 3, analysis: 1 } }
      ]
    },
    {
      id: "slide-change",
      prompt: "Ten minutes before you speak, someone suggests a last-minute change.",
      options: [
        { text: "Try it. You can recover if it misses", scores: { risk: 3, speed: 2 } },
        { text: "Keep the original. It is rehearsed", scores: { planning: 3, convenience: 2 } },
        { text: "Ask the room owner what they would prefer", scores: { social: 3 } },
        { text: "Test the change against your key message", scores: { analysis: 3, planning: 1 } }
      ]
    },
    {
      id: "coffee",
      prompt: "The coffee counter offers a signature blend and the standard cup you always order.",
      options: [
        { text: "Try the signature blend", scores: { curiosity: 3, exploration: 2 } },
        { text: "Order your usual", scores: { convenience: 3, planning: 1 } },
        { text: "Ask the barista what they would drink", scores: { social: 2, curiosity: 1 } },
        { text: "Check the tasting notes, then choose", scores: { analysis: 3 } }
      ]
    },
    {
      id: "switch-track",
      prompt: "Midway through a session, the neighbouring room sounds more alive.",
      options: [
        { text: "Switch now", scores: { speed: 3, risk: 2, exploration: 1 } },
        { text: "Stay. You committed to this one", scores: { planning: 3, convenience: 1 } },
        { text: "Wait for a natural pause, then decide", scores: { analysis: 2, planning: 2 } },
        { text: "Ask a colleague in the other room for a pulse check", scores: { social: 2, analysis: 2 } }
      ]
    }
  ];

  /**
   * Concrete next-move predictions. Edit headlines here; scoring uses `weights`.
   */
  const PREDICTIONS = [
    {
      id: "unfamiliar",
      headline: "You'll probably choose the unfamiliar option.",
      statement: "Our algorithm predicts that your next instinct will be to explore the option you have not tried before.",
      challenge: "The option you have not tried yet",
      weights: { exploration: 1.25, curiosity: 1.1, risk: 0.7 }
    },
    {
      id: "certainty",
      headline: "You'll probably pick the familiar, lower-friction path.",
      statement: "Our algorithm predicts that your next instinct will be to choose the option that feels proven and easy to execute.",
      challenge: "The option you already know works",
      weights: { convenience: 1.3, planning: 0.85 }
    },
    {
      id: "analyse",
      headline: "You'll probably pause for one more data point.",
      statement: "Our algorithm predicts that your next instinct will be to gather a little more information before you commit.",
      challenge: "Check the details, then decide",
      weights: { analysis: 1.35, planning: 0.9 }
    },
    {
      id: "social",
      headline: "You'll probably check in with someone before you commit.",
      statement: "Our algorithm predicts that your next instinct will be to use another person as a sounding board.",
      challenge: "Ask someone nearby what they would do",
      weights: { social: 1.4, curiosity: 0.25 }
    },
    {
      id: "fast",
      headline: "You'll probably decide quickly and adjust later.",
      statement: "Our algorithm predicts that your next instinct will be to move first and refine as you go.",
      challenge: "Choose now and course-correct if needed",
      weights: { speed: 1.35, risk: 0.75 }
    },
    {
      id: "experiment",
      headline: "You'll probably run a small experiment instead of a full commitment.",
      statement: "Our algorithm predicts that your next instinct will be to test a lighter version of the choice first.",
      challenge: "Try a smaller version first",
      weights: { curiosity: 0.85, risk: 0.85, exploration: 0.7, speed: 0.45 }
    }
  ];

  const SIGNATURE_PAIRS = {
    "analysis|curiosity": "The Pattern Seeker",
    "analysis|convenience": "The Curious Optimiser",
    "analysis|exploration": "The Strategic Explorer",
    "analysis|planning": "The Strategic Architect",
    "analysis|risk": "The Calculated Challenger",
    "analysis|social": "The Consultative Strategist",
    "analysis|speed": "The Rapid Analyst",
    "convenience|curiosity": "The Selective Explorer",
    "convenience|exploration": "The Adaptive Navigator",
    "convenience|planning": "The Reliable Optimiser",
    "convenience|risk": "The Practical Challenger",
    "convenience|social": "The Trusted Collaborator",
    "convenience|speed": "The Efficient Mover",
    "curiosity|exploration": "The Curious Explorer",
    "curiosity|planning": "The Curious Architect",
    "curiosity|risk": "The Curious Challenger",
    "curiosity|social": "The Conversational Scout",
    "curiosity|speed": "The Fast Experimenter",
    "exploration|planning": "The Strategic Explorer",
    "exploration|risk": "The Calculated Challenger",
    "exploration|social": "The Social Explorer",
    "exploration|speed": "The Fast Experimenter",
    "planning|risk": "The Calculated Challenger",
    "planning|social": "The Coordinated Builder",
    "planning|speed": "The Adaptive Navigator",
    "risk|social": "The Adaptive Connector",
    "risk|speed": "The Fast Experimenter",
    "social|speed": "The Adaptive Navigator"
  };

  const ANALYSE_STEPS = [
    { title: "Analysing your decisions...", sub: "Reading the pattern across the six choices you just made." },
    { title: "Mapping your choices...", sub: "Comparing speed, certainty, curiosity, and collaboration." },
    { title: "One final calculation...", sub: "Separating the leading next-move from the near misses." }
  ];

  const state = createEmptyState();

  const els = {
    screens: [...document.querySelectorAll(".screen")],
    sessionCounter: document.getElementById("session-counter"),
    start: document.getElementById("btn-start"),
    progressLabel: document.getElementById("progress-label"),
    progressIndex: document.getElementById("progress-index"),
    progressBar: document.getElementById("progress-bar"),
    progressFill: document.getElementById("progress-fill"),
    prompt: document.getElementById("question-prompt"),
    options: document.getElementById("options-grid"),
    ack: document.getElementById("choice-ack"),
    analyseTitle: document.getElementById("analyse-title"),
    analyseSub: document.getElementById("analyse-sub"),
    signature: document.getElementById("decision-signature"),
    headline: document.getElementById("prediction-headline"),
    statement: document.getElementById("prediction-statement"),
    confidenceValue: document.getElementById("confidence-value"),
    confidenceMeter: document.getElementById("confidence-meter"),
    why: document.getElementById("why-copy"),
    whyExtra: document.getElementById("why-extra"),
    whyExtraCopy: document.getElementById("why-extra-copy"),
    profile: document.getElementById("profile-bars"),
    test: document.getElementById("btn-test"),
    whyBtn: document.getElementById("btn-why"),
    share: document.getElementById("btn-share"),
    shareFeedback: document.getElementById("share-feedback"),
    resetResult: document.getElementById("btn-reset-result"),
    resetVerdict: document.getElementById("btn-reset-verdict"),
    meet: document.getElementById("btn-meet"),
    meetModal: document.getElementById("meet-modal"),
    closeMeet: document.getElementById("btn-close-meet"),
    challengeGrid: document.getElementById("challenge-grid"),
    verdictTitle: document.getElementById("verdict-title"),
    verdictCopy: document.getElementById("verdict-copy"),
    verdictChoice: document.getElementById("verdict-choice"),
    backResult: document.getElementById("btn-back-result")
  };

  function createEmptyState() {
    return {
      locked: false,
      questions: [],
      index: 0,
      answers: [],
      dimensionScores: zeroScores(),
      profilePercents: {},
      rankedPredictions: [],
      prediction: null,
      confidence: 0,
      signature: "",
      challengeOptions: []
    };
  }

  function zeroScores() {
    return DIMENSIONS.reduce((acc, dim) => {
      acc[dim] = 0;
      return acc;
    }, {});
  }

  function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
  }

  function shuffle(list) {
    const copy = list.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function questionCoverage(question) {
    const dims = new Set();
    question.options.forEach((option) => {
      Object.keys(option.scores).forEach((dim) => dims.add(dim));
    });
    return [...dims];
  }

  function selectQuestions(bank, count) {
    const shuffled = shuffle(bank);
    const selected = [];
    const covered = new Set();

    shuffled.forEach((question) => {
      if (selected.length >= count) return;
      const dims = questionCoverage(question);
      const addsNew = dims.some((dim) => !covered.has(dim));
      if (addsNew || selected.length < 3) {
        selected.push(question);
        dims.forEach((dim) => covered.add(dim));
      }
    });

    shuffled.forEach((question) => {
      if (selected.length >= count) return;
      if (!selected.includes(question)) selected.push(question);
    });

    return shuffle(selected).slice(0, count);
  }

  function addScores(target, scores) {
    Object.entries(scores).forEach(([dim, value]) => {
      target[dim] = (target[dim] || 0) + value;
    });
  }

  function maxPossible(questions, dim) {
    return questions.reduce((sum, question) => {
      const localMax = Math.max(...question.options.map((option) => option.scores[dim] || 0));
      return sum + localMax;
    }, 0);
  }

  function profilePercents(questions, scores) {
    const percents = {};
    DIMENSIONS.forEach((dim) => {
      const max = maxPossible(questions, dim);
      percents[dim] = max === 0 ? 0 : Math.round((100 * scores[dim]) / max);
    });
    return percents;
  }

  function predictionScore(prediction, dimensionScores) {
    return Object.entries(prediction.weights).reduce((sum, [dim, weight]) => {
      return sum + (dimensionScores[dim] || 0) * weight;
    }, 0);
  }

  function rankPredictions(dimensionScores) {
    return PREDICTIONS
      .map((prediction) => ({
        ...prediction,
        score: predictionScore(prediction, dimensionScores)
      }))
      .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
  }

  function confidenceFromRanks(ranked) {
    const top = ranked[0].score;
    const second = ranked[1] ? ranked[1].score : 0;
    const total = ranked.reduce((sum, item) => sum + item.score, 0);
    const separation = top <= 0 ? 0 : (top - second) / top;
    const dominance = total <= 0 ? 0 : top / total;
    const raw = 52 + separation * 28 + dominance * 18;
    return Math.round(clamp(raw, 52, 92));
  }

  function signatureFromProfile(percents) {
    const ranked = DIMENSIONS
      .map((dim) => ({ dim, value: percents[dim] }))
      .sort((a, b) => b.value - a.value || a.dim.localeCompare(b.dim));

    const first = ranked[0];
    const second = ranked[1];
    if (!first) return "The Adaptive Navigator";

    if (second && first.value - second.value >= 18) {
      const solo = {
        analysis: "The Pattern Seeker",
        curiosity: "The Curious Explorer",
        exploration: "The Strategic Explorer",
        risk: "The Calculated Challenger",
        speed: "The Fast Experimenter",
        social: "The Adaptive Connector",
        planning: "The Strategic Architect",
        convenience: "The Curious Optimiser"
      };
      return solo[first.dim] || "The Adaptive Navigator";
    }

    const key = [first.dim, second.dim].sort().join("|");
    return SIGNATURE_PAIRS[key] || "The Adaptive Navigator";
  }

  function contrastPhrase(percents) {
    const ranked = DIMENSIONS
      .map((dim) => ({ dim, value: percents[dim] }))
      .sort((a, b) => b.value - a.value);

    const high = ranked.slice(0, 2);
    const low = ranked[ranked.length - 1];
    return { high, low };
  }

  function explainPrediction(prediction, percents) {
    const { high, low } = contrastPhrase(percents);
    const lead = high.map((item) => item.dim).join(" and ");
    const templates = {
      unfamiliar: `Across your decisions, you repeatedly favoured ${lead} over ${low.dim}. That pattern usually shows up as reaching for the option you have not tried yet.`,
      certainty: `Your choices leaned toward ${lead}, with less weight on ${low.dim}. That combination often prefers a path that is already known to work.`,
      analyse: `You consistently left room for ${lead}. When that outranks ${low.dim}, the next move is often one more piece of information.`,
      social: `Other people kept appearing in your choices through ${lead}. That tends to precede a check-in before committing.`,
      fast: `You traded some ${low.dim} for ${lead}. That usually looks like deciding quickly and adjusting in motion.`,
      experiment: `Your mix of ${lead}, rather than a single extreme on ${low.dim}, looks like testing a smaller version before a full commitment.`
    };
    return templates[prediction.id] || `Your strongest signals were ${lead}. The algorithm mapped that pattern onto this next move.`;
  }

  function extraWhy(answers, percents, prediction, confidence) {
    const samples = answers.slice(0, 2).map((answer) => `“${answer.option.text}”`).join(" and ");
    const second = state.rankedPredictions[1];
    const gap = Math.round(state.rankedPredictions[0].score - (second ? second.score : 0));
    return `Two of your calls were ${samples}. The leading prediction scored ${gap} points above the runner-up, which is why confidence sits at ${confidence}%. Runner-up: ${second ? second.headline : "none"}. This remains an algorithmic reading of your choices, not a personality diagnosis.`;
  }

  function wait(ms) {
    return new Promise((resolve) => {
      window.setTimeout(resolve, prefersReducedMotion() ? 0 : ms);
    });
  }

  function showScreen(id) {
    els.screens.forEach((screen) => {
      const active = screen.id === id;
    screen.classList.toggle("is-active", active);
    screen.hidden = !active;
    screen.setAttribute("aria-hidden", active ? "false" : "true");
    });
    const heading = document.querySelector(`#${id} h1, #${id} h2`);
    if (heading) heading.focus?.();
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }

  function readSessionCount() {
    try {
      const raw = window.localStorage.getItem(SESSION_KEY);
      const value = Number.parseInt(raw || "0", 10);
      return Number.isFinite(value) && value >= 0 ? value : 0;
    } catch {
      return 0;
    }
  }

  function writeSessionCount(value) {
    try {
      window.localStorage.setItem(SESSION_KEY, String(value));
    } catch {
      /* stall devices may block storage; the UI still works in memory */
    }
  }

  function renderSessionCounter() {
    const count = readSessionCount();
    els.sessionCounter.textContent = `Decision #${count + 1}`;
  }

  function bumpSessionCounter() {
    const next = readSessionCount() + 1;
    writeSessionCount(next);
    els.sessionCounter.textContent = `Decision #${next}`;
  }

  function renderQuestion() {
    const question = state.questions[state.index];
    const step = state.index + 1;
    els.progressLabel.textContent = `Question ${step} of ${QUESTIONS_PER_SESSION}`;
    els.progressIndex.textContent = `${String(step).padStart(2, "0")} / ${String(QUESTIONS_PER_SESSION).padStart(2, "0")}`;
    els.progressBar.setAttribute("aria-valuenow", String(step));
    els.progressFill.style.width = `${(step / QUESTIONS_PER_SESSION) * 100}%`;
    els.prompt.textContent = question.prompt;
    els.ack.textContent = "";
    els.options.innerHTML = "";

    question.options.forEach((option, optionIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "option-card";
      button.dataset.index = String(optionIndex);
      button.innerHTML = `<span class="option-key">${LETTERS[optionIndex]}</span><p class="option-text">${option.text}</p>`;
      button.addEventListener("click", () => handleAnswer(optionIndex));
      els.options.appendChild(button);
    });

    const first = els.options.querySelector("button");
    if (first) first.focus();
  }

  async function handleAnswer(optionIndex) {
    if (state.locked) return;
    const question = state.questions[state.index];
    const option = question.options[optionIndex];
    if (!option) return;

    state.locked = true;
    const cards = [...els.options.querySelectorAll(".option-card")];
    cards.forEach((card, idx) => {
      card.disabled = true;
      card.classList.toggle("is-selected", idx === optionIndex);
      card.classList.toggle("is-dimmed", idx !== optionIndex);
    });
    els.ack.textContent = "Locked in.";

    state.answers.push({ question, option, optionIndex });
    addScores(state.dimensionScores, option.scores);

    await wait(420);

    if (state.index < QUESTIONS_PER_SESSION - 1) {
      state.index += 1;
      state.locked = false;
      renderQuestion();
      return;
    }

    finishQuiz();
  }

  async function finishQuiz() {
    state.profilePercents = profilePercents(state.questions, state.dimensionScores);
    state.rankedPredictions = rankPredictions(state.dimensionScores);
    state.prediction = state.rankedPredictions[0];
    state.confidence = confidenceFromRanks(state.rankedPredictions);
    state.signature = signatureFromProfile(state.profilePercents);
    state.challengeOptions = state.rankedPredictions.slice(0, 4);

    showScreen("screen-analyse");
    const steps = prefersReducedMotion() ? [ANALYSE_STEPS[2]] : ANALYSE_STEPS;
    for (const step of steps) {
      els.analyseTitle.textContent = step.title;
      els.analyseSub.textContent = step.sub;
      await wait(900);
    }
    renderResult();
    showScreen("screen-result");
    state.locked = false;
  }

  function renderResult() {
    const prediction = state.prediction;
    els.signature.textContent = state.signature;
    els.headline.textContent = prediction.headline;
    els.statement.textContent = prediction.statement;
    els.confidenceValue.textContent = `${state.confidence}%`;
    els.why.textContent = explainPrediction(prediction, state.profilePercents);
    els.whyExtra.hidden = true;
    els.shareFeedback.textContent = "";
    requestAnimationFrame(() => {
      els.confidenceMeter.style.width = `${state.confidence}%`;
    });

    const rankedDims = DIMENSIONS
      .map((dim) => ({ dim, value: state.profilePercents[dim] }))
      .sort((a, b) => b.value - a.value);

    els.profile.innerHTML = "";
    rankedDims.forEach((item) => {
      const li = document.createElement("li");
      li.className = "profile-row";
      li.innerHTML = `
        <span class="profile-name">${item.dim}</span>
        <span class="bar-track"><span class="bar-fill" data-width="${item.value}"></span></span>
        <span class="profile-score">${item.value}</span>
      `;
      els.profile.appendChild(li);
    });

    requestAnimationFrame(() => {
      els.profile.querySelectorAll(".bar-fill").forEach((bar) => {
        bar.style.width = `${bar.dataset.width}%`;
      });
    });
  }

  function renderChallenge() {
    els.challengeGrid.innerHTML = "";
    const options = shuffle(state.challengeOptions.slice());
    options.forEach((prediction, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "option-card";
      button.innerHTML = `<span class="option-key">${LETTERS[index]}</span><p class="option-text">${prediction.challenge}</p>`;
      button.addEventListener("click", () => handleChallenge(prediction));
      els.challengeGrid.appendChild(button);
    });
  }

  function handleChallenge(chosen) {
    if (state.locked) return;
    state.locked = true;
    const predicted = state.prediction;
    const matched = chosen.id === predicted.id;
    els.verdictTitle.textContent = matched ? "WE PREDICTED THIS." : "YOU BEAT THE ALGORITHM.";
    els.verdictCopy.textContent = matched
      ? `You picked the move the scoring model already had in front. Confidence was ${state.confidence}%. Still just an algorithmic reading — a good match, not proof.`
      : `You chose a different move than the leading prediction. The model had: “${predicted.challenge}.” You picked: “${chosen.challenge}.” That is a genuine miss.`;
    els.verdictChoice.textContent = `Your pick: ${chosen.challenge}`;
    showScreen("screen-verdict");
    state.locked = false;
  }

  function shareText() {
    return [
      `NEXORA: What Will You Choose Next?`,
      `${state.signature}`,
      state.prediction ? state.prediction.headline : "",
      `Algorithm confidence: ${state.confidence}%`,
      `Global Leadership Conference 4.0 · NEXORA — IT Club, TAPMI Bengaluru`
    ].join("\n");
  }

  async function shareResult() {
    const text = shareText();
    els.shareFeedback.textContent = "";
    try {
      if (navigator.share) {
        await navigator.share({ title: "NEXORA prediction", text });
        els.shareFeedback.textContent = "Shared.";
        return;
      }
    } catch (error) {
      if (error && error.name === "AbortError") return;
    }

    try {
      await navigator.clipboard.writeText(text);
      els.shareFeedback.textContent = "Copied to clipboard.";
    } catch {
      els.shareFeedback.textContent = "Copy this result from the screen — sharing is unavailable here.";
    }
  }

  function resetSession() {
    Object.assign(state, createEmptyState());
    els.ack.textContent = "";
    els.shareFeedback.textContent = "";
    els.whyExtra.hidden = true;
    els.meetModal.hidden = true;
    els.confidenceMeter.style.width = "0%";
    renderSessionCounter();
    showScreen("screen-landing");
    els.start.focus();
  }

  function startSession() {
    if (state.locked) return;
    Object.assign(state, createEmptyState());
    state.questions = selectQuestions(QUESTION_BANK, QUESTIONS_PER_SESSION);
    bumpSessionCounter();
    renderQuestion();
    showScreen("screen-quiz");
  }

  function bindEvents() {
    els.start.addEventListener("click", startSession);
    els.test.addEventListener("click", () => {
      renderChallenge();
      showScreen("screen-challenge");
    });
    els.whyBtn.addEventListener("click", () => {
      els.whyExtra.hidden = false;
      els.whyExtraCopy.textContent = extraWhy(state.answers, state.profilePercents, state.prediction, state.confidence);
      els.whyExtraCopy.focus?.();
    });
    els.share.addEventListener("click", shareResult);
    els.resetResult.addEventListener("click", resetSession);
    els.resetVerdict.addEventListener("click", resetSession);
    els.backResult.addEventListener("click", () => showScreen("screen-result"));
    els.meet.addEventListener("click", () => {
      els.meetModal.hidden = false;
      els.closeMeet.focus();
    });
    els.closeMeet.addEventListener("click", () => {
      els.meetModal.hidden = true;
      els.meet.focus();
    });
    els.meetModal.addEventListener("click", (event) => {
      if (event.target === els.meetModal) {
        els.meetModal.hidden = true;
      }
    });

    document.addEventListener("keydown", (event) => {
      const quizOpen = document.getElementById("screen-quiz").classList.contains("is-active");
      const challengeOpen = document.getElementById("screen-challenge").classList.contains("is-active");
      if (!quizOpen && !challengeOpen) {
        if (event.key === "Escape" && !els.meetModal.hidden) {
          els.meetModal.hidden = true;
        }
        return;
      }
      const map = { a: 0, b: 1, c: 2, d: 3, A: 0, B: 1, C: 2, D: 3 };
      if (event.key in map) {
        const buttons = document.querySelectorAll(`${quizOpen ? "#options-grid" : "#challenge-grid"} .option-card`);
        const target = buttons[map[event.key]];
        if (target && !target.disabled) target.click();
      }
    });
  }

  function validateBank() {
    QUESTION_BANK.forEach((question) => {
      if (!question.options || question.options.length !== 4) {
        throw new Error(`Question ${question.id} must have exactly 4 options.`);
      }
    });
  }

  function init() {
    try {
      validateBank();
      bindEvents();
      renderSessionCounter();
      showScreen("screen-landing");
    } catch (error) {
      document.body.innerHTML = "<p style=\"padding:2rem;color:#fff\">NEXORA could not start this session. Please reload the page.</p>";
      console.error(error);
    }
  }

  window.addEventListener("error", () => {
    els.ack.textContent = "Something glitched. Use Next Participant to restart.";
  });

  init();
})();
