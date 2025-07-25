let storageFacilitiesLayer; // Global declaration so it can be used in renderAnalyticsBoxes
let cropLossReportsLayer; // Global declaration for the crop loss reports layer

/********************************************************************
 * 1. SIDEBAR PANEL STATE HELPERS
 ********************************************************************/
const sidebarEl = document.getElementById('sidebar');
const homePanelEl = document.getElementById('homePanel');
const cropPanelEl = document.getElementById('cropPanel');
const cropDetailPanelEl = document.getElementById('cropDetailPanel');
const cropDetailContentEl = document.getElementById('cropDetailContent');
const cropGridEl = document.getElementById('cropGrid');
const analyticsPanelEl = document.getElementById('analyticsPanel');
const analyticsGridEl = document.getElementById('analyticsGrid');
const cropBreakdownPanelEl = document.getElementById('cropBreakdownPanel');
const cropBreakdownContentEl = document.getElementById('cropBreakdownContent');
const problemBreakdownPanelEl = document.getElementById('problemBreakdownPanel');
const problemBreakdownContentEl = document.getElementById('problemBreakdownContent');

function setActivePanel(panelName) {
  // Hide all
  [homePanelEl, cropPanelEl, cropDetailPanelEl, analyticsPanelEl].forEach(p => p.classList.remove('panel--active'));
  sidebarEl.classList.remove('sidebar--expanded', 'sidebar--detail', 'sidebar--collapsed');

  if (panelName === 'home') {
    homePanelEl.classList.add('panel--active');
    sidebarEl.classList.add('sidebar--collapsed');
  } else if (panelName === 'cropList') {
    cropPanelEl.classList.add('panel--active');
    sidebarEl.classList.add('sidebar--expanded');
  } else if (panelName === 'cropDetail') {
    cropDetailPanelEl.classList.add('panel--active');
    sidebarEl.classList.add('sidebar--detail');
  } else if (panelName === 'analytics') {
    analyticsPanelEl.classList.add('panel--active');
    sidebarEl.classList.add('sidebar--expanded');
  }
}

function showCropPanel() {
  setActivePanel('cropList');
}

function showHomePanel() {
  setActivePanel('home');
}

function showCropDetail(cropId) {
  const crop = cropData.find(c => c.id === cropId);
  if (!crop) return;
  renderCropDetail(crop);
  setActivePanel('cropDetail');
}

function showAnalyticsPanel() {
  setActivePanel('analytics');
  renderAnalyticsBoxes();
}

function toggleCropBreakdown() {
  const isVisible = cropBreakdownPanelEl.style.display !== 'none';
  cropBreakdownPanelEl.style.display = isVisible ? 'none' : 'block';
  
  if (!isVisible) {
    renderCropBreakdown();
  }
}

function toggleProblemBreakdown() {
  const isVisible = problemBreakdownPanelEl.style.display !== 'none';
  problemBreakdownPanelEl.style.display = isVisible ? 'none' : 'block';
  
  if (!isVisible) {
    renderProblemBreakdown();
  }
}

/********************************************************************
 * 2. CROP DATA (EDIT / EXPAND THIS!)
 * You can swap image URLs for local images (e.g., imgs/paddy.png).
 ********************************************************************/
const cropData = [
  {
    id: "paddy",
    name: "Paddy (Rice)",
    emoji: "🌾",
    img: "images/paddy-harvest-golden-yellow-paddy-hand-farmer-carrying-paddy-hand-rice.jpg",
    summary: "Sri Lanka's staple crop; sensitive to water stress, pests, and blast disease.",
    diseases: [
      { name: "Rice Blast (Magnaporthe oryzae)", sym: "Diamond-shaped lesions on leaves; can destroy panicles.", manage: "Use resistant varieties; balanced nitrogen; fungicide if severe." },
      { name: "Bacterial Leaf Blight", sym: "Water-soaked streaks that turn yellow/brown and spread along veins.", manage: "Clean seed; avoid standing water; copper treatments where recommended." }
    ],
    resources: [
      { label: "DOA Rice Extension Guide (PDF)", url: "#" },
      { label: "IRRI Disease ID Tool", url: "https://www.irri.org" }
    ]
  },
  {
    id: "tea",
    name: "Tea",
    emoji: "🍃",
    img: "images/green-tea-bud-leaves-green-tea-plantations-morning.jpg",
    summary: "Estate crop; productivity impacted by blister blight, red spider mite, and root diseases.",
    diseases: [
      { name: "Blister Blight", sym: "Pinhead water-soaked spots on young leaves forming blisters.", manage: "Sanitation pruning; fungicide spray programs in wet seasons." },
      { name: "Red Spider Mite (Pest)", sym: "Speckled leaves; webbing; defoliation under drought stress.", manage: "Miticide rotations; shade & moisture management." }
    ],
    resources: [
      { label: "TRI Advisory Notes", url: "#" }
    ]
  },
  {
    id: "coconut",
    name: "Coconut",
    emoji: "🥥",
    img: "images/coconut-still-life.jpg",
    summary: "Widely grown perennial; susceptible to bud rot, coconut mite, and nutritional stress.",
    diseases: [
      { name: "Bud Rot", sym: "Rotting spear leaf; collapse of growing point.", manage: "Remove infected tissue; copper fungicide drench; improve drainage." },
      { name: "Coconut Mite", sym: "Lesions on nuts; distorted fruit; yield loss.", manage: "Biocontrol agents; post-harvest nut treatment." }
    ],
    resources: [
      { label: "Coconut Research Institute", url: "#" }
    ]
  },
  {
    id: "onion",
    name: "Onion",
    emoji: "🧅",
    img: "images/red-onion-whole-isolated-white.jpg",
    summary: "Bulb crop grown in dry climates; prone to fungal and insect damage under poor drainage or humidity.",
    diseases: [
      { name: "Purple Blotch", sym: "Purple lesions on leaves/scapes; high humidity favors spread.", manage: "Use healthy seed; crop rotation; chemical control; remove infected parts." },
      { name: "Twister (Anthracnose)", sym: "Curling, yellowing leaves; bulb decay in moist conditions.", manage: "Use clean seed; good drainage; chemical control; remove infected plants." }
    ],
    resources: [
      { label: "Onion Cultivation Guide", url: "#" }
    ]
},
{
    id: "chili",
    name: "Chili",
    emoji: "🌶️",
    img: "images/dried-chili-pepper-small-wooden-plate.jpg",
    summary: "Hot pepper crop suited for warm climates; vulnerable to fungal diseases and insect pests.",
    diseases: [
      { name: "Anthracnose", sym: "Dark sunken lesions on fruit; fruit rot.", manage: "Use clean seeds; avoid dense planting; fungicide application." },
      { name: "Collar Rot", sym: "Stem base rots; plant collapse.", manage: "Soil drenching with fungicides; avoid continuous cropping." }
    ],
    resources: [
      { label: "Chili Farming Manual", url: "#" }
    ]
},
{
    id: "groundnut",
    name: "Groundnut",
    emoji: "🥜",
    img: "images/peanuts-shells-wood.jpg",
    summary: "Legume grown in drylands; prone to leaf spots, rust, and rot under poor management.",
    diseases: [
      { name: "Leaf Spot (Early/Late)", sym: "Yellow/black leaf spots; leads to defoliation.", manage: "Apply recommended fungicides." },
      { name: "Rust", sym: "Orange pustules on leaf undersides.", manage: "Fungicidal sprays; timely application." },
      { name: "Stem Rot", sym: "Sudden wilting; white mycelium near base.", manage: "Remove infected plants; rotate crops; treat soil." },
      { name: "Bud Necrosis", sym: "Terminal bud dies; leaf mottling; stunted plants.", manage: "Control vectors; avoid late planting." }
    ],
    resources: [
      { label: "Groundnut Crop Handbook", url: "#" }
    ]
},
{
    id: "cowpea",
    name: "Cowpea",
    emoji: "🌱",
    img: "images/seeds.jpg",
    summary: "Short-duration legume grown in dry zones; susceptible to anthracnose and collar rot.",
    diseases: [
      { name: "Anthracnose", sym: "Leaf and stem lesions; poor pod set.", manage: "Use clean seed; fungicide for Rhizoctonia." },
      { name: "Collar Rot", sym: "Rot at soil line; seedling death.", manage: "Soil drenching; avoid monoculture." }
    ],
    resources: [
      { label: "Cowpea Production Guide", url: "#" }
    ]
},
{
    id: "blackgram",
    name: "Blackgram",
    emoji: "🌿",
    img: "images/black-bean-small-wooden-spoon-place-sack-bag-full-black-bean.jpg",
    summary: "Pulse crop; sensitive to collar rot and anthracnose under wet soil conditions.",
    diseases: [
      { name: "Anthracnose", sym: "Stem/leaf lesions; pod deformation.", manage: "Use disease-free seed; fungicide spray." },
      { name: "Collar Rot", sym: "Base stem rot; seedling wilt.", manage: "Soil drench; crop rotation." }
    ],
    resources: [
      { label: "Blackgram Farmer Sheet", url: "#" }
    ]
}
];

/********************************************************************
 * 3. RENDER CROP GRID
 ********************************************************************/
function renderCropGrid() {
  cropGridEl.innerHTML = "";
  cropData.forEach(crop => {
    const card = document.createElement('div');
    card.className = 'crop-card';
    card.role = 'listitem';
    card.tabIndex = 0;
    card.setAttribute('data-crop-id', crop.id);
    card.innerHTML = `
      <img src="${crop.img}" alt="${crop.name}">
      <div class="crop-card-title">${crop.emoji} ${crop.name}</div>
      <div class="crop-card-sub">${crop.summary}</div>
    `;
    card.addEventListener('click', () => showCropDetail(crop.id));
    card.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        showCropDetail(crop.id);
      }
    });
    cropGridEl.appendChild(card);
  });
}

/********************************************************************
 * 4. ENHANCED ANALYTICS HELPER FUNCTIONS
 ********************************************************************/

async function getMostReportedDistrict() {
  try {
    await cropLossReportsLayer.when();
    const query = cropLossReportsLayer.createQuery();
    query.where = "1=1";
    query.outFields = ["districtds_division"];
    query.returnGeometry = false;

    const results = await cropLossReportsLayer.queryFeatures(query);
    
    // Count occurrences of each district
    const districtCounts = {};
    results.features.forEach(feature => {
      const district = feature.attributes.districtds_division;
      if (district && district.trim() !== '') {
        districtCounts[district] = (districtCounts[district] || 0) + 1;
      }
    });

    // Find the district with the most reports
    let maxDistrict = 'N/A';
    let maxCount = 0;
    for (const [district, count] of Object.entries(districtCounts)) {
      if (count > maxCount) {
        maxCount = count;
        maxDistrict = district;
      }
    }

    return { district: maxDistrict, count: maxCount };
  } catch (error) {
    console.error("Error getting most reported district:", error);
    return { district: 'N/A', count: 0 };
  }
}

async function getMostFrequentIssue() {
  try {
    await cropLossReportsLayer.when();
    const query = cropLossReportsLayer.createQuery();
    query.where = "1=1";
    query.outFields = ["what_was_the_cause_of_damage", "what_was_the_cause_of_damage_other"];
    query.returnGeometry = false;

    const results = await cropLossReportsLayer.queryFeatures(query);
    
    // Count occurrences of each cause
    const causeCounts = {};
    results.features.forEach(feature => {
      let cause = feature.attributes.what_was_the_cause_of_damage;
      const otherCause = feature.attributes.what_was_the_cause_of_damage_other;
      
      // If "Other" is selected and there's a specific cause mentioned, use that
      if (cause === 'Other' && otherCause && otherCause.trim() !== '') {
        cause = otherCause.trim();
      }
      
      if (cause && cause.trim() !== '') {
        causeCounts[cause] = (causeCounts[cause] || 0) + 1;
      }
    });

    // Find the most frequent cause
    let maxCause = 'N/A';
    let maxCount = 0;
    for (const [cause, count] of Object.entries(causeCounts)) {
      if (count > maxCount) {
        maxCount = count;
        maxCause = cause;
      }
    }

    return maxCause;
  } catch (error) {
    console.error("Error getting most frequent issue:", error);
    return 'N/A';
  }
}

// NEW FUNCTION: Get detailed problem-wise breakdown
async function getProblemWiseBreakdown() {
  try {
    await cropLossReportsLayer.when();
    const query = cropLossReportsLayer.createQuery();
    query.where = "1=1";
    query.outFields = ["what_was_the_cause_of_damage", "what_was_the_cause_of_damage_other"];
    query.returnGeometry = false;

    const results = await cropLossReportsLayer.queryFeatures(query);
    
    // Initialize problem categories
    const problemCounts = {
      'Flood': 0,
      'Drought': 0,
      'Fire': 0,
      'Pest Attack': 0,
      'Fungal disease': 0,
      'Market delay / transport issue': 0,
      'Storage failure': 0,
      'Other': 0
    };

    // Count occurrences of each problem
    results.features.forEach(feature => {
      let cause = feature.attributes.what_was_the_cause_of_damage;
      const otherCause = feature.attributes.what_was_the_cause_of_damage_other;
      
      // If "Other" is selected and there's a specific cause mentioned, use that
      if (cause === 'Other' && otherCause && otherCause.trim() !== '') {
        cause = otherCause.trim();
      }
      
      if (cause && cause.trim() !== '') {
        // Match to predefined categories
        const causeLower = cause.toLowerCase();
        if (causeLower.includes('flood')) {
          problemCounts['Flood']++;
        } else if (causeLower.includes('drought')) {
          problemCounts['Drought']++;
        } else if (causeLower.includes('fire')) {
          problemCounts['Fire']++;
        } else if (causeLower.includes('pest')) {
          problemCounts['Pest Attack']++;
        } else if (causeLower.includes('fungal') || causeLower.includes('disease')) {
          problemCounts['Fungal disease']++;
        } else if (causeLower.includes('market') || causeLower.includes('transport')) {
          problemCounts['Market delay / transport issue']++;
        } else if (causeLower.includes('storage') || causeLower.includes('silo')) {
          problemCounts['Storage failure']++;
        } else {
          problemCounts['Other']++;
        }
      }
    });

    const totalProblems = Object.values(problemCounts).reduce((sum, count) => sum + count, 0);
    return { problemCounts, totalProblems };
  } catch (error) {
    console.error("Error getting problem-wise breakdown:", error);
    return { problemCounts: {}, totalProblems: 0 };
  }
}

async function getMostAffectedCrop() {
  try {
    await cropLossReportsLayer.when();
    const query = cropLossReportsLayer.createQuery();
    query.where = "1=1";
    query.outFields = ["what_crops_were_affected", "what_crops_were_affected_other"];
    query.returnGeometry = false;

    const results = await cropLossReportsLayer.queryFeatures(query);
    
    // Count occurrences of each crop
    const cropCounts = {};
    results.features.forEach(feature => {
      let crops = feature.attributes.what_crops_were_affected;
      const otherCrops = feature.attributes.what_crops_were_affected_other;
      
      // If "Other" is selected and there's a specific crop mentioned, use that
      if (crops === 'Other' && otherCrops && otherCrops.trim() !== '') {
        crops = otherCrops.trim();
      }
      
      if (crops && crops.trim() !== '') {
        // Handle multiple crops in one response (split by common delimiters)
        const cropList = crops.split(/[,;\/&]/).map(crop => crop.trim());
        cropList.forEach(crop => {
          if (crop !== '') {
            cropCounts[crop] = (cropCounts[crop] || 0) + 1;
          }
        });
      }
    });

    // Find the most affected crop
    let maxCrop = 'N/A';
    let maxCount = 0;
    for (const [crop, count] of Object.entries(cropCounts)) {
      if (count > maxCount) {
        maxCount = count;
        maxCrop = crop;
      }
    }

    return maxCrop;
  } catch (error) {
    console.error("Error getting most affected crop:", error);
    return 'N/A';
  }
}

async function getPestDiseaseIncidents() {
  try {
    await cropLossReportsLayer.when();
    const query = cropLossReportsLayer.createQuery();
    query.where = "1=1";
    query.outFields = ["what_was_the_cause_of_damage", "what_was_the_cause_of_damage_other"];
    query.returnGeometry = false;

    const results = await cropLossReportsLayer.queryFeatures(query);
    
    let pestDiseaseCount = 0;
    results.features.forEach(feature => {
      const cause = feature.attributes.what_was_the_cause_of_damage;
      const otherCause = feature.attributes.what_was_the_cause_of_damage_other;
      
      // Check if the cause is related to pest or disease
      if (cause && (
        cause.toLowerCase().includes('pest') ||
        cause.toLowerCase().includes('disease') ||
        cause.toLowerCase().includes('insect') ||
        cause.toLowerCase().includes('fungal') ||
        cause.toLowerCase().includes('bacterial') ||
        cause.toLowerCase().includes('viral')
      )) {
        pestDiseaseCount++;
      } else if (otherCause && (
        otherCause.toLowerCase().includes('pest') ||
        otherCause.toLowerCase().includes('disease') ||
        otherCause.toLowerCase().includes('insect') ||
        otherCause.toLowerCase().includes('fungal') ||
        otherCause.toLowerCase().includes('bacterial') ||
        otherCause.toLowerCase().includes('viral')
      )) {
        pestDiseaseCount++;
      }
    });

    return pestDiseaseCount;
  } catch (error) {
    console.error("Error getting pest/disease incidents:", error);
    return 0;
  }
}

// MODIFIED FUNCTION: Get detailed reporting to authorities stats
async function getReportedToAuthoritiesStats() {
  try {
    await cropLossReportsLayer.when();
    const query = cropLossReportsLayer.createQuery();
    query.where = "1=1";
    query.outFields = ["has_this_incident_already_been"];
    query.returnGeometry = false;

    const results = await cropLossReportsLayer.queryFeatures(query);
    
    let totalReports = 0;
    let reportedToAuthorities = 0;
    
    results.features.forEach(feature => {
      const reported = feature.attributes.has_this_incident_already_been;
      if (reported && reported.trim() !== '') {
        totalReports++;
        if (reported.toLowerCase().includes('yes')) {
          reportedToAuthorities++;
        }
      }
    });

    const percentage = totalReports > 0 ? Math.round((reportedToAuthorities / totalReports) * 100) : 0;
    return { 
      percentage: `${percentage}%`, 
      reportedCount: reportedToAuthorities,
      totalCount: totalReports
    };
  } catch (error) {
    console.error("Error getting reported to authorities stats:", error);
    return { percentage: '0%', reportedCount: 0, totalCount: 0 };
  }
}

async function getCropwiseIncidents() {
  try {
    await cropLossReportsLayer.when();
    const query = cropLossReportsLayer.createQuery();
    query.where = "1=1";
    query.outFields = ["what_crops_were_affected"];
    query.returnGeometry = false;

    const results = await cropLossReportsLayer.queryFeatures(query);
    
    // Initialize crop counts
    const cropCounts = {
      'Paddy': 0,
      'Maize': 0,
      'Vegetables': 0,
      'Fruits': 0,
      'Other': 0
    };

    // Count crop incidents
    results.features.forEach(feature => {
      const crops = feature.attributes.what_crops_were_affected;
      if (crops && crops.trim() !== '') {
        // Check if the crop field contains any of our target crops
        const cropsLower = crops.toLowerCase();
        
        if (cropsLower.includes('paddy') || cropsLower.includes('rice')) {
          cropCounts['Paddy']++;
        }
        if (cropsLower.includes('maize') || cropsLower.includes('corn')) {
          cropCounts['Maize']++;
        }
        if (cropsLower.includes('vegetable') || cropsLower.includes('onion') || cropsLower.includes('tomato') || cropsLower.includes('carrot')) {
          cropCounts['Vegetables']++;
        }
        if (cropsLower.includes('fruit') || cropsLower.includes('mango') || cropsLower.includes('banana') || cropsLower.includes('coconut')) {
          cropCounts['Fruits']++;
        }
        // If none of the above, count as 'Other'
        if (!cropsLower.includes('paddy') && !cropsLower.includes('rice') && 
            !cropsLower.includes('maize') && !cropsLower.includes('corn') &&
            !cropsLower.includes('vegetable') && !cropsLower.includes('onion') && 
            !cropsLower.includes('tomato') && !cropsLower.includes('carrot') &&
            !cropsLower.includes('fruit') && !cropsLower.includes('mango') && 
            !cropsLower.includes('banana') && !cropsLower.includes('coconut')) {
          cropCounts['Other']++;
        }
      }
    });

    const totalIncidents = Object.values(cropCounts).reduce((sum, count) => sum + count, 0);
    return { cropCounts, totalIncidents };
  } catch (error) {
    console.error("Error getting crop-wise incidents:", error);
    return { cropCounts: { 'Paddy': 0, 'Maize': 0, 'Vegetables': 0, 'Fruits': 0, 'Other': 0 }, totalIncidents: 0 };
  }
}

function renderCropBreakdown() {
  getCropwiseIncidents().then(({ cropCounts }) => {
    cropBreakdownContentEl.innerHTML = '';
    
    Object.entries(cropCounts).forEach(([cropName, count]) => {
      const cropItem = document.createElement('div');
      cropItem.className = 'crop-item';
      cropItem.innerHTML = `
        <span class="crop-name">${cropName}</span>
        <span class="crop-count">${count}</span>
      `;
      cropBreakdownContentEl.appendChild(cropItem);
    });
  });
}

// NEW FUNCTION: Render problem breakdown
function renderProblemBreakdown() {
  getProblemWiseBreakdown().then(({ problemCounts }) => {
    problemBreakdownContentEl.innerHTML = '';
    
    Object.entries(problemCounts).forEach(([problemName, count]) => {
      const problemItem = document.createElement('div');
      problemItem.className = 'problem-item';
      problemItem.innerHTML = `
        <span class="problem-name">${problemName}</span>
        <span class="problem-count">${count}</span>
      `;
      problemBreakdownContentEl.appendChild(problemItem);
    });
  });
}

/********************************************************************
 * 5. RENDER ANALYTICS BOXES WITH ENHANCED DYNAMIC DATA
 ********************************************************************/
async function renderAnalyticsBoxes() {
  let totalStorageCapacity = 0;
  let totalAreaAffected = 0;
  let totalReports = 0;
  let mostReportedDistrict = { district: 'N/A', count: 0 };
  let cropIncidents = { totalIncidents: 0 };
  let problemBreakdown = { totalProblems: 0 };
  let mostFrequentIssue = 'N/A';
  let mostAffectedCrop = 'N/A';
  let pestDiseaseIncidents = 0;
  let reportedToAuthoritiesStats = { percentage: '0%', reportedCount: 0, totalCount: 0 };

  try {
    // Get total storage capacity from storage facilities layer
    await storageFacilitiesLayer.when();
    const storageQuery = storageFacilitiesLayer.createQuery();
    storageQuery.where = "Status = 'Working'";
    storageQuery.outFields = ["Capacity"];
    storageQuery.returnGeometry = false;

    const storageResults = await storageFacilitiesLayer.queryFeatures(storageQuery);
    storageResults.features.forEach((feature) => {
      const cap = parseFloat(feature.attributes.Capacity);
      if (!isNaN(cap)) {
        totalStorageCapacity += cap;
      }
    });

    // Get total area affected and total reports from crop loss reports layer
    await cropLossReportsLayer.when();
    const reportsQuery = cropLossReportsLayer.createQuery();
    reportsQuery.where = "1=1"; // Get all records
    reportsQuery.outFields = ["approximate_area_affected_in_ac"];
    reportsQuery.returnGeometry = false;

    const reportsResults = await cropLossReportsLayer.queryFeatures(reportsQuery);
    totalReports = reportsResults.features.length;
    
    reportsResults.features.forEach((feature) => {
      const area = parseFloat(feature.attributes.approximate_area_affected_in_ac);
      if (!isNaN(area)) {
        totalAreaAffected += area;
      }
    });

    // Get all enhanced analytics data
    mostReportedDistrict = await getMostReportedDistrict();
    cropIncidents = await getCropwiseIncidents();
    problemBreakdown = await getProblemWiseBreakdown();
    mostFrequentIssue = await getMostFrequentIssue();
    mostAffectedCrop = await getMostAffectedCrop();
    pestDiseaseIncidents = await getPestDiseaseIncidents();
    reportedToAuthoritiesStats = await getReportedToAuthoritiesStats();

  } catch (err) {
    console.error("Error calculating analytics data:", err);
  }

  // Build analytics cards with enhanced dynamic data (reordered as requested)
  const analyticsData = [
    { id: "totalStorage", title: "🏬 Total Storage Capacity", value: `${totalStorageCapacity.toLocaleString()} MT`, clickable: false },
    { id: "totalReports", title: "📌 Total Reports", value: totalReports.toString(), clickable: false },
    { id: "totalAreasAffected", title: "🌾 Total Areas Affected", value: `${totalAreaAffected.toLocaleString()} acres`, clickable: false },
    { id: "topDistrict", title: "📍 Most Reported District", value: `${mostReportedDistrict.district} (${mostReportedDistrict.count})`, clickable: false },
    { id: "mostAffectedCrop", title: "🧺 Most Affected Crop", value: mostAffectedCrop, clickable: false },
    { id: "cropIncidents", title: "🌾 Crop-wise Incidents", value: `${cropIncidents.totalIncidents} Total`, clickable: true },
    { id: "frequentIssue", title: "🔁 Most Frequent Issue", value: mostFrequentIssue, clickable: false },
    { id: "problemBreakdown", title: "⚠️ Problem-wise Reports", value: `${problemBreakdown.totalProblems} Total`, clickable: true },
    { id: "diseaseReports", title: "🐛 Pest/Disease Incidents", value: pestDiseaseIncidents.toString(), clickable: false },
    { id: "reportToAuthorities", title: "🏢 Reported to Authorities", value: `${reportedToAuthoritiesStats.percentage} (${reportedToAuthoritiesStats.reportedCount})`, clickable: false }
  ];

  analyticsGridEl.innerHTML = "";
  analyticsData.forEach(box => {
    const card = document.createElement('div');
    card.className = box.clickable ? 'crop-card clickable-analytics' : 'crop-card';
    if (box.clickable) {
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        if (box.id === 'cropIncidents') {
          toggleCropBreakdown();
        } else if (box.id === 'problemBreakdown') {
          toggleProblemBreakdown();
        }
      });
    }
    card.innerHTML = `
      <div class="crop-card-title">${box.title}</div>
      <div class="crop-card-sub" style="font-size: 18px; font-weight: bold; color: #333;">${box.value}</div>
      ${box.clickable ? '<div style="font-size: 10px; color: #666; margin-top: 4px;">Click for details</div>' : ''}
    `;
    analyticsGridEl.appendChild(card);
  });
}

/********************************************************************
 * 6. RENDER CROP DETAIL
 ********************************************************************/
function renderCropDetail(crop) {
  cropDetailContentEl.innerHTML = `
    <div class="crop-detail-header">
      <img src="${crop.img}" alt="${crop.name}">
      <h2 id="cropDetailTitle" class="crop-detail-title">${crop.emoji} ${crop.name}</h2>
    </div>
    <div class="crop-detail-section">
      <h3>Overview</h3>
      <p>${crop.summary}</p>
    </div>
    <div class="crop-detail-section">
      <h3>Key Diseases & Pests</h3>
      <ul>
        ${crop.diseases.map(d => `
          <li>
            <strong>${d.name}:</strong> ${d.sym}<br>
            <em>Management:</em> ${d.manage}
          </li>
        `).join('')}
      </ul>
    </div>
    <div class="crop-detail-section">
      <h3>Resources</h3>
      <ul>
        ${crop.resources.map(r => `<li><a href="${r.url}" target="_blank" rel="noopener noreferrer">${r.label}</a></li>`).join('')}
      </ul>
    </div>
  `;
}

function hideAnalyticsPanelAndGoHome() {
  // Clear the analytics panel's content
  analyticsGridEl.innerHTML = "";
  // Reset visibility of panel (optional: hide entire panel)
  analyticsPanelEl.classList.remove('panel--active');
  // Show the home panel
  setActivePanel('home');
}

/********************************************************************
 * 7. WIRE UI EVENTS
 ********************************************************************/
document.getElementById('btnCropPanel').addEventListener('click', showCropPanel);
document.getElementById('backToHomeBtn').addEventListener('click', showHomePanel);
document.getElementById('backToCropListBtn').addEventListener('click', showCropPanel);
document.getElementById('btnAnalyticsPanel').addEventListener('click', showAnalyticsPanel);
document.getElementById('backToHomeFromAnalyticsBtn').addEventListener('click', hideAnalyticsPanelAndGoHome);

// Build grid now
renderCropGrid();

/********************************************************************
 * 8. ARCGIS MAP + Storage Facilities GeoJSON Layer Integration
 ********************************************************************/
require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/layers/GeoJSONLayer",
  "esri/widgets/Search",
  "esri/widgets/Expand",
  "esri/Graphic"
], function(Map, MapView, FeatureLayer, GeoJSONLayer, Search, Expand, Graphic) {

  const map = new Map({
    basemap: "topo-vector"
  });

  const view = new MapView({
    container: "viewDiv",
    map: map,
    center: [80.7718, 7.8731],
    zoom: 7
  });

  // Crop Loss Report FeatureLayer - Store globally for analytics
  cropLossReportsLayer = new FeatureLayer({
    url: "https://services5.arcgis.com/MpnsppwdopkoFFFQ/arcgis/rest/services/Report_Submit_3_view/FeatureServer/0",
    outFields: ["*"],
    popupTemplate: {
      title: "📍 Incident Details",
      content: function (feature) {
        const attr = feature.graphic.attributes;
        return `
          <b>Reporter Name:</b> ${attr.name_of_person_reporting || "N/A"}<br>
          <b>Contact:</b> ${attr.contact_number_or_email || "N/A"}<br><br>
          <b>📝 What Happened:</b> ${attr.what_happened || "N/A"}<br>
          <b>Recurring Issue:</b> ${attr.is_this_a_recurring_issue || "N/A"}<br>
          <b>Frequency:</b> ${attr.if_yes_how_frequently || "N/A"}<br><br>
          <b>🌍 District / DS Division:</b> ${attr.districtds_division || "N/A"}<br>
          <b>📌 Exact Location / GPS:</b> ${attr.gps_location || "N/A"}<br><br>
          <b>🌾 Area Affected:</b> ${attr.approximate_area_affected_in_ac || "N/A"}<br>
          <b>🧺 Crops Affected:</b> ${attr.what_crops_were_affected || ""} ${attr.what_crops_were_affected_other || ""}<br>
          <b>⚠️ Cause of Damage:</b> ${attr.what_was_the_cause_of_damage || ""} ${attr.what_was_the_cause_of_damage_other || ""}<br>
          <b>🐛 Disease or Pest Type:</b> ${attr.if_it_was_a_disease_or_pest_wha || "N/A"}<br>
          <b>🏢 Reported to Authorities:</b> ${attr.has_this_incident_already_been || "N/A"}<br><br>
          <b>🛠️ Actions Taken:</b> ${attr.have_you_already_used_any_solut || "N/A"}<br>
          <b>✅ Did It Help?:</b> ${attr.if_yes_what_was_it_and_did_it_h || "N/A"}<br>
          <b>🤝 Support Needed:</b> ${attr.what_kind_of_support_would_help || ""} ${attr.what_kind_of_support_would_help_other || ""}<br>
        `;
      }
    }
  });

  // 1. Clone filtered layers by crop types
  function createCropLayer(cropName, color, keywordArray) {
    return new FeatureLayer({
      url: cropLossReportsLayer.url,
      outFields: ["*"],
      title: cropName + " Incidents",
      visible: false,
      definitionExpression: keywordArray.map(word => `LOWER(what_crops_were_affected) LIKE '%${word.toLowerCase()}%'`).join(" OR "),
      renderer: {
        type: "simple",
        symbol: {
          type: "simple-marker",
          style: "circle",
          color: color,
          size: 8,
          outline: { color: "white", width: 1 }
        }
      },
      popupTemplate: cropLossReportsLayer.popupTemplate
    });
  }

  const paddyLayer = createCropLayer("Paddy", "#FFD54F", ["paddy", "rice"]);
  const maizeLayer = createCropLayer("Maize", "#FF8A65", ["maize", "corn"]);
  const vegetableLayer = createCropLayer("Vegetables", "#81C784", ["vegetable", "onion", "carrot", "tomato"]);
  const fruitLayer = createCropLayer("Fruits", "#BA68C8", ["fruit", "mango", "banana", "coconut"]);
  const otherLayer = createCropLayer("Other", "#90A4AE", [""]);

  map.addMany([paddyLayer, maizeLayer, vegetableLayer, fruitLayer, otherLayer]);

  // 2. Add event listeners for checkbox toggling
  document.getElementById('togglePaddy').addEventListener('change', e => paddyLayer.visible = e.target.checked);
  document.getElementById('toggleMaize').addEventListener('change', e => maizeLayer.visible = e.target.checked);
  document.getElementById('toggleVegetables').addEventListener('change', e => vegetableLayer.visible = e.target.checked);
  document.getElementById('toggleFruits').addEventListener('change', e => fruitLayer.visible = e.target.checked);
  document.getElementById('toggleOther').addEventListener('change', e => otherLayer.visible = e.target.checked);
  document.getElementById('toggleAllIncidents').addEventListener('change', e => cropLossReportsLayer.visible = e.target.checked);
  document.getElementById('toggleStorage').addEventListener('change', e => storageFacilitiesLayer.visible = e.target.checked);

  map.add(cropLossReportsLayer);

  // Storage Facilities GeoJSONLayer
  const storageFacilitiesUrl = "https://raw.githubusercontent.com/raviban02/Storage/main/Storages.geojson";

  storageFacilitiesLayer = new GeoJSONLayer({
    url: storageFacilitiesUrl,
    title: "Storage Facilities",
    outFields: ["*"],

    // Customize how points look (simple marker)
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-marker",
        style: "circle",
        color: "#00796B",
        size: 10,
        outline: { color: "white", width: 1 }
      }
    },

    popupTemplate: {
      title: "{name}",
      content: `
        <b>Location:</b> {Location} <br>
        <b>Type:</b> {Type} <br>
        <b>Capacity:</b> {Capacity} <br>
        <b>Status:</b> {Status} <br>
        <b>Manager:</b> {Manager} <br>
        <b>Contact:</b> {Contact} <br>
      `
    }
  });

  map.add(storageFacilitiesLayer);

  // Search widget that searches both report feature layer & storage facilities
  const searchWidget = new Search({
    view: view,
    locationEnabled: true,
    allPlaceholder: "Search reports, places, storages...",
    includeDefaultSources: false,
    sources: [
      {
        layer: cropLossReportsLayer,
        searchFields: ["districtds_division", "what_crops_were_affected"],
        displayField: "districtds_division",
        exactMatch: false,
        outFields: ["*"],
        name: "Reports",
        placeholder: "Search by District or Crop"
      },
      {
        layer: storageFacilitiesLayer,
        searchFields: ["name", "Location", "Type", "Manager"],
        displayField: "name",
        exactMatch: false,
        outFields: ["*"],
        name: "Storage Facilities",
        placeholder: "Search storage by name, location, type, manager"
      }
    ]
  });

  view.ui.add(new Expand({ view: view, content: searchWidget }), "top-right");

  // 🟩 BEGIN Find Nearest Storage Logic
  let findNearestMode = false;
  let highlightHandle = null;

  document.getElementById('btnFindNearestStorage').addEventListener('click', () => {
    findNearestMode = true;
    document.getElementById('nearestStoragePanel').style.display = 'block';
    document.getElementById('storageInstruction').innerText = 'Click on a crop loss incident to find the nearest working storage.';
    document.getElementById('nearestStorageDetails').innerHTML = '';
    document.getElementById('btnClearRoute').style.display = 'none';
    document.getElementById('btnExitNearestMode').style.display = 'block';
    
    // Clear any existing graphics
    view.graphics.removeAll();
  });

  // Exit Nearest Mode Button Event
  document.getElementById('btnExitNearestMode').addEventListener('click', () => {
    findNearestMode = false;
    document.getElementById('nearestStoragePanel').style.display = 'none';
    view.graphics.removeAll();
    if (highlightHandle) {
      highlightHandle.remove();
      highlightHandle = null;
    }
  });

  // Clear Route Button Event
  document.getElementById('btnClearRoute').addEventListener('click', () => {
    view.graphics.removeAll();
    document.getElementById('nearestStorageDetails').innerHTML = '';
    document.getElementById('btnClearRoute').style.display = 'none';
    document.getElementById('storageInstruction').innerText = 'Click on a crop loss incident to find the nearest working storage.';
  });

  view.on("click", async function(event) {
    if (!findNearestMode) return;

    if (highlightHandle) {
      highlightHandle.remove();
      highlightHandle = null;
    }

    try {
      const response = await view.hitTest(event);
      const incidentGraphic = response.results.find(result => {
        return result.graphic?.layer?.url === cropLossReportsLayer.url ||
               result.graphic?.layer === paddyLayer ||
               result.graphic?.layer === maizeLayer ||
               result.graphic?.layer === vegetableLayer ||
               result.graphic?.layer === fruitLayer ||
               result.graphic?.layer === otherLayer;
      });

      if (!incidentGraphic) {
        document.getElementById('storageInstruction').innerText = 'Please click on a crop loss report location.';
        return;
      }

      const incidentPoint = incidentGraphic.graphic.geometry;
      console.log("Incident Point:", incidentPoint);

      // Query working storage facilities
      const query = storageFacilitiesLayer.createQuery();
      query.where = "Status = 'Working'";
      query.returnGeometry = true;
      query.outFields = ["*"];

      const result = await storageFacilitiesLayer.queryFeatures(query);
      console.log("Storage facilities found:", result.features.length);

      if (!result.features.length) {
        document.getElementById('storageInstruction').innerText = 'No working storage facilities found.';
        return;
      }

      // Find nearest storage (we still need to calculate distance to find the nearest, but won't display it)
      let nearest = null;
      let minDistance = Infinity;

      const geometryEngine = await new Promise((resolve) => {
        require(["esri/geometry/geometryEngine"], resolve);
      });

      result.features.forEach(storage => {
        const distanceKm = geometryEngine.distance(incidentPoint, storage.geometry, "kilometers");
        const distanceMeters = distanceKm * 1000;
        
        if (distanceMeters < minDistance) {
          minDistance = distanceMeters;
          nearest = storage;
        }
      });

      if (nearest) {
        console.log("Nearest storage found:", nearest.attributes.name);
        
        // Display storage details without distance
        const detailsHTML = `
          <p><b>Nearest Storage:</b> ${nearest.attributes.name}</p>
          <p><b>Location:</b> ${nearest.attributes.Location}</p>
          <p><b>Type:</b> ${nearest.attributes.Type}</p>
          <p><b>Capacity:</b> ${nearest.attributes.Capacity}</p>
          <p><b>Status:</b> ${nearest.attributes.Status}</p>
          <p><b>Manager:</b> ${nearest.attributes.Manager}</p>
          <p><b>Contact:</b> ${nearest.attributes.Contact}</p>
        `;
        document.getElementById('nearestStorageDetails').innerHTML = detailsHTML;
        document.getElementById('btnClearRoute').style.display = 'block';
        document.getElementById('storageInstruction').innerText = 'Storage facility found! Details shown below.';

        // Clear old graphics
        view.graphics.removeAll();

        // Enhanced incident marker
        const incidentMarker = new Graphic({
          geometry: incidentPoint,
          symbol: {
            type: "simple-marker",
            color: [255, 0, 0, 0.8],
            size: 20,
            outline: { 
              color: [255, 255, 255, 1], 
              width: 3 
            },
            style: "circle"
          }
        });

        // Enhanced storage marker
        const storageMarker = new Graphic({
          geometry: nearest.geometry,
          symbol: {
            type: "simple-marker",
            color: [0, 150, 0, 0.9],
            size: 20,
            outline: { 
              color: [255, 255, 255, 1], 
              width: 3 
            },
            style: "diamond"
          }
        });

        // Text labels
        const incidentLabel = new Graphic({
          geometry: incidentPoint,
          symbol: {
            type: "text",
            text: "📍 Selected Incident",
            color: [255, 0, 0, 1],
            font: {
              size: 14,
              weight: "bold",
              family: "Arial"
            },
            yoffset: -30,
            backgroundColor: [255, 255, 255, 0.8],
            borderLineColor: [0, 0, 0, 0.5],
            borderLineSize: 1
          }
        });

        const storageLabel = new Graphic({
          geometry: nearest.geometry,
          symbol: {
            type: "text",
            text: "🏬 Nearest Storage",
            color: [0, 120, 0, 1],
            font: {
              size: 14,
              weight: "bold",
              family: "Arial"
            },
            yoffset: -30,
            backgroundColor: [255, 255, 255, 0.8],
            borderLineColor: [0, 0, 0, 0.5],
            borderLineSize: 1
          }
        });

        // Add graphics to the view
        view.graphics.addMany([
          incidentMarker,
          storageMarker,
          incidentLabel,
          storageLabel
        ]);

        console.log("Graphics added to map");

        // Zoom to show both points with proper extent
        const extent = {
          xmin: Math.min(incidentPoint.longitude, nearest.geometry.longitude) - 0.05,
          ymin: Math.min(incidentPoint.latitude, nearest.geometry.latitude) - 0.05,
          xmax: Math.max(incidentPoint.longitude, nearest.geometry.longitude) + 0.05,
          ymax: Math.max(incidentPoint.latitude, nearest.geometry.latitude) + 0.05,
          spatialReference: view.spatialReference
        };

        view.goTo(extent, {
          duration: 2000,
          easing: "ease-in-out"
        });
      }
    } catch (error) {
      console.error("Error in nearest storage logic:", error);
      document.getElementById('storageInstruction').innerText = 'Error finding nearest storage. Please try again.';
    }
  });
  // 🟩 END Find Nearest Storage Logic

});

// Start in home mode
showHomePanel();