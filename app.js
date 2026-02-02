// Online Classroom App
let studyData = null;
let currentWeek = parseInt(localStorage.getItem('currentWeek') || '0');
let completedWeeks = JSON.parse(localStorage.getItem('completedWeeks') || '[]');
let userNotes = JSON.parse(localStorage.getItem('userNotes') || '{}');
let preparationChecked = JSON.parse(localStorage.getItem('preparationChecked') || '{}');
let questionAnswers = JSON.parse(localStorage.getItem('questionAnswers') || '{}');

// Helper function to determine if image is local or web URL
function getImagePath(imagePath) {
    if (!imagePath) return '';
    
    // If it's already a full URL (starts with http/https), return as-is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    
    // If it's a local path, prepend the resources/images/ directory
    return `./resources/images/${imagePath}`;
}

document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('./resources/study.json');
        studyData = await response.json();
        
        // Find first incomplete week
        currentWeek = 0;
        for (let i = 0; i < studyData.weeks.length; i++) {
            if (!completedWeeks.includes(i)) {
                currentWeek = i;
                break;
            }
        }
        
        // Initialize classroom
        initializeClassroom();
        loadWeek(currentWeek);
        
    } catch (error) {
        document.getElementById('content').innerHTML = '<div class="error">Error loading study content.</div>';
        console.error('Error loading study data:', error);
    }
});

function initializeClassroom() {
    // Create week navigation
    const weekNav = document.getElementById('weekNav');
    weekNav.innerHTML = '';
    
    // Add study materials section
    const materialsItem = document.createElement('div');
    materialsItem.className = 'week-item materials-item';
    materialsItem.textContent = 'Study Materials';
    materialsItem.addEventListener('click', () => loadStudyMaterials());
    weekNav.appendChild(materialsItem);
    
    // Add separator
    const separator = document.createElement('div');
    separator.className = 'nav-separator';
    separator.textContent = 'Weekly Lessons';
    weekNav.appendChild(separator);
    
    studyData.weeks.forEach((week, index) => {
        const weekItem = document.createElement('div');
        weekItem.className = 'week-item week-lesson';
        weekItem.textContent = `Week ${week.number}: ${week.title}`;
        
        if (completedWeeks.includes(index)) {
            weekItem.classList.add('completed');
        }
        
        weekItem.addEventListener('click', () => loadWeek(index));
        weekNav.appendChild(weekItem);
    });
    
    // Update progress
    updateProgress();
    
    // Setup navigation buttons
    document.getElementById('prevWeek').addEventListener('click', () => {
        if (currentWeek > 0) loadWeek(currentWeek - 1);
    });
    
    document.getElementById('nextWeek').addEventListener('click', () => {
        if (currentWeek < studyData.weeks.length - 1) loadWeek(currentWeek + 1);
    });
    
    // Setup action buttons
    document.getElementById('markComplete').addEventListener('click', markWeekComplete);
    document.getElementById('takeNotes').addEventListener('click', openNotesModal);
    document.getElementById('printLesson').addEventListener('click', printCurrentLesson);
    
    // Setup notes modal
    setupNotesModal();
    
    // Setup mobile toggle
    setupMobileToggle();
}

function setupMobileToggle() {
    const mobileToggle = document.getElementById('mobileToggle');
    const sidebarContent = document.getElementById('sidebarContent');
    
    // Start with sidebar collapsed
    sidebarContent.classList.add('collapsed');
    const icon = mobileToggle.querySelector('.toggle-icon');
    const text = mobileToggle.querySelector('.toggle-text');
    icon.textContent = '☰';
    text.textContent = 'Lessons';
    mobileToggle.style.background = '#3498db';
    
    mobileToggle.addEventListener('click', () => {
        sidebarContent.classList.toggle('collapsed');
        
        if (sidebarContent.classList.contains('collapsed')) {
            icon.textContent = '☰';
            text.textContent = 'Lessons';
            mobileToggle.style.background = '#3498db';
        } else {
            icon.textContent = '✕';
            text.textContent = 'Close';
            mobileToggle.style.background = '#3498db';
        }
    });
}

function printCurrentLesson() {
    const week = studyData.weeks[currentWeek];
    const printContent = generatePrintHTML(week);
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
}

function generatePrintHTML(week) {
    const userAnswersForWeek = questionAnswers[currentWeek] || {};
    const userNotesForWeek = userNotes[currentWeek] || '';
    
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Week ${week.number}: ${week.title}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
                h1 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
                h2 { color: #34495e; margin-top: 30px; }
                h3 { color: #7f8c8d; }
                .summary { background: #f8f9fa; padding: 20px; border-left: 4px solid #3498db; margin: 20px 0; }
                .geopolitical { background: #fff; padding: 20px; border: 1px solid #ddd; margin: 20px 0; }
                .geopolitical h3 { margin-top: 0; color: #2c3e50; }
                .geopolitical ul { list-style: none; padding-left: 0; }
                .geopolitical li { padding: 5px 0; padding-left: 20px; position: relative; }
                .geopolitical li:before { content: "•"; position: absolute; left: 0; font-weight: bold; }
                .geo-period { font-weight: bold; color: #555; margin-bottom: 10px; }
                .geo-babylon { color: #8b4513; }
                .geo-babylon:before { color: #8b4513 !important; }
                .geo-persia { color: #4169e1; }
                .geo-persia:before { color: #4169e1 !important; }
                .geo-judah { color: #228b22; }
                .geo-judah:before { color: #228b22 !important; }
                .geo-players { color: #666; }
                .geo-players:before { color: #666 !important; }
                .preparation-item { margin: 15px 0; }
                .prep-checkbox { width: 15px; height: 15px; margin-right: 10px; }
                .questions-section { margin-top: 30px; }
                .question { margin: 25px 0; page-break-inside: avoid; }
                .question-number { font-weight: bold; color: #2c3e50; margin-bottom: 10px; }
                .answer-lines {
                    position: relative;
                    min-height: 120px;
                    margin: 10px 0;
                }
                .answer-line {
                    border-bottom: 1px solid #ddd;
                    height: 30px;
                    margin-bottom: 5px;
                    position: relative;
                }
                .user-answer-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    padding: 5px 0;
                    font-size: 14px;
                    line-height: 25px;
                    color: #333;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                }
                .notes-section {
                    margin-top: 40px;
                    padding: 20px;
                    background: #fff3cd;
                    border-left: 4px solid #ffc107;
                    border-radius: 4px;
                }
                .notes-lines {
                    position: relative;
                    min-height: 200px;
                    margin-top: 10px;
                }
                .notes-line {
                    border-bottom: 1px solid #ddd;
                    height: 30px;
                    margin-bottom: 5px;
                    position: relative;
                }
                .notes-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    padding: 5px 0;
                    font-size: 14px;
                    line-height: 25px;
                    color: #333;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                }
                .page-break { page-break-before: always; }
                @media print {
                    body { margin: 20px; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <h1>Week ${week.number}: ${week.title}</h1>
            
            <div class="summary">
                <h2>Summary</h2>
                <p>${week.summary}</p>
            </div>
            
            ${week.geopolitical ? `
            <div class="geopolitical">
                <h3>Historical Context</h3>
                <div class="geo-period">${week.geopolitical.period}</div>
                ${week.geopolitical.babylon && week.geopolitical.babylon.length > 0 ? `
                <strong>Babylon:</strong>
                <ul>
                    ${week.geopolitical.babylon.map(item => `<li class="geo-babylon">${item}</li>`).join('')}
                </ul>
                ` : ''}
                ${week.geopolitical.persia && week.geopolitical.persia.length > 0 ? `
                <strong>Persia:</strong>
                <ul>
                    ${week.geopolitical.persia.map(item => `<li class="geo-persia">${item}</li>`).join('')}
                </ul>
                ` : ''}
                ${week.geopolitical.judah && week.geopolitical.judah.length > 0 ? `
                <strong>Judah:</strong>
                <ul>
                    ${week.geopolitical.judah.map(item => `<li class="geo-judah">${item}</li>`).join('')}
                </ul>
                ` : ''}
                ${week.geopolitical.majorPlayers && week.geopolitical.majorPlayers.length > 0 ? `
                <strong>Major Players:</strong>
                <ul>
                    ${week.geopolitical.majorPlayers.map(item => `<li class="geo-players">${item}</li>`).join('')}
                </ul>
                ` : ''}
            </div>
            ` : ''}
            
            ${week.preparation && week.preparation.length > 0 ? `
                <div class="preparation-section">
                    <h2>Preparation Checklist</h2>
                    ${week.preparation.map(item => `
                        <div class="preparation-item">
                            <input type="checkbox" class="prep-checkbox"> ${item.text}
                            ${item.link ? `<br><small>Link: ${item.link}</small>` : ''}
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            ${week.optionalResources && week.optionalResources.length > 0 ? `
                <div class="optional-resources-section">
                    <h2>Optional Resources</h2>
                    <ul>
                        ${week.optionalResources.map(item => `
                            <li>${item.text}${item.link ? `<br><small>Link: ${item.link}</small>` : ''}</li>
                        `).join('')}
                    </ul>
                </div>
            ` : ''}
            
            <div class="page-break"></div>
            
            <div class="questions-section">
                <h2>Group Questions</h2>
                
                ${week.sourceQuestions && week.sourceQuestions.length > 0 ? `
                    <div class="source-questions">
                        <h3>Source Questions</h3>
                        ${week.sourceQuestions.map((question, index) => {
                            const userAnswer = userAnswersForWeek[`source-${index}`] || '';
                            return `
                                <div class="question">
                                    <div class="question-number">${index + 1}. ${question}</div>
                                    <div class="answer-lines">
                                        <div class="answer-line"></div>
                                        <div class="answer-line"></div>
                                        <div class="answer-line"></div>
                                        <div class="answer-line"></div>
                                        ${userAnswer.trim() ? `<div class="user-answer-overlay">${userAnswer}</div>` : ''}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                ` : ''}
                
                ${week.commentaryQuestions && week.commentaryQuestions.length > 0 ? `
                    <div class="commentary-questions">
                        <h3>Commentary Questions</h3>
                        ${week.commentaryQuestions.map((question, index) => {
                            const questionNum = (week.sourceQuestions ? week.sourceQuestions.length : 0) + index + 1;
                            const userAnswer = userAnswersForWeek[`commentary-${index}`] || '';
                            return `
                                <div class="question">
                                    <div class="question-number">${questionNum}. ${question}</div>
                                    <div class="answer-lines">
                                        <div class="answer-line"></div>
                                        <div class="answer-line"></div>
                                        <div class="answer-line"></div>
                                        <div class="answer-line"></div>
                                        ${userAnswer.trim() ? `<div class="user-answer-overlay">${userAnswer}</div>` : ''}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                ` : ''}
                
                <div class="other-observations">
                    <h3>Other Observations to Share</h3>
                    <div class="question">
                        <div class="answer-lines">
                            <div class="answer-line"></div>
                            <div class="answer-line"></div>
                            <div class="answer-line"></div>
                            <div class="answer-line"></div>
                            ${userAnswersForWeek['observations'] ? `<div class="user-answer-overlay">${userAnswersForWeek['observations']}</div>` : ''}
                        </div>
                    </div>
                </div>
            </div>
            
            ${userNotesForWeek ? `
                <div class="notes-section">
                    <h2>My Notes</h2>
                    <div class="notes-lines">
                        <div class="notes-line"></div>
                        <div class="notes-line"></div>
                        <div class="notes-line"></div>
                        <div class="notes-line"></div>
                        <div class="notes-line"></div>
                        <div class="notes-line"></div>
                        ${userNotesForWeek.trim() ? `<div class="notes-overlay">${userNotesForWeek}</div>` : ''}
                    </div>
                </div>
            ` : ''}
            
            <div style="margin-top: 50px; text-align: center; color: #7f8c8d; font-size: 0.9em;">
                Isaiah Study Guide - Week ${week.number} | Printed: ${new Date().toLocaleDateString()}
            </div>
        </body>
        </html>
    `;
}

function loadStudyMaterials() {
    // Update navigation
    document.querySelectorAll('.week-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector('.materials-item').classList.add('active');
    
    // Update header
    document.getElementById('currentWeekTitle').textContent = 'Study Materials';
    
    // Disable navigation buttons
    document.getElementById('prevWeek').disabled = true;
    document.getElementById('nextWeek').disabled = false;
    
    // Generate materials HTML
    const html = generateMaterialsHTML();
    document.getElementById('content').innerHTML = html;
    
    // Hide action buttons for materials page
    document.getElementById('markComplete').style.display = 'none';
    document.getElementById('takeNotes').style.display = 'none';
    document.getElementById('printLesson').style.display = 'none';
}

function generateMaterialsHTML() {
    return `
        <div class="materials-section">
            <h2>Required Study Materials</h2>
            <p>This 12-week study requires the following materials for the best learning experience:</p>
            
            <div class="materials-grid">
                ${studyData.studyMaterials.map(material => `
                    <div class="material-card ${material.required ? 'required' : 'optional'}">
                        <div class="material-image">
                            <img src="${getImagePath(material.image)}" alt="${material.title}" 
                                 onerror="this.src='https://via.placeholder.com/200x250/3498db/ffffff?text=${encodeURIComponent(material.title)}'">
                        </div>
                        <div class="material-info">
                            <h3 class="material-title">${material.title}</h3>
                            ${material.author ? `<div class="material-author">by ${material.author}</div>` : ''}
                            <div class="material-type">${material.type}</div>
                            <p class="material-description">${material.description}</p>
                            <div class="material-actions">
                                <a href="${material.link}" target="_blank" class="material-link">
                                    ${material.type === 'Online Resource' ? 'Visit Website' : 'View on Amazon'}
                                </a>
                                ${material.required ? '<span class="required-badge">Required</span>' : '<span class="optional-badge">Optional</span>'}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="materials-note">
                <h3>Study Approach</h3>
                <p>${studyData.courseSummary.studyApproach}</p>
            </div>
        </div>
    `;
}

function loadWeek(weekIndex) {
    currentWeek = weekIndex;
    const week = studyData.weeks[weekIndex];
    
    // Update navigation
    document.querySelectorAll('.week-lesson').forEach((item, index) => {
        item.classList.toggle('active', index === weekIndex);
    });
    
    // Update header
    document.getElementById('currentWeekTitle').textContent = `Week ${week.number}: ${week.title}`;
    
    // Update navigation buttons
    document.getElementById('prevWeek').disabled = weekIndex === 0;
    document.getElementById('nextWeek').disabled = weekIndex === studyData.weeks.length - 1;
    
    // Generate and display content
    const html = generateWeekHTML(week);
    document.getElementById('content').innerHTML = html;
    
    // Setup question answer handlers
    setupQuestionAnswers();
    
    // Show action buttons for week pages
    document.getElementById('markComplete').style.display = 'inline-block';
    document.getElementById('takeNotes').style.display = 'inline-block';
    document.getElementById('printLesson').style.display = 'inline-block';
    
    // Update mark complete button
    const markCompleteBtn = document.getElementById('markComplete');
    if (completedWeeks.includes(weekIndex)) {
        markCompleteBtn.textContent = 'Completed ✓';
        markCompleteBtn.style.background = '#27ae60';
    } else {
        markCompleteBtn.textContent = 'Mark as Complete';
        markCompleteBtn.style.background = '#3498db';
    }
}

function generateWeekHTML(week) {
    let html = `
        <div class="summary">
            <h2>Summary</h2>
            <p>${week.summary}</p>
        </div>
    `;
    
    // Add images section
    if (week.images && week.images.length > 0) {
        html += `
            <div class="images-section">
                <h2>Imagery for Discussion</h2>
                <div class="image-gallery">
                    ${week.images.map(image => `
                        <div class="gallery-item">
                            <div class="gallery-image">
                                <img src="${getImagePath(image.url)}" alt="${image.description}" 
                                     onerror="this.src='https://via.placeholder.com/400x300/3498db/ffffff?text=${encodeURIComponent(image.title)}'"
                                     onclick="openImageModal('${getImagePath(image.url)}', '${image.title}', '${image.description}')">
                            </div>
                            <div class="gallery-info">
                                <h4 class="gallery-title">${image.title}</h4>
                                <p class="gallery-description">${image.description}</p>
                                <div class="gallery-use"><strong>Use:</strong> ${image.use}</div>
                                <div class="gallery-source"><strong>Source:</strong> ${image.source}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // Add key points section
    if (week.keyPoints && week.keyPoints.length > 0) {
        html += `
            <div class="key-points">
                <h2>Key Points</h2>
                <ul class="key-points-list">
                    ${week.keyPoints.map(point => `<li>${point}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    // Add preparation section
    if (week.preparation && week.preparation.length > 0) {
        html += `
            <div class="preparation">
                <h2>Preparation</h2>
                <ul class="preparation-list">
                    ${week.preparation.map((item, index) => {
                        const checkboxId = `prep-${currentWeek}-${index}`;
                        const isChecked = preparationChecked[currentWeek] && preparationChecked[currentWeek][index];
                        return `<li class="preparation-item">
                            <input type="checkbox" id="${checkboxId}" class="prep-checkbox" 
                                   ${isChecked ? 'checked' : ''} 
                                   onchange="togglePreparation(${currentWeek}, ${index})">
                            <label for="${checkboxId}" class="prep-label ${isChecked ? 'completed' : ''}">
                                ${item.text}
                                ${item.link ? ` - <a href="${item.link}" target="_blank">${item.link}</a>` : ''}
                            </label>
                        </li>`;
                    }).join('')}
                </ul>
            </div>
        `;
    }
    
    // Add optional resources section
    if (week.optionalResources && week.optionalResources.length > 0) {
        html += `
            <div class="optional-resources">
                <h2>Optional Resources</h2>
                <ul>
                    ${week.optionalResources.map(item => 
                        `<li>${item.text} - <a href="${item.link}" target="_blank">${item.link}</a></li>`
                    ).join('')}
                </ul>
            </div>
        `;
    }
    
    // Add questions section
    let hasQuestions = false;
    let html_questions = '';
    
    if (week.sourceQuestions && week.sourceQuestions.length > 0) {
        hasQuestions = true;
        html_questions += `
            <div class="source-questions-section">
                <h3>Source Questions</h3>
                <ol>
                    ${week.sourceQuestions.map((question, index) => {
                        const answerId = `answer-${currentWeek}-source-${index}`;
                        const savedAnswer = questionAnswers[currentWeek] && questionAnswers[currentWeek][`source-${index}`] ? questionAnswers[currentWeek][`source-${index}`] : '';
                        return `
                            <li class="question-item">
                                <div class="question-text">${question}</div>
                                <div class="answer-container">
                                    <textarea id="${answerId}" class="answer-input" placeholder="Enter your answer here...">${savedAnswer}</textarea>
                                    <span id="saved-${answerId}" class="save-indicator" style="opacity: ${savedAnswer ? '1' : '0.3'}">✓</span>
                                </div>
                            </li>
                        `;
                    }).join('')}
                </ol>
            </div>
        `;
    }
    
    if (week.commentaryQuestions && week.commentaryQuestions.length > 0) {
        hasQuestions = true;
        const startNum = week.sourceQuestions ? week.sourceQuestions.length : 0;
        html_questions += `
            <div class="commentary-questions-section">
                <h3>Commentary Questions</h3>
                <ol start="${startNum + 1}">
                    ${week.commentaryQuestions.map((question, index) => {
                        const answerId = `answer-${currentWeek}-commentary-${index}`;
                        const savedAnswer = questionAnswers[currentWeek] && questionAnswers[currentWeek][`commentary-${index}`] ? questionAnswers[currentWeek][`commentary-${index}`] : '';
                        return `
                            <li class="question-item">
                                <div class="question-text">${question}</div>
                                <div class="answer-container">
                                    <textarea id="${answerId}" class="answer-input" placeholder="Enter your answer here...">${savedAnswer}</textarea>
                                    <span id="saved-${answerId}" class="save-indicator" style="opacity: ${savedAnswer ? '1' : '0.3'}">✓</span>
                                </div>
                            </li>
                        `;
                    }).join('')}
                </ol>
            </div>
        `;
    }
    
    // Add other observations section
    const observationsAnswerId = `answer-${currentWeek}-observations`;
    const savedObservations = questionAnswers[currentWeek] && questionAnswers[currentWeek]['observations'] ? questionAnswers[currentWeek]['observations'] : '';
    html_questions += `
        <div class="other-observations-section">
            <h3>Other Observations to Share</h3>
            <div class="answer-container">
                <textarea id="${observationsAnswerId}" class="answer-input" placeholder="Share any other observations, insights, or questions...">${savedObservations}</textarea>
                <span id="saved-${observationsAnswerId}" class="save-indicator" style="opacity: ${savedObservations ? '1' : '0.3'}">✓</span>
            </div>
        </div>
    `;
    
    if (hasQuestions || html_questions) {
        html += `
            <div class="group-questions">
                <h2>Group Questions</h2>
                ${html_questions}
            </div>
        `;
    }
    
    return html;
}

function togglePreparation(weekIndex, itemIndex) {
    if (!preparationChecked[weekIndex]) {
        preparationChecked[weekIndex] = {};
    }
    
    preparationChecked[weekIndex][itemIndex] = !preparationChecked[weekIndex][itemIndex];
    localStorage.setItem('preparationChecked', JSON.stringify(preparationChecked));
    
    // Update the label styling
    const checkbox = document.getElementById(`prep-${weekIndex}-${itemIndex}`);
    const label = document.querySelector(`label[for="prep-${weekIndex}-${itemIndex}"]`);
    
    if (checkbox.checked) {
        label.classList.add('completed');
    } else {
        label.classList.remove('completed');
    }
}

function markWeekComplete() {
    if (!completedWeeks.includes(currentWeek)) {
        completedWeeks.push(currentWeek);
        localStorage.setItem('completedWeeks', JSON.stringify(completedWeeks));
        
        // Update UI
        document.querySelectorAll('.week-lesson')[currentWeek].classList.add('completed');
        document.getElementById('markComplete').textContent = 'Completed ✓';
        document.getElementById('markComplete').style.background = '#27ae60';
        
        updateProgress();
    }
}

function updateProgress() {
    const progress = (completedWeeks.length / studyData.weeks.length) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
    document.getElementById('progressText').textContent = `${Math.round(progress)}% Complete`;
}

function openNotesModal() {
    const modal = document.getElementById('notesModal');
    const notesText = document.getElementById('notesText');
    
    notesText.value = userNotes[currentWeek] || '';
    modal.style.display = 'block';
}

function setupNotesModal() {
    const modal = document.getElementById('notesModal');
    const closeBtn = document.querySelector('.close');
    const saveBtn = document.getElementById('saveNotes');
    
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    saveBtn.addEventListener('click', () => {
        const notes = document.getElementById('notesText').value;
        userNotes[currentWeek] = notes;
        localStorage.setItem('userNotes', JSON.stringify(userNotes));
        modal.style.display = 'none';
    });
}

// Image Modal Functions
function openImageModal(imageUrl, title, description) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalInfo = document.getElementById('modalImageInfo');
    
    modalImage.src = imageUrl;
    modalImage.alt = title;
    modalInfo.innerHTML = `<h4>${title}</h4><p>${description}</p>`;
    modal.style.display = 'block';
}

function closeImageModal() {
    document.getElementById('imageModal').style.display = 'none';
}

// Setup image modal event listeners
document.addEventListener('DOMContentLoaded', function() {
    const imageModal = document.getElementById('imageModal');
    const imageClose = document.querySelector('.image-close');
    
    // Close on X button
    if (imageClose) {
        imageClose.addEventListener('click', closeImageModal);
    }
    
    // Close on background click
    if (imageModal) {
        imageModal.addEventListener('click', function(e) {
            if (e.target === imageModal) {
                closeImageModal();
            }
        });
    }
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && imageModal.style.display === 'block') {
            closeImageModal();
        }
    });
});

// Question Answer Functions
function saveQuestionAnswer(weekIndex, questionIndex, answer) {
    if (!questionAnswers[weekIndex]) {
        questionAnswers[weekIndex] = {};
    }
    questionAnswers[weekIndex][questionIndex] = answer;
    localStorage.setItem('questionAnswers', JSON.stringify(questionAnswers));
    
    // Show save indicator - bright when saved
    const indicator = document.getElementById(`saved-answer-${weekIndex}-${questionIndex}`);
    if (indicator) {
        indicator.style.opacity = '1'; // Dark/bright when saved
    }
}

// Add input event listener to show light color while typing
function setupQuestionAnswers() {
    document.querySelectorAll('.answer-input').forEach(textarea => {
        let saveTimeout;
        textarea.addEventListener('input', function() {
            const indicator = this.parentElement.querySelector('.save-indicator');
            if (indicator) {
                indicator.style.opacity = '0.3'; // Light while typing
            }
            
            // Clear existing timeout
            clearTimeout(saveTimeout);
            
            // Set new timeout to save after user stops typing
            saveTimeout = setTimeout(() => {
                const parts = this.id.split('-');
                const weekIndex = parseInt(parts[1]);
                
                // Handle different question types
                let questionKey;
                if (parts[2] === 'source') {
                    questionKey = `source-${parts[3]}`;
                } else if (parts[2] === 'commentary') {
                    questionKey = `commentary-${parts[3]}`;
                } else if (parts[2] === 'observations') {
                    questionKey = 'observations';
                } else {
                    // Legacy format
                    questionKey = parseInt(parts[2]);
                }
                
                saveQuestionAnswer(weekIndex, questionKey, this.value);
            }, 500);
        });
    });
}
