// Online Classroom App
let studyData = null;
let currentWeek = parseInt(localStorage.getItem('currentWeek') || '0');
let completedWeeks = JSON.parse(localStorage.getItem('completedWeeks') || '[]');
let userNotes = JSON.parse(localStorage.getItem('userNotes') || '{}');
let preparationChecked = JSON.parse(localStorage.getItem('preparationChecked') || '{}');

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
                .preparation-item { margin: 15px 0; }
                .prep-checkbox { width: 15px; height: 15px; margin-right: 10px; }
                .questions-section { margin-top: 30px; }
                .question { margin: 25px 0; page-break-inside: avoid; }
                .question-number { font-weight: bold; color: #2c3e50; }
                .answer-space { border-bottom: 1px solid #ddd; height: 60px; margin: 10px 0; }
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
                <p><em>Use the space below each question to write your answers:</em></p>
                
                ${week.questions && week.questions.length > 0 ? week.questions.map((question, index) => `
                    <div class="question">
                        <div class="question-number">${index + 1}. ${question}</div>
                        <div class="answer-space"></div>
                        <div class="answer-space"></div>
                        <div class="answer-space"></div>
                    </div>
                `).join('') : '<p>No questions available for this week.</p>'}
            </div>
            
            <div style="margin-top: 50px; text-align: center; color: #7f8c8d; font-size: 0.9em;">
                Isaiah Study Guide - Week ${week.number}
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
                            <img src="${material.image}" alt="${material.title}" 
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
                <p>This study follows J. Alec Motyer's commentary as the primary text, supplemented by video lectures from Dr. John Oswalt and insights from Michael Heiser. The Blue Letter Bible provides essential tools for word studies and cross-references throughout the study.</p>
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
                                <img src="${image.url}" alt="${image.description}" 
                                     onerror="this.src='https://via.placeholder.com/400x300/3498db/ffffff?text=${encodeURIComponent(image.title)}'">
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
    if (week.questions && week.questions.length > 0) {
        html += `
            <div class="group-questions">
                <h2>Group Questions</h2>
                <ol>
                    ${week.questions.map(question => `<li>${question}</li>`).join('')}
                </ol>
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
