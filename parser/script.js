// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

// DOM elements
const uploadArea = document.querySelector('.upload-area');
const fileInput = document.getElementById('fileInput');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const results = document.getElementById('results');
const successMessage = document.getElementById('successMessage');

// Event listeners for drag and drop functionality
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'application/pdf') {
        handleFile(files[0]);
    } else {
        showError('Please upload a valid PDF file.');
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFile(e.target.files[0]);
    }
});

/**
 * Handle uploaded file
 * @param {File} file - The uploaded PDF file
 */
async function handleFile(file) {
    if (file.type !== 'application/pdf') {
        showError('Please upload a PDF file only.');
        return;
    }
    
    hideMessages();
    showLoading();
    
    try {
        const text = await extractTextFromPDF(file);
        const skills = parseSkills(text);
        displayResults(skills);
    } catch (err) {
        showError('Error reading PDF file. Please try again with a different file.');
        console.error(err);
    }
}

/**
 * Extract text from PDF file
 * @param {File} file - The PDF file to extract text from
 * @returns {Promise<string>} - Promise that resolves to extracted text
 */
async function extractTextFromPDF(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async function(e) {
            try {
                const typedArray = new Uint8Array(e.target.result);
                
                // Load the PDF document
                const loadingTask = pdfjsLib.getDocument(typedArray);
                const pdf = await loadingTask.promise;
                
                let fullText = '';
                
                // Extract text from each page
                for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                    const page = await pdf.getPage(pageNum);
                    const textContent = await page.getTextContent();
                    
                    // Combine text items with proper spacing
                    let pageText = '';
                    let lastY = null;
                    
                    textContent.items.forEach(item => {
                        if (lastY !== null && Math.abs(lastY - item.transform[5]) > 10) {
                            pageText += '\n';
                        }
                        pageText += item.str + ' ';
                        lastY = item.transform[5];
                    });
                    
                    fullText += pageText + '\n';
                }
                
                console.log('Extracted text:', fullText.substring(0, 500)); // Debug log
                resolve(fullText);
            } catch (error) {
                console.error('PDF extraction error:', error);
                reject(error);
            }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsArrayBuffer(file);
    });
}

/**
 * Parse skills from extracted text
 * @param {string} text - The text to parse skills from
 * @returns {Object} - Object containing parsed skills sections
 */
function parseSkills(text) {
    console.log('Parsing text length:', text.length); // Debug log
    
    if (!text || text.length < 50) {
        return { sections: {}, found: false };
    }
    
    const skillsSections = {};
    const lines = text.split(/[\n\r]+/).filter(line => line.trim().length > 0);
    
    // Common skill section headers (more flexible matching)
    const skillHeaders = [
        'skills',
        'technical skills',
        'core competencies',
        'technical competencies',
        'programming skills',
        'software skills',
        'tools and technologies',
        'expertise',
        'proficiencies',
        'extracurricular skills',
        'soft skills',
        'languages',
        'programming languages',
        'frameworks',
        'technologies',
        'certifications',
        'key skills',
        'areas of expertise',
        'competencies'
    ];
    
    let currentSection = null;
    let foundSkillsSection = false;
    let skillsStarted = false;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const lowerLine = line.toLowerCase();
        
        console.log('Processing line:', line); // Debug log
        
        // Check if this line is a skills header
        const matchedHeader = skillHeaders.find(header => {
            // More flexible matching
            return lowerLine.includes(header) && 
                   (lowerLine === header || 
                    lowerLine.startsWith(header) || 
                    lowerLine.endsWith(header)) &&
                   line.length < 100;
        });
        
        if (matchedHeader) {
            currentSection = matchedHeader;
            foundSkillsSection = true;
            skillsStarted = true;
            skillsSections[currentSection] = [];
            console.log('Found skills section:', matchedHeader); // Debug log
            continue;
        }
        
        // If we're in a skills section, extract skills
        if (currentSection && line.length > 0) {
            // Stop if we hit another major section (but be more lenient)
            if (skillsStarted && isNewSection(lowerLine)) {
                console.log('Ending section at:', line); // Debug log
                currentSection = null;
                continue;
            }
            
            // Extract skills from the line
            const extractedSkills = extractSkillsFromLine(line);
            if (extractedSkills.length > 0) {
                skillsSections[currentSection] = skillsSections[currentSection].concat(extractedSkills);
                console.log('Extracted skills from line:', extractedSkills); // Debug log
            }
        }
    }
    
    // Clean up and filter skills
    Object.keys(skillsSections).forEach(section => {
        skillsSections[section] = skillsSections[section]
            .filter(skill => skill.length > 1 && skill.length < 50)
            .map(skill => skill.trim())
            .filter((skill, index, arr) => arr.indexOf(skill) === index); // Remove duplicates
    });
    
    console.log('Final skills sections:', skillsSections); // Debug log
    return { sections: skillsSections, found: foundSkillsSection };
}

/**
 * Extract skills from a single line of text
 * @param {string} line - The line to extract skills from
 * @returns {Array<string>} - Array of extracted skills
 */
function extractSkillsFromLine(line) {
    // Remove common bullet points and prefixes
    line = line.replace(/^[-•·*▪▫◦‣⁃]\s*/, '').trim();
    
    let skills = [];
    
    // First, try splitting by clear delimiters (comma, semicolon, pipe)
    if (line.includes(',') || line.includes(';') || line.includes('|')) {
        skills = line.split(/[,;|]/);
    }
    // Try splitting by bullet points or dashes between skills
    else if (line.match(/\s[-•·*▪▫◦‣⁃]\s/)) {
        skills = line.split(/\s+[-•·*▪▫◦‣⁃]\s+/);
    }
    // Try splitting by multiple spaces (3 or more spaces usually indicate separate items)
    else if (line.includes('   ')) {
        skills = line.split(/\s{3,}/);
    }
    // Try splitting by common skill separators with spaces
    else if (line.match(/\s+[-/]\s+/) || line.match(/\s+\|\s+/)) {
        skills = line.split(/\s+[-/|]\s+/);
    }
    // If line has parentheses with versions/details, handle specially
    else if (line.includes('(') && line.includes(')')) {
        // Keep skills with parentheses together (e.g., "React (v18)", "Python (3.9)")
        skills = line.split(/,\s*(?![^()]*\))/).filter(s => s.trim());
    }
    // Look for patterns like "Skill1 Skill2 Skill3" where skills are separated by single spaces
    // But be careful not to split compound skills like "Machine Learning"
    else {
        // If it looks like a list of single-word skills separated by spaces
        const words = line.split(/\s+/);
        if (words.length > 1 && words.length <= 8 && !hasCommonSkillPhrases(line)) {
            // Check if these look like separate skills (mostly single words or known abbreviations)
            const possibleSkills = words.filter(word => 
                word.length > 1 && 
                (isKnownSkill(word) || word.length <= 12)
            );
            
            if (possibleSkills.length === words.length) {
                skills = words;
            } else {
                skills = [line]; // Keep as single skill
            }
        } else {
            skills = [line]; // Keep the whole line as one skill
        }
    }
    
    return skills
        .map(skill => skill.trim().replace(/^[-•·*▪▫◦‣⁃]\s*/, ''))
        .filter(skill => skill && skill.length > 1 && !isCommonWord(skill) && !isJunkText(skill))
        .map(skill => cleanSkill(skill));
}

/**
 * Check if text contains common skill phrases
 * @param {string} text - Text to check
 * @returns {boolean} - True if contains common skill phrases
 */
function hasCommonSkillPhrases(text) {
    const commonPhrases = [
        'machine learning', 'data analysis', 'web development', 'project management',
        'artificial intelligence', 'cloud computing', 'data science', 'software development',
        'database management', 'version control', 'agile methodology', 'responsive design',
        'user experience', 'quality assurance', 'business intelligence', 'digital marketing'
    ];
    
    return commonPhrases.some(phrase => 
        text.toLowerCase().includes(phrase.toLowerCase())
    );
}

/**
 * Check if a word is a known skill/technology
 * @param {string} word - Word to check
 * @returns {boolean} - True if it's a known skill
 */
function isKnownSkill(word) {
    const knownSkills = [
        'html', 'css', 'javascript', 'python', 'java', 'react', 'nodejs', 'php', 'sql',
        'mongodb', 'mysql', 'postgresql', 'docker', 'kubernetes', 'aws', 'azure', 'gcp',
        'git', 'github', 'gitlab', 'jenkins', 'terraform', 'ansible', 'linux', 'ubuntu',
        'windows', 'macos', 'photoshop', 'illustrator', 'figma', 'sketch', 'bootstrap',
        'tailwind', 'vue', 'angular', 'django', 'flask', 'spring', 'laravel', 'express',
        'rest', 'graphql', 'api', 'json', 'xml', 'yaml', 'bash', 'powershell', 'c++',
        'go', 'rust', 'swift', 'kotlin', 'dart', 'flutter', 'reactnative', 'ionic'
    ];
    
    return knownSkills.includes(word.toLowerCase().replace(/[^a-z0-9]/g, ''));
}

/**
 * Clean and format skill text
 * @param {string} skill - Skill text to clean
 * @returns {string} - Cleaned skill text
 */
function cleanSkill(skill) {
    // Remove extra whitespace and common suffixes/prefixes
    skill = skill.trim();
    
    // Remove trailing dots, commas, semicolons
    skill = skill.replace(/[.,;]+$/, '');
    
    // Remove leading/trailing brackets if they don't seem to contain important info
    skill = skill.replace(/^\[|\]$/g, '').replace(/^\(|\)$/g, '');
    
    // Capitalize properly (first letter of each word)
    return skill.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
}

/**
 * Check if text is junk/irrelevant
 * @param {string} text - Text to check
 * @returns {boolean} - True if text is junk
 */
function isJunkText(text) {
    const junkPatterns = [
        /^\d+[\s\-\.]/, // starts with numbers like "1. " or "1-"
        /^(and|or|with|using|including|such|as|the|in|on|at|to|for|of|a|an)$/i,
        /^(experience|proficiency|knowledge|familiar|years?)$/i,
        /^\W+$/, // only punctuation/symbols
        /^.{0,2}$/, // too short (1-2 characters)
        /^.{50,}$/ // too long (50+ characters)
    ];
    
    return junkPatterns.some(pattern => pattern.test(text.trim()));
}

/**
 * Check if line indicates a new section
 * @param {string} line - Line to check
 * @returns {boolean} - True if it's a new section header
 */
function isNewSection(line) {
    const commonSections = [
        'experience', 'education', 'projects', 'work experience', 'employment history',
        'contact', 'summary', 'objective', 'career objective', 'professional summary',
        'awards', 'references', 'personal information', 'achievements', 'certifications',
        'volunteer', 'activities', 'interests', 'hobbies', 'publications', 'research'
    ];
    
    return commonSections.some(section => 
        line.toLowerCase().includes(section) && line.length < 50 &&
        (line.toLowerCase() === section || 
         line.toLowerCase().startsWith(section) || 
         line.toLowerCase().endsWith(section))
    );
}

/**
 * Check if word is a common word that should be filtered out
 * @param {string} word - Word to check
 * @returns {boolean} - True if it's a common word
 */
function isCommonWord(word) {
    const commonWords = [
        'and', 'or', 'with', 'using', 'including', 'such', 'as',
        'the', 'in', 'on', 'at', 'to', 'for', 'of', 'a', 'an',
        'experience', 'proficiency', 'knowledge', 'familiar', 'years',
        'level', 'basic', 'intermediate', 'advanced', 'expert'
    ];
    return commonWords.includes(word.toLowerCase());
}

/**
 * Display parsed skills results
 * @param {Object} skillsData - Parsed skills data
 */
function displayResults(skillsData) {
    hideMessages();
    
    if (!skillsData.found || Object.keys(skillsData.sections).length === 0) {
        showError('No skills section found in the resume. Please make sure your resume has a clearly labeled skills section (e.g., "Skills", "Technical Skills", "Core Competencies", etc.)');
        return;
    }
    
    successMessage.style.display = 'block';
    results.innerHTML = '';
    
    Object.entries(skillsData.sections).forEach(([sectionName, skills]) => {
        if (skills.length > 0) {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'skills-section';
            
            const title = document.createElement('h3');
            title.textContent = sectionName.charAt(0).toUpperCase() + sectionName.slice(1);
            
            const skillsList = document.createElement('div');
            skillsList.className = 'skills-list';
            
            skills.forEach(skill => {
                const skillTag = document.createElement('span');
                skillTag.className = 'skill-tag';
                skillTag.textContent = skill;
                skillsList.appendChild(skillTag);
            });
            
            sectionDiv.appendChild(title);
            sectionDiv.appendChild(skillsList);
            results.appendChild(sectionDiv);
        }
    });
    
    results.style.display = 'block';
}

/**
 * Show loading spinner
 */
function showLoading() {
    loading.style.display = 'block';
}

/**
 * Hide loading spinner
 */
function hideLoading() {
    loading.style.display = 'none';
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    hideLoading();
    error.textContent = message;
    error.style.display = 'block';
}

/**
 * Hide all messages (loading, error, success, results)
 */
function hideMessages() {
    hideLoading();
    error.style.display = 'none';
    results.style.display = 'none';
    successMessage.style.display = 'none';
}