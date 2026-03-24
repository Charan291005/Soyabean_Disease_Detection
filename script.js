const architectureData = {
  acquisition: {
    eyebrow: "Layer 01",
    title: "Image Acquisition Layer",
    description:
      "This layer gathers soybean leaf imagery from heterogeneous field sources including smartphones, UAV platforms, and fixed IoT cameras. It must handle variability in viewpoint, illumination, focus, and capture scale.",
    input: "Raw RGB images, video frames, geo-tagged crop snapshots, repeated time-series captures from edge devices.",
    output: "Source-tagged field images with metadata such as device type, timestamp, plot region, and capture quality indicators.",
    importance:
      "Reliable capture diversity is essential because soybean disease symptoms look different under different angles, weather conditions, and device optics.",
    relevance:
      "The acquisition layer defines whether the system can scale beyond curated datasets into real farm workflows with mixed hardware and non-ideal field conditions.",
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="6" width="6" height="11" rx="1.5"></rect>
        <path d="M9.5 10H13l2-3h5.5v10H15l-2-3H9.5"></path>
      </svg>
    `
  },
  preprocess: {
    eyebrow: "Layer 02",
    title: "Edge Preprocessing Layer",
    description:
      "The edge layer standardizes imagery before inference using resize, normalization, quality checks, and optional enhancement steps. It improves downstream robustness while limiting unnecessary cloud transfer.",
    input: "Raw source-tagged images with inconsistent resolution, blur levels, exposure, and background clutter.",
    output: "Cleaned tensors or standardized image crops ready for model selection, with quality flags and preprocessing logs.",
    importance:
      "Field deployment depends on stabilizing input variation. Without preprocessing, model behavior can degrade sharply when camera quality or lighting changes.",
    relevance:
      "Edge preprocessing reduces latency, bandwidth cost, and noisy uploads, making the architecture practical for mobile, UAV, and IoT scenarios.",
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 7h16M7 4v6M17 14H7M17 20V10"></path>
      </svg>
    `
  },
  detection: {
    eyebrow: "Layer 03",
    title: "Detection and Classification Layer",
    description:
      "This layer runs AI inference using ResNet for image-level disease classification and YOLO for lesion localization and real-time detection. It supports both label prediction and spatial evidence.",
    input: "Preprocessed soybean leaf images or scene crops with quality-controlled formatting.",
    output: "Disease label, confidence score, lesion boxes, class probabilities, and severity-linked cues for decision support.",
    importance:
      "The AI layer converts imagery into actionable biological interpretation. Localization makes the prototype feel operational rather than purely classificatory.",
    relevance:
      "Combining classification with detection allows the platform to support smartphones, drones, and edge systems with different speed and visualization requirements.",
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="3"></rect>
        <path d="M8 8h3v3H8zM13 13h3v3h-3zM13 8h3v3h-3zM8 13h3v3H8z"></path>
      </svg>
    `
  },
  analytics: {
    eyebrow: "Layer 04",
    title: "Cloud Analytics Layer",
    description:
      "The cloud layer aggregates predictions across farms and time windows, tracks disease trends, prepares retraining insights, and can coordinate federated learning across distributed deployments.",
    input: "Predictions, metadata, longitudinal scan history, edge logs, treatment outcomes, and class drift indicators.",
    output: "Trend dashboards, regional alert summaries, retraining priorities, device contribution analytics, and model maintenance signals.",
    importance:
      "A deployment-ready system needs long-term memory. Cloud aggregation turns isolated scans into seasonal intelligence and research insight.",
    relevance:
      "This is where the prototype moves beyond a demo classifier and becomes a monitoring platform capable of supporting scaled farm operations.",
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 18h16M7 16V9M12 16V6M17 16v-4"></path>
      </svg>
    `
  },
  decision: {
    eyebrow: "Layer 05",
    title: "Decision Support Layer",
    description:
      "The final layer transforms model output into field-ready guidance through severity scoring, confidence reporting, treatment suggestions, and monitoring summaries for operators or supervisors.",
    input: "Disease predictions, lesion evidence, trend context, historical alerts, and source-aware confidence metrics.",
    output: "Actionable recommendations, alert banners, scan follow-up plans, and supervisor-facing summaries.",
    importance:
      "Prediction alone is not enough. The system must communicate what to do next and how reliable the signal is.",
    relevance:
      "Decision support closes the deployment loop by linking AI output to agronomic action, monitoring cadence, and human validation.",
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 12.5 9.2 17 19 7.5"></path>
        <path d="M12 3v4M3 12h4M17 12h4M12 17v4"></path>
      </svg>
    `
  }
};

const samples = {
  rust: {
    key: "rust",
    label: "Soybean Rust",
    source: "Smartphone",
    model: "YOLOv8 + ResNet-50",
    confidence: 94.2,
    severity: "High",
    treatment:
      "Prioritize fungicide scheduling for rust-sensitive blocks, isolate rapidly spreading areas, and rescan within 72 hours.",
    summary:
      "YOLO-style lesion localization detected clustered pustule-like regions with strong confidence. Cloud layer flags this plot for high-frequency follow-up.",
    status: "High-risk signature detected",
    boxes: true,
    sourceMode: "Edge preprocess / cloud aggregate",
    previewClass: "rust"
  },
  "brown-spot": {
    key: "brown-spot",
    label: "Brown Spot",
    source: "UAV / Drone",
    model: "ResNet-50 with YOLO assist",
    confidence: 89.4,
    severity: "Moderate",
    treatment:
      "Monitor spread across adjacent rows, validate lower-canopy lesions with targeted smartphone capture, and schedule a follow-up drone pass after irrigation.",
    summary:
      "Broad lesion patterns suggest Brown Spot prevalence under moderate spread conditions. Aggregation engine recommends trend monitoring rather than immediate escalation.",
    status: "Moderate lesion activity",
    boxes: true,
    sourceMode: "Edge triage / cloud analytics",
    previewClass: "brown-spot"
  },
  healthy: {
    key: "healthy",
    label: "Healthy Leaf",
    source: "IoT Camera",
    model: "ResNet-50",
    confidence: 97.1,
    severity: "Low",
    treatment:
      "No immediate treatment required. Preserve this capture as a healthy baseline for temporal comparison and drift monitoring.",
    summary:
      "No meaningful lesion clusters were retained after preprocessing. The system categorizes the image as a stable healthy reference sample for longitudinal monitoring.",
    status: "Healthy baseline confirmed",
    boxes: false,
    sourceMode: "Edge preprocess / edge classify / cloud log",
    previewClass: "healthy"
  }
};

const state = {
  activeSample: "rust",
  activeSource: "Smartphone",
  uploadedImage: null,
  running: false
};

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = [...document.querySelectorAll(".nav-links a")];
const revealItems = document.querySelectorAll(".reveal");
const architectureModal = document.getElementById("architectureModal");
const modalTitle = document.getElementById("modalTitle");
const modalEyebrow = document.getElementById("modalEyebrow");
const modalDescription = document.getElementById("modalDescription");
const modalInput = document.getElementById("modalInput");
const modalOutput = document.getElementById("modalOutput");
const modalImportance = document.getElementById("modalImportance");
const modalRelevance = document.getElementById("modalRelevance");
const modalIcon = document.getElementById("modalIcon");
const closeModal = document.getElementById("closeModal");
const sourceSelector = document.getElementById("sourceSelector");
const sampleGrid = document.getElementById("sampleGrid");
const previewArt = document.getElementById("previewArt");
const uploadedPreview = document.getElementById("uploadedPreview");
const previewLabel = document.getElementById("previewLabel");
const analysisStatus = document.getElementById("analysisStatus");
const pipelineSteps = [...document.querySelectorAll(".pipeline-step")];
const resultDisease = document.getElementById("resultDisease");
const resultConfidence = document.getElementById("resultConfidence");
const resultSeverity = document.getElementById("resultSeverity");
const resultSource = document.getElementById("resultSource");
const resultModel = document.getElementById("resultModel");
const resultMode = document.getElementById("resultMode");
const resultTreatment = document.getElementById("resultTreatment");
const resultSummary = document.getElementById("resultSummary");
const imageUpload = document.getElementById("imageUpload");
const runAnalysis = document.getElementById("runAnalysis");
const trendChart = document.getElementById("trendChart");
const kpiTotalScans = document.getElementById("kpiTotalScans");
const recentAlerts = document.getElementById("recentAlerts");
const decisionAlertTitle = document.getElementById("decisionAlertTitle");
const decisionAlertBody = document.getElementById("decisionAlertBody");
const decisionGaugeNeedle = document.getElementById("decisionGaugeNeedle");
const decisionSeverityScore = document.getElementById("decisionSeverityScore");
const decisionConfidence = document.getElementById("decisionConfidence");
const decisionConfidenceText = document.getElementById("decisionConfidenceText");
const decisionTreatmentCard = document.getElementById("decisionTreatmentCard");
const decisionFollowupCard = document.getElementById("decisionFollowupCard");
const decisionValidationNote = document.getElementById("decisionValidationNote");

const sleep = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

function toggleMenu(forceClose = false) {
  const shouldOpen = forceClose ? false : !navLinks.classList.contains("open");
  navLinks.classList.toggle("open", shouldOpen);
  navToggle.setAttribute("aria-expanded", String(shouldOpen));
  document.body.classList.toggle("nav-open", shouldOpen);
}

function setActiveNav() {
  const sections = [...document.querySelectorAll("main .section")];
  const offset = window.scrollY + 160;
  let activeId = sections[0]?.id;

  sections.forEach((section) => {
    if (section.offsetTop <= offset) {
      activeId = section.id;
    }
  });

  navItems.forEach((item) => {
    item.classList.toggle("active", item.getAttribute("href") === `#${activeId}`);
  });
}

function setupRevealObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function openArchitectureModal(layerKey) {
  const layer = architectureData[layerKey];
  if (!layer) return;

  modalEyebrow.textContent = layer.eyebrow;
  modalTitle.textContent = layer.title;
  modalDescription.textContent = layer.description;
  modalInput.textContent = layer.input;
  modalOutput.textContent = layer.output;
  modalImportance.textContent = layer.importance;
  modalRelevance.textContent = layer.relevance;
  modalIcon.innerHTML = layer.icon;

  architectureModal.classList.add("open");
  architectureModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("nav-open");
}

function closeArchitectureModal() {
  architectureModal.classList.remove("open");
  architectureModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("nav-open");
}

function createTrendChart() {
  const values = [38, 44, 49, 53, 58, 55, 67];
  const width = 320;
  const height = 180;
  const paddingX = 16;
  const paddingY = 18;
  const max = 80;
  const stepX = (width - paddingX * 2) / (values.length - 1);

  const points = values
    .map((value, index) => {
      const x = paddingX + index * stepX;
      const y = height - paddingY - (value / max) * (height - paddingY * 2);
      return `${x},${y}`;
    })
    .join(" ");

  const area = `${paddingX},${height - paddingY} ${points} ${width - paddingX},${height - paddingY}`;
  const pointMarkup = values
    .map((value, index) => {
      const x = paddingX + index * stepX;
      const y = height - paddingY - (value / max) * (height - paddingY * 2);
      return `<circle cx="${x}" cy="${y}" r="4.5" fill="#1f6a45" stroke="#f9fbf4" stroke-width="3"></circle>`;
    })
    .join("");

  const gridLines = [0.25, 0.5, 0.75]
    .map((ratio) => {
      const y = paddingY + ratio * (height - paddingY * 2);
      return `<line x1="${paddingX}" y1="${y}" x2="${width - paddingX}" y2="${y}" stroke="rgba(69, 95, 60, 0.12)" stroke-width="1"></line>`;
    })
    .join("");

  trendChart.innerHTML = `
    ${gridLines}
    <defs>
      <linearGradient id="trendArea" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="rgba(31, 106, 69, 0.42)"></stop>
        <stop offset="100%" stop-color="rgba(31, 106, 69, 0.02)"></stop>
      </linearGradient>
      <linearGradient id="trendStroke" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0%" stop-color="#335f41"></stop>
        <stop offset="100%" stop-color="#63a470"></stop>
      </linearGradient>
    </defs>
    <polygon points="${area}" fill="url(#trendArea)"></polygon>
    <polyline points="${points}" fill="none" stroke="url(#trendStroke)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></polyline>
    ${pointMarkup}
  `;
}

function severityToScore(severity) {
  if (severity === "High") return 78;
  if (severity === "Moderate") return 56;
  return 18;
}

function updateDecisionPanel(sample, confidenceValue) {
  const severityScore = severityToScore(sample.severity);
  const normalizedAngle = -78 + (severityScore / 100) * 156;
  const source = state.activeSource;
  const confidenceText =
    confidenceValue >= 93
      ? "High-confidence prediction with consistent lesion or class evidence across the selected source pathway."
      : confidenceValue >= 88
        ? "Moderate-to-high confidence prediction. Recommended to validate with a repeat capture under similar field conditions."
        : "Confidence is moderate. Expert review and additional scans are recommended before intervention.";

  const followupText =
    sample.severity === "High"
      ? `Schedule a repeat ${source.toLowerCase()} scan within 48 to 72 hours and compare lesion spread against this baseline.`
      : sample.severity === "Moderate"
        ? `Use ${source.toLowerCase()} follow-up monitoring within one week to confirm whether lesion density is expanding or stable.`
        : `Retain this ${source.toLowerCase()} capture as a healthy reference and continue routine scheduled monitoring.`;

  decisionAlertTitle.textContent =
    sample.severity === "Low"
      ? `Monitoring status: ${sample.label} baseline retained for continued surveillance`
      : `Disease alert triggered: ${sample.label} risk highlighted in the current monitored sample`;
  decisionAlertBody.textContent =
    sample.severity === "Low"
      ? "No immediate intervention is indicated. The sample is useful as a healthy reference for longitudinal comparison and model drift checking."
      : `The latest inference indicates ${sample.severity.toLowerCase()} field impact with ${confidenceValue.toFixed(1)}% confidence from the ${source} pathway.`;
  decisionSeverityScore.textContent = String(severityScore);
  decisionGaugeNeedle.style.transform = `translateX(-50%) rotate(${normalizedAngle}deg)`;
  decisionConfidence.textContent = `${confidenceValue.toFixed(1)}%`;
  decisionConfidenceText.textContent = confidenceText;
  decisionTreatmentCard.textContent = sample.treatment;
  decisionFollowupCard.textContent = followupText;
  decisionValidationNote.textContent =
    sample.severity === "Low"
      ? "Agronomic review is optional here, but retaining expert-verified healthy references can strengthen future retraining rounds."
      : "Expert agronomic review is still recommended before field-scale intervention, especially under mixed-symptom conditions.";
}

function updateDashboard(sample, confidenceValue) {
  const nextTotal = Number(kpiTotalScans.textContent.replace(/,/g, "")) + 1;
  const formattedTotal = nextTotal.toLocaleString("en-US");
  const alertTitle = sample.severity === "Low"
    ? `Reference sample | ${sample.label}`
    : `${state.activeSource} | ${sample.label}`;
  const alertMeta = `Confidence ${confidenceValue.toFixed(1)}% | Severity ${sample.severity} | ${state.activeSource}`;

  kpiTotalScans.textContent = formattedTotal;

  recentAlerts.insertAdjacentHTML(
    "afterbegin",
    `<div class="alert-item"><strong>${alertTitle}</strong><span>${alertMeta}</span></div>`
  );

  while (recentAlerts.children.length > 4) {
    recentAlerts.lastElementChild?.remove();
  }
}

function updateBoxesVisibility(showBoxes) {
  previewArt.querySelectorAll(".detection-box").forEach((box) => {
    box.style.display = showBoxes ? "block" : "none";
  });
}

function renderSample(sampleKey) {
  const sample = samples[sampleKey];
  if (!sample) return;

  state.activeSample = sampleKey;
  previewArt.className = `preview-art ${sample.previewClass}`;
  previewLabel.textContent = `Sample ready: ${sample.label}`;
  analysisStatus.textContent = "Awaiting analysis";
  updateBoxesVisibility(sample.boxes);

  if (!state.uploadedImage) {
    uploadedPreview.hidden = true;
    previewArt.hidden = false;
  }

  resultDisease.textContent = sample.label;
  resultConfidence.textContent = `${sample.confidence.toFixed(1)}%`;
  resultSeverity.textContent = sample.severity;
  resultSource.textContent = state.activeSource;
  resultModel.textContent = sample.model;
  resultMode.textContent = sample.sourceMode;
  resultTreatment.textContent = sample.treatment;
  resultSummary.textContent = sample.summary;
  updateDecisionPanel(sample, sample.confidence);

  [...sampleGrid.querySelectorAll(".sample-card")].forEach((card) => {
    card.classList.toggle("active", card.dataset.sample === sampleKey);
  });
}

function syncSourceSelection(source) {
  state.activeSource = source;
  [...sourceSelector.querySelectorAll("button")].forEach((button) => {
    button.classList.toggle("active", button.dataset.source === source);
  });
  resultSource.textContent = source;
  updateDecisionPanel(samples[state.activeSample], Number(resultConfidence.textContent.replace("%", "")));
}

function resetPipeline() {
  pipelineSteps.forEach((step) => step.classList.remove("active", "complete"));
}

async function runPipeline() {
  if (state.running) return;
  state.running = true;
  resetPipeline();
  analysisStatus.textContent = "Running pipeline";
  runAnalysis.disabled = true;
  runAnalysis.textContent = "Analysis in progress...";

  for (const [index, step] of pipelineSteps.entries()) {
    step.classList.add("active");
    await sleep(350 + index * 40);
    step.classList.remove("active");
    step.classList.add("complete");
  }

  const sample = samples[state.activeSample];
  const adjustedConfidence = Math.max(
    84.2,
    Math.min(98.9, sample.confidence + (state.activeSource === "UAV / Drone" ? -1.3 : state.activeSource === "IoT Camera" ? 0.8 : 0))
  );
  const adjustedModel =
    state.activeSource === "UAV / Drone"
      ? "YOLOv8 aerial profile + ResNet-50"
      : state.activeSource === "IoT Camera"
        ? sample.key === "healthy"
          ? "Mobile ResNet-50"
          : "Edge YOLO-Tiny + ResNet-50"
        : sample.model;

  resultConfidence.textContent = `${adjustedConfidence.toFixed(1)}%`;
  resultModel.textContent = adjustedModel;
  resultSource.textContent = state.activeSource;
  analysisStatus.textContent = sample.status;
  updateDecisionPanel(sample, adjustedConfidence);
  updateDashboard(sample, adjustedConfidence);
  state.running = false;
  runAnalysis.disabled = false;
  runAnalysis.textContent = "Run Analysis";
}

function handleUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  if (state.uploadedImage) {
    URL.revokeObjectURL(state.uploadedImage);
  }

  const objectUrl = URL.createObjectURL(file);
  state.uploadedImage = objectUrl;
  uploadedPreview.src = objectUrl;
  uploadedPreview.hidden = false;
  previewArt.hidden = true;
  previewLabel.textContent = `Uploaded image ready: ${file.name}`;
  analysisStatus.textContent = "Custom image staged";
}

function attachEvents() {
  navToggle?.addEventListener("click", () => toggleMenu());

  navItems.forEach((item) =>
    item.addEventListener("click", () => {
      if (window.innerWidth <= 820) toggleMenu(true);
    })
  );

  document.querySelectorAll(".arch-card").forEach((card) => {
    card.addEventListener("click", () => openArchitectureModal(card.dataset.layer));
  });

  closeModal.addEventListener("click", closeArchitectureModal);
  architectureModal.addEventListener("click", (event) => {
    if (event.target === architectureModal) closeArchitectureModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && architectureModal.classList.contains("open")) {
      closeArchitectureModal();
    }
  });

  sourceSelector.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-source]");
    if (!button) return;
    syncSourceSelection(button.dataset.source);
  });

  sampleGrid.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-sample]");
    if (!button) return;
    if (state.uploadedImage) {
      URL.revokeObjectURL(state.uploadedImage);
    }
    state.uploadedImage = null;
    uploadedPreview.hidden = true;
    uploadedPreview.removeAttribute("src");
    previewArt.hidden = false;
    renderSample(button.dataset.sample);
  });

  imageUpload.addEventListener("change", handleUpload);
  runAnalysis.addEventListener("click", runPipeline);

  window.addEventListener("scroll", setActiveNav, { passive: true });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 820) {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
    }
  });
}

function init() {
  setupRevealObserver();
  createTrendChart();
  renderSample(state.activeSample);
  syncSourceSelection(state.activeSource);
  attachEvents();
  setActiveNav();
}

init();
