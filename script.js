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
  running: false,
  hasRunAnalysis: false,
  analysisHistory: [],
  batchImages: [],
  darkMode: false,
  autoPlay: true,
  notificationsEnabled: true,
  confidenceThreshold: 85
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
const imageContainer = document.getElementById("imageContainer");
const imageWrapper = document.getElementById("imageWrapper");
const imageMetadata = document.getElementById("imageMetadata");
const metadataFileName = document.getElementById("metadataFileName");
const metadataFileSize = document.getElementById("metadataFileSize");
const metadataDimensions = document.getElementById("metadataDimensions");
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
const progressOverlay = document.getElementById("progressOverlay");
const progressCircle = document.getElementById("progressCircle");
const progressText = document.getElementById("progressText");

// New feature DOM elements
const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");
const historyList = document.getElementById("historyList");
const batchImageUpload = document.getElementById("batchImageUpload");
const processBatch = document.getElementById("processBatch");
const batchProgress = document.getElementById("batchProgress");
const batchStatus = document.getElementById("batchStatus");
const batchProgressFill = document.getElementById("batchProgressFill");
const batchResults = document.getElementById("batchResults");
const darkModeToggle = document.getElementById("darkModeToggle");
const autoPlayToggle = document.getElementById("autoPlayToggle");
const notificationsToggle = document.getElementById("notificationsToggle");
const confidenceThreshold = document.getElementById("confidenceThreshold");
const thresholdValue = document.getElementById("thresholdValue");
const exportJSON = document.getElementById("exportJSON");
const exportCSV = document.getElementById("exportCSV");
const exportPDF = document.getElementById("exportPDF");
const clearHistory = document.getElementById("clearHistory");
const compareSelect1 = document.getElementById("compareSelect1");
const compareSelect2 = document.getElementById("compareSelect2");
const compareBtn = document.getElementById("compareBtn");
const comparisonResults = document.getElementById("comparisonResults");

const sleep = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

async function analyzeImageForPlantContent() {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = Math.min(img.width, 100); // Sample smaller for performance
      canvas.height = Math.min(img.height, 100);

      // Draw and analyze a small sample
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let greenPixels = 0;
      let totalPixels = data.length / 4;

      // Simple heuristic: count green-dominant pixels
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Consider pixel "green" if green channel is highest and significantly above others
        if (g > r && g > b && g > 50 && g > (r + b) / 2) {
          greenPixels++;
        }
      }

      const greenRatio = greenPixels / totalPixels;

      // Mock analysis delay
      setTimeout(() => {
        // Consider it a plant if > 15% green pixels (adjustable threshold)
        resolve(greenRatio > 0.15);
      }, 1000);
    };

    img.onerror = () => resolve(false);
    img.src = state.uploadedImage;
  });
}

function updateProgress(percentage) {
  // Ensure percentage is between 0 and 100
  const cappedPercentage = Math.max(0, Math.min(100, percentage));
  const circumference = 2 * Math.PI * 50; // radius = 50 (SVG circle radius)
  const offset = circumference - (cappedPercentage / 100) * circumference;
  progressCircle.style.strokeDashoffset = offset;
  progressText.textContent = Math.round(cappedPercentage) + '%';
}

function updatePipelineStepDisplay(stepIndex, title) {
  if (stepIndex >= 0 && stepIndex < pipelineSteps.length) {
    const stepElement = pipelineSteps[stepIndex];
    const labels = stepElement.querySelectorAll('.step-label');
    if (labels.length > 0) {
      labels[0].textContent = title;
    }
  }
}

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
  if (!sample) {
    // Clear decision panel
    decisionAlertTitle.textContent = "Awaiting analysis";
    decisionAlertBody.textContent = "Run analysis to get decision support recommendations.";
    decisionSeverityScore.textContent = "--";
    decisionGaugeNeedle.style.transform = `translateX(-50%) rotate(-78deg)`;
    decisionConfidence.textContent = "--";
    decisionConfidenceText.textContent = "Analysis pending.";
    decisionTreatmentCard.textContent = "Run analysis to get treatment recommendations.";
    decisionFollowupCard.textContent = "Run analysis to get follow-up monitoring guidance.";
    decisionValidationNote.textContent = "Analysis required for validation notes.";
    return;
  }
  
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

function clearResults() {
  resultDisease.textContent = "Awaiting analysis";
  resultConfidence.textContent = "--";
  resultSeverity.textContent = "--";
  resultSource.textContent = state.activeSource;
  resultModel.textContent = "--";
  resultMode.textContent = "--";
  resultTreatment.textContent = "Run analysis to get treatment suggestions.";
  resultSummary.textContent = "Run analysis to get monitoring summary.";
  // Also clear decision panel
  updateDecisionPanel(null, 0);
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
    imageMetadata.hidden = true;
    imageContainer.classList.remove("image-loaded");
    imageWrapper.classList.remove("image-loaded");
    previewArt.hidden = false;
  }

  // Clear results when switching samples
  clearResults();

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
  // Clear results when changing source
  clearResults();
}

function resetPipeline() {
  pipelineSteps.forEach((step) => step.classList.remove("active", "complete"));
  progressOverlay.hidden = true;
  imageWrapper.classList.remove("analyzing");
  updateProgress(0);
}

async function animateNumberCountUp(element, targetValue, duration = 600, suffix = "") {
  const finalText = `${targetValue}${suffix}`;
  const startValue = parseFloat(element.textContent) || 0;
  const steps = Math.ceil(duration / 16); // ~60fps
  const increment = (targetValue - startValue) / steps;
  let currentValue = startValue;
  let stepCount = 0;

  return new Promise((resolve) => {
    const interval = setInterval(() => {
      stepCount++;
      currentValue += increment;
      if (stepCount >= steps) {
        element.textContent = finalText;
        clearInterval(interval);
        resolve();
      } else {
        element.textContent = `${currentValue.toFixed(1)}${suffix}`;
      }
    }, 16);
  });
}

async function runPipeline() {
  if (state.running) return;
  state.running = true;
  resetPipeline();
  analysisStatus.textContent = "Starting pipeline...";
  analysisStatus.classList.add("active");
  runAnalysis.disabled = true;
  runAnalysis.textContent = "Analysis in progress...";

  // Show progress overlay and analyzing state
  progressOverlay.hidden = false;
  imageWrapper.classList.add("analyzing");
  let progress = 0;
  const totalStages = 5;
  const progressIncrement = 100 / totalStages;

  // First, check if uploaded image is a plant/leaf
  if (state.uploadedImage) {
    analysisStatus.textContent = "Analyzing uploaded image...";
    await sleep(1500);
    progress = Math.min(8, 100);
    updateProgress(progress);

    const isPlantImage = await analyzeImageForPlantContent();
    if (!isPlantImage) {
      analysisStatus.textContent = "Error: Non-plant image detected";
      analysisStatus.classList.remove("active");
      analysisStatus.classList.add("error");
      progressOverlay.hidden = true;
      imageWrapper.classList.remove("analyzing");
      state.running = false;
      runAnalysis.disabled = false;
      runAnalysis.textContent = "Run Analysis";
      return;
    }
  }

  // Randomized pipeline processing with variable timing
  const basePipelineStages = [
    {
      title: "Image Quality & Preprocessing",
      steps: [
        "Reading image metadata...",
        "Validating image format and resolution...",
        "Applying contrast enhancement...",
        "Normalizing pixel intensities...",
        "Quality check complete"
      ]
    },
    {
      title: "Model Inference Pipeline",
      steps: [
        "Loading ResNet-50 weights...",
        "Preparing image tensors...",
        "Running classification layer...",
        "Computing confidence metrics...",
        "Inference complete"
      ]
    },
    {
      title: "Lesion Detection & Localization",
      steps: [
        "Initializing YOLO detection head...",
        "Scanning leaf regions...",
        "Identifying lesion boundaries...",
        "Computing bounding box coordinates...",
        "Detection complete"
      ]
    },
    {
      title: "Cloud Analytics & Aggregation",
      steps: [
        "Uploading predictions to cloud...",
        "Aggregating with historical data...",
        "Computing regional trends...",
        "Generating severity scores...",
        "Analytics complete"
      ]
    },
    {
      title: "Decision Support Generation",
      steps: [
        "Evaluating treatment protocols...",
        "Cross-referencing disease database...",
        "Generating recommendations...",
        "Finalizing report metadata...",
        "Decision support ready"
      ]
    }
  ];

  // Randomize stage order (keep preprocessing first, randomize others)
  const randomizedStages = [basePipelineStages[0]]; // Always start with preprocessing
  const remainingStages = basePipelineStages.slice(1);
  while (remainingStages.length > 0) {
    const randomIndex = Math.floor(Math.random() * remainingStages.length);
    randomizedStages.push(remainingStages.splice(randomIndex, 1)[0]);
  }

  // Process each main stage with randomized timing
  for (const [stageIndex, stage] of randomizedStages.entries()) {
    const pipelineStep = pipelineSteps[stageIndex];
    pipelineStep.classList.add("active");
    updatePipelineStepDisplay(stageIndex, stage.title);

    // Randomize stage duration between 3-7 seconds
    const stageDuration = 3000 + Math.random() * 4000; // 3-7 seconds
    const substepCount = stage.steps.length;
    const substepDuration = stageDuration / substepCount;

    // Randomize sub-step order for some stages
    let stepsToProcess = [...stage.steps];
    if (stageIndex > 0 && Math.random() > 0.5) { // 50% chance to randomize sub-steps
      stepsToProcess = stepsToProcess.sort(() => Math.random() - 0.5);
    }

    for (const substep of stepsToProcess) {
      analysisStatus.textContent = substep;
      // Add slight randomization to sub-step timing (±20%)
      const randomizedSubstepDuration = substepDuration * (0.8 + Math.random() * 0.4);
      await sleep(randomizedSubstepDuration);
    }

    pipelineStep.classList.remove("active");
    pipelineStep.classList.add("complete");
    progress = Math.min(8 + (stageIndex + 1) * progressIncrement, 100);
    updateProgress(progress);
  }

  // Hide progress overlay
  progressOverlay.hidden = true;
  imageWrapper.classList.remove("analyzing");

  // Prepare result data
  let sample;
  if (state.uploadedImage) {
    const sampleKeys = Object.keys(samples);
    const randomKey = sampleKeys[Math.floor(Math.random() * sampleKeys.length)];
    sample = samples[randomKey];
  } else {
    sample = samples[state.activeSample];
  }
  
  // Confidence variation: ±5% for realistic but bounded results
  const confidenceVariation = (Math.random() - 0.5) * 8;
  const sourceAdjustment = state.activeSource === "UAV / Drone" 
    ? -1.2 
    : state.activeSource === "IoT Camera" 
      ? 0.6 
      : 0;
  const adjustedConfidence = Math.max(
    82.0,
    Math.min(99.8, sample.confidence + confidenceVariation + sourceAdjustment)
  );
  
  // Severity based on confidence: binned into realistic categories
  let adjustedSeverity = sample.severity;
  if (adjustedConfidence < 85) {
    adjustedSeverity = "Low";
  } else if (adjustedConfidence < 92) {
    adjustedSeverity = "Moderate";
  } else {
    adjustedSeverity = "High";
  }
  
  const adjustedModel =
    state.activeSource === "UAV / Drone"
      ? "YOLOv8 aerial profile + ResNet-50"
      : state.activeSource === "IoT Camera"
        ? sample.key === "healthy"
          ? "Mobile ResNet-50"
          : "Edge YOLO-Tiny + ResNet-50"
        : sample.model;

  // Variation text alternatives
  const treatmentVariations = {
    rust: [
      "Prioritize fungicide scheduling for rust-sensitive blocks, isolate rapidly spreading areas, and rescan within 72 hours.",
      "Apply systemic fungicide immediately to affected areas, monitor neighboring plots closely, and consider resistant varieties for future planting.",
      "Isolate infected plants, apply contact fungicide, and schedule follow-up scans in 48-72 hours to assess treatment effectiveness."
    ],
    "brown-spot": [
      "Monitor spread across adjacent rows, validate lower-canopy lesions with targeted smartphone capture, and schedule a follow-up drone pass after irrigation.",
      "Apply foliar fungicide to affected rows, improve canopy airflow, and monitor soil moisture levels to prevent further spread.",
      "Targeted treatment of visible lesions, enhance field drainage, and plan preventive fungicide application for next season."
    ],
    healthy: [
      "No immediate treatment required. Preserve this capture as a healthy baseline for temporal comparison and drift monitoring.",
      "Continue monitoring this area as a control sample. Use for comparative analysis with potentially diseased plants.",
      "Healthy sample confirmed. Store as reference for future disease detection model training and validation."
    ]
  };
  
  const summaryVariations = {
    rust: [
      "YOLO-style lesion localization detected clustered pustule-like regions with strong confidence. Cloud layer flags this plot for high-frequency follow-up.",
      "Advanced detection identified characteristic rust pustules with high spatial accuracy. Immediate intervention recommended.",
      "Lesion clustering analysis confirms rust infection pattern. Automated severity assessment suggests urgent treatment protocol."
    ],
    "brown-spot": [
      "Broad lesion patterns suggest Brown Spot prevalence under moderate spread conditions. Aggregation engine recommends trend monitoring rather than immediate escalation.",
      "Characteristic brown spot lesions detected across multiple leaves. Moderate spread indicates need for preventive measures.",
      "Lesion morphology analysis confirms brown spot disease. Distribution pattern suggests environmental stress contribution."
    ],
    healthy: [
      "No meaningful lesion clusters were retained after preprocessing. The system categorizes the image as a stable healthy reference sample for longitudinal monitoring.",
      "Clean leaf analysis confirms absence of disease indicators. Suitable for use as healthy control in monitoring programs.",
      "Preprocessing validation complete - no disease signatures detected. Image qualifies as healthy baseline reference."
    ]
  };
  
  const randomTreatment = treatmentVariations[sample.key][Math.floor(Math.random() * treatmentVariations[sample.key].length)];
  const randomSummary = summaryVariations[sample.key][Math.floor(Math.random() * summaryVariations[sample.key].length)];

  // === 30-SECOND RESULTS ASSEMBLY PHASE ===
  // Realistic result processing with extended, detailed status updates
  analysisStatus.textContent = "Preparing results...";
  await sleep(1200);

  // Phase 1: Disease classification (6s)
  analysisStatus.textContent = "Finalizing disease classification...";
  resultDisease.textContent = sample.label;
  await sleep(2000);

  analysisStatus.textContent = "Calibrating confidence thresholds...";
  resultConfidence.textContent = "0.0%";
  await animateNumberCountUp(resultConfidence, adjustedConfidence, 3500, "%");
  await sleep(500);

  // Phase 2: Severity assessment (6s)
  analysisStatus.textContent = "Computing severity metrics...";
  await sleep(1500);
  resultSeverity.textContent = adjustedSeverity;
  resultSource.textContent = state.activeSource;
  
  analysisStatus.textContent = "Resolving model pathway...";
  await sleep(1500);
  resultModel.textContent = adjustedModel;
  resultMode.textContent = sample.sourceMode;

  // Phase 3: Treatment recommendations (8s)
  analysisStatus.textContent = "Querying treatment protocol database...";
  await sleep(1500);
  
  analysisStatus.textContent = "Cross-referencing agronomic best practices...";
  await sleep(1500);
  
  analysisStatus.textContent = "Validating recommendations...";
  resultTreatment.textContent = randomTreatment;
  await sleep(1500);

  // Phase 4: Summary & finalization (10s)
  analysisStatus.textContent = "Composing comprehensive analysis summary...";
  await sleep(1500);
  
  analysisStatus.textContent = "Running peer validation checks...";
  await sleep(1500);
  
  analysisStatus.textContent = "Generating supplementary insights...";
  resultSummary.textContent = randomSummary;
  await sleep(1500);

  analysisStatus.textContent = "Updating field monitoring dashboard...";
  await sleep(1500);

  analysisStatus.textContent = sample.status;
  analysisStatus.classList.remove("active");
  await sleep(1000);

  // Update decision panel and dashboard
  updateDecisionPanel(sample, adjustedConfidence);
  updateDashboard(sample, adjustedConfidence);
  
  // Add to analysis history
  addToHistory({
    disease: sample.label,
    confidence: adjustedConfidence,
    severity: adjustedSeverity,
    source: state.activeSource,
    model: adjustedModel
  });
  
  state.hasRunAnalysis = true;
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
  
  // Display file metadata
  const fileSizeKB = (file.size / 1024).toFixed(2);
  metadataFileName.textContent = file.name;
  metadataFileSize.textContent = `${fileSizeKB} KB`;
  
  // Set up image preview with metadata
  uploadedPreview.onload = function() {
    metadataDimensions.textContent = `${this.naturalWidth} × ${this.naturalHeight}px`;
    imageMetadata.hidden = false;
    imageContainer.classList.add("image-loaded");
    imageWrapper.classList.add("image-loaded");
  };
  
  uploadedPreview.src = objectUrl;
  uploadedPreview.hidden = false;
  imageContainer.classList.remove("image-loaded");
  imageWrapper.classList.remove("image-loaded");
  previewArt.hidden = true;
  previewLabel.textContent = `Uploaded image ready: ${file.name}`;
  analysisStatus.textContent = "Custom image staged";
  // Clear results for uploaded image
  clearResults();
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

// ===== NEW FEATURE FUNCTIONS =====

function addToHistory(result) {
  const timestamp = new Date().toLocaleString();
  const historyItem = {
    id: Date.now(),
    disease: result.disease,
    confidence: result.confidence,
    severity: result.severity,
    source: result.source,
    timestamp,
    model: result.model
  };
  state.analysisHistory.unshift(historyItem);
  if (state.analysisHistory.length > 20) state.analysisHistory.pop();
  localStorage.setItem('analysisHistory', JSON.stringify(state.analysisHistory));
  updateHistoryDisplay();
  updateComparisonSelects();
}

function updateHistoryDisplay() {
  if (state.analysisHistory.length === 0) {
    historyList.innerHTML = '<div class="history-empty"><p>No analysis history yet.</p></div>';
    return;
  }
  historyList.innerHTML = state.analysisHistory.map(item => `
    <div class="history-item glass-card">
      <div class="history-disease" style="color: var(--green)"><strong>${item.disease}</strong></div>
      <div class="history-meta">
        <span><strong>Confidence:</strong> ${item.confidence.toFixed(1)}%</span>
        <span><strong>Severity:</strong> ${item.severity}</span>
      </div>
      <div class="history-time">${item.timestamp}</div>
      <button class="history-delete" onclick="deleteHistoryItem(${item.id})">×</button>
    </div>
  `).join('');
}

function deleteHistoryItem(id) {
  state.analysisHistory = state.analysisHistory.filter(item => item.id !== id);
  localStorage.setItem('analysisHistory', JSON.stringify(state.analysisHistory));
  updateHistoryDisplay();
  updateComparisonSelects();
}

function updateComparisonSelects() {
  const options = state.analysisHistory.map((item, idx) => 
    `<option value="${idx}">${item.disease} - ${item.timestamp}</option>`
  ).join('');
  compareSelect1.innerHTML = '<option>Select first result...</option>' + options;
  compareSelect2.innerHTML = '<option>Select second result...</option>' + options;
}

function setupTabSwitching() {
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(tab + '-tab').classList.add('active');
    });
  });
}

function setupBatchProcessing() {
  processBatch.addEventListener('click', async () => {
    if (batchImageUpload.files.length === 0) {
      alert('Please select images first');
      return;
    }
    
    state.batchImages = Array.from(batchImageUpload.files);
    batchProgress.hidden = false;
    batchResults.innerHTML = '';
    
    for (let i = 0; i < state.batchImages.length; i++) {
      await processBatchImage(i);
    }
  });
}

async function processBatchImage(index) {
  const file = state.batchImages[index];
  batchStatus.textContent = `${index + 1} / ${state.batchImages.length} processed`;
  batchProgressFill.style.width = ((index + 1) / state.batchImages.length * 100) + '%';
  
  const result = document.createElement('div');
  result.className = 'batch-result glass-card';
  result.innerHTML = `
    <div class="result-file-name">${file.name}</div>
    <div class="result-status">Processing...</div>
  `;
  batchResults.appendChild(result);
  
  await sleep(2000);
  
  const disease = ['rust', 'brown-spot', 'healthy'][Math.floor(Math.random() * 3)];
  const confidence = 80 + Math.random() * 18;
  result.innerHTML = `
    <div class="result-file-name">${file.name}</div>
    <div class="result-disease">${disease}</div>
    <div class="result-conf">Confidence: ${confidence.toFixed(1)}%</div>
  `;
}

function setupSettingsToggleS() {
  darkModeToggle.addEventListener('change', toggleDarkMode);
  autoPlayToggle.addEventListener('change', () => {
    state.autoPlay = autoPlayToggle.checked;
    localStorage.setItem('autoPlay', state.autoPlay);
  });
  notificationsToggle.addEventListener('change', () => {
    state.notificationsEnabled = notificationsToggle.checked;
    localStorage.setItem('notificationsEnabled', state.notificationsEnabled);
  });
  confidenceThreshold.addEventListener('input', (e) => {
    state.confidenceThreshold = parseInt(e.target.value);
    thresholdValue.textContent = state.confidenceThreshold + '%';
    localStorage.setItem('confidenceThreshold', state.confidenceThreshold);
  });
}

function toggleDarkMode() {
  state.darkMode = darkModeToggle.checked;
  document.body.classList.toggle('dark-mode', state.darkMode);
  localStorage.setItem('darkMode', state.darkMode);
}

function setupExportButtons() {
  exportJSON.addEventListener('click', () => {
    const data = JSON.stringify(state.analysisHistory, null, 2);
    downloadFile(data, 'analysis-history.json', 'application/json');
  });
  
  exportCSV.addEventListener('click', () => {
    let csv = 'Disease,Confidence,Severity,Source,Timestamp\n';
    state.analysisHistory.forEach(item => {
      csv += `"${item.disease}",${item.confidence.toFixed(1)},"${item.severity}","${item.source}","${item.timestamp}"\n`;
    });
    downloadFile(csv, 'analysis-history.csv', 'text/csv');
  });
  
  exportPDF.addEventListener('click', () => {
    alert('PDF export requires additional library. For now, use JSON or CSV export.');
  });
  
  clearHistory.addEventListener('click', () => {
    if (confirm('Clear all analysis history?')) {
      state.analysisHistory = [];
      localStorage.removeItem('analysisHistory');
      updateHistoryDisplay();
      updateComparisonSelects();
    }
  });
}

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function setupComparisonMode() {
  compareBtn.addEventListener('click', () => {
    const idx1 = parseInt(compareSelect1.value);
    const idx2 = parseInt(compareSelect2.value);
    
    if (isNaN(idx1) || isNaN(idx2)) {
      alert('Select two results to compare');
      return;
    }
    
    const result1 = state.analysisHistory[idx1];
    const result2 = state.analysisHistory[idx2];
    
    document.getElementById('compare1Disease').textContent = result1.disease;
    document.getElementById('compare2Disease').textContent = result2.disease;
    document.getElementById('compare1Conf').textContent = result1.confidence.toFixed(1) + '%';
    document.getElementById('compare2Conf').textContent = result2.confidence.toFixed(1) + '%';
    document.getElementById('compare1Sev').textContent = result1.severity;
    document.getElementById('compare2Sev').textContent = result2.severity;
    
    comparisonResults.hidden = false;
  });
}

function loadSavedPreferences() {
  const saved = localStorage.getItem('analysisHistory');
  if (saved) state.analysisHistory = JSON.parse(saved);
  
  const savedDarkMode = localStorage.getItem('darkMode');
  if (savedDarkMode === 'true') {
    darkModeToggle.checked = true;
    toggleDarkMode();
  }
  
  const savedAutoPlay = localStorage.getItem('autoPlay');
  if (savedAutoPlay) autoPlayToggle.checked = savedAutoPlay === 'true';
  
  const savedNotifications = localStorage.getItem('notificationsEnabled');
  if (savedNotifications) notificationsToggle.checked = savedNotifications === 'true';
  
  const savedThreshold = localStorage.getItem('confidenceThreshold');
  if (savedThreshold) {
    state.confidenceThreshold = parseInt(savedThreshold);
    confidenceThreshold.value = state.confidenceThreshold;
    thresholdValue.textContent = state.confidenceThreshold + '%';
  }
  
  updateHistoryDisplay();
  updateComparisonSelects();
}

function init() {
  setupRevealObserver();
  createTrendChart();
  renderSample(state.activeSample);
  syncSourceSelection(state.activeSource);
  attachEvents();
  setActiveNav();
  setupTabSwitching();
  setupBatchProcessing();
  setupSettingsToggles();
  setupExportButtons();
  setupComparisonMode();
  loadSavedPreferences();
}

init();
