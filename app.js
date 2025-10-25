// Online Classroom App
let studyData = null;
let currentWeek = 0;
let completedWeeks = JSON.parse(localStorage.getItem('completedWeeks') || '[]');
let userNotes = JSON.parse(localStorage.getItem('userNotes') || '{}');

document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('./resources/study.json');
        studyData = await response.json();
        
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
        weekItem.className = 'week-item';
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
    
    // Setup notes modal
    setupNotesModal();
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
    document.querySelectorAll('.week-item').forEach((item, index) => {
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
    
    // Add preparation section
    if (week.preparation && week.preparation.length > 0) {
        html += `
            <div class="preparation">
                <h2>Preparation</h2>
                <ul>
                    ${week.preparation.map(item => {
                        if (item.link) {
                            return `<li>${item.text} - <a href="${item.link}" target="_blank">${item.link}</a></li>`;
                        } else {
                            return `<li>${item.text}</li>`;
                        }
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

function markWeekComplete() {
    if (!completedWeeks.includes(currentWeek)) {
        completedWeeks.push(currentWeek);
        localStorage.setItem('completedWeeks', JSON.stringify(completedWeeks));
        
        // Update UI
        document.querySelectorAll('.week-item')[currentWeek].classList.add('completed');
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
