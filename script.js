document.getElementById('analyzeBtn').addEventListener('click', runATSAnalysis);

function runATSAnalysis() {
    const resumeVal = document.getElementById('resumeText').value.trim();
    const jobVal = document.getElementById('jobText').value.trim();
    if (!resumeVal || !jobVal) return alert("Fill in both inputs!");

    document.getElementById('resultPlaceholder').className = 'd-none';
    document.getElementById('analysisContent').className = 'd-block';

    const resumeWords = getWordTokens(resumeVal);
    const jobWords = getWordTokens(jobVal);

    const stopWords = new Set(['this', 'that', 'with', 'from', 'have', 'your', 'will', 'require', 'experience']);
    const jobKeywords = [...new Set(jobWords.filter(w => w.length > 4 && !stopWords.has(w)))];
    const matched = jobKeywords.filter(kw => resumeVal.toLowerCase().includes(kw));
    const missing = jobKeywords.filter(kw => !resumeVal.toLowerCase().includes(kw));

    const keywordMatchPercent = jobKeywords.length > 0 ? (matched.length / jobKeywords.length) * 100 : 0;

    const hasEducation = /education|university|college|degree|bachelor|master/i.test(resumeVal);
    const hasSkills = /skills|technologies|expertise/i.test(resumeVal);
    const hasExperience = /experience|employment|work history/i.test(resumeVal);
    const hasContact = /email|phone|contact|linkedin/i.test(resumeVal);

    let checkScore = 0;
    if (hasEducation) checkScore += 10;
    if (hasSkills) checkScore += 10;
    if (hasExperience) checkScore += 10;
    if (hasContact) checkScore += 10;

    const finalScore = Math.min(Math.round((keywordMatchPercent * 0.6) + checkScore), 100);
    document.getElementById('circleProgress').style.strokeDasharray = `${finalScore}, 100`;
    document.getElementById('percentageText').innerText = `${finalScore}%`;

    const rating = document.getElementById('scoreRating');
    const summary = document.getElementById('scoreSummary');
    if (finalScore >= 75) {
        rating.innerText = "Excellent Match!"; rating.className = "fw-bold text-success mb-1";
        summary.innerText = "High relevance with target job profile.";
    } else if (finalScore >= 50) {
        rating.innerText = "Good Match"; rating.className = "fw-bold text-warning mb-1";
        summary.innerText = "Key keyword optimizations recommended.";
    } else {
        rating.innerText = "Low Match"; rating.className = "fw-bold text-danger mb-1";
        summary.innerText = "Missing structural sectors and keywords.";
    }

    document.getElementById('wordCountText').innerText = `${resumeWords.length} words`;
    const avgLen = resumeWords.reduce((sum, w) => sum + w.length, 0) / resumeWords.length;
    document.getElementById('readabilityText').innerText = avgLen > 5.5 ? "Professional" : "Conversational";

    document.getElementById('checklistItems').innerHTML = `
        <li class="mb-1"><i class="fa-solid ${hasExperience ? 'fa-check text-success' : 'fa-xmark text-danger'} me-2"></i>Work Experience Section</li>
        <li class="mb-1"><i class="fa-solid ${hasSkills ? 'fa-check text-success' : 'fa-xmark text-danger'} me-2"></i>Skills Inventory List</li>
        <li class="mb-1"><i class="fa-solid ${hasEducation ? 'fa-check text-success' : 'fa-xmark text-danger'} me-2"></i>Education Fields</li>
        <li class="mb-1"><i class="fa-solid ${hasContact ? 'fa-check text-success' : 'fa-xmark text-danger'} me-2"></i>Contact details</li>
    `;

    const gapContainer = document.getElementById('keywordGaps');
    gapContainer.innerHTML = '';
    if (missing.length === 0) {
        gapContainer.innerHTML = '<span class="badge bg-success py-2">No missing keywords!</span>';
    } else {
        missing.slice(0, 6).forEach(kw => {
            gapContainer.innerHTML += `<span class="badge bg-danger py-2 px-3 text-uppercase">${kw}</span>`;
        });
    }
}

function getWordTokens(text) {
    return text.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(w => w.length > 0);
}