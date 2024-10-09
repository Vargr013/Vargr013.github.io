document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    const mainContent = document.getElementById('main-content');
    const darkModeToggle = document.getElementById('dark-mode-checkbox');
    const sidebarExpand = document.getElementById('sidebarExpand');
    let referenceList = [];

// Sidebar toggle functionality
sidebar.addEventListener('click', function(e) {
    if (e.target.tagName === 'A') {
        e.preventDefault();
        const target = e.target.getAttribute('href').substring(1);
        updateContent(target);
        // Collapse sidebar after selection
        sidebar.classList.add('active');
        content.classList.add('active');
    }
});

// Expand button functionality
sidebarExpand.addEventListener('click', function() {
    sidebar.classList.toggle('active');
    content.classList.toggle('active');
});

// Dark mode toggle functionality
darkModeToggle.addEventListener('change', function() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', this.checked);
});

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    darkModeToggle.checked = true;
    document.body.classList.add('dark-mode');
}

function updateContent(target) {
    if (target === 'home') {
        showHomePage();
    } else if (target === 'reference-list') {
        showReferenceList();
    } else if (target === 'settings') {
        showSettingsPage();
    } else {
        showReferencingMethod(target);
    }
}

function showHomePage() {
    mainContent.innerHTML = `
        <div class="home-page">
            <h1>Welcome to the Referencing Guide</h1>
            <p>This website is designed to help you create accurate references and footnotes for various types of sources in your academic or professional work.</p>
            
            <h2>How to Use This Website</h2>
            <ol>
                <li>Select a referencing method from the sidebar on the left.</li>
                <li>Fill in the required information in the form that appears.</li>
                <li>Click the "Generate Reference" button.</li>
                <li>Your generated reference will appear below the form.</li>
                <li>Click "Add to Reference List" to save the reference.</li>
                <li>View and manage your references in the Reference List section.</li>
            </ol>

            <h2>Tips</h2>
            <ul>
                <li>Use the dark mode toggle in the top right corner to switch between light and dark themes.</li>
                <li>On mobile devices, use the menu icon in the top left corner to show or hide the sidebar.</li>
                <li>Always double-check your generated references against your institution's specific guidelines.</li>
            </ul>

            <p>If you have any questions or encounter any issues, please contact your institution's library or academic support team.</p>
        </div>
    `;
}

    function showReferencingMethod(method) {
        if (method === 'legislation') {
            showLegislationForm();
        } else {
            mainContent.innerHTML = `
                <h2>${method.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h2>
                <p>This section contains guidelines for referencing ${method.replace(/-/g, ' ')}.</p>
                <div class="form-container">
                    <div id="referencing-form"></div>
                    <div id="output-container">
                        <div id="referencing-output"></div>
                        <div id="footnote-output"></div>
                    </div>
                </div>
            `;
            generateForm(method);
        }
    }

    function showLegislationForm() {
        mainContent.innerHTML = `
            <h2>Legislation Reference</h2>
            <form id="legislation-form" class="legislation-form">
                <div class="form-group">
                    <label for="act-name">Full Legislation Name:</label>
                    <input type="text" id="act-name" required>
                </div>

                <div class="form-group">
                    <label>
                        <input type="checkbox" id="is-constitution">
                        Is this a Constitution reference?
                    </label>
                </div>

                <div class="form-group" id="interim-constitution-group" style="display: none;">
                    <label>
                        <input type="checkbox" id="is-interim-constitution">
                        Is this the Interim Constitution?
                    </label>
                </div>

                <div class="form-group">
                    <label for="act-type">Act Type:</label>
                    <select id="act-type" required>
                        <option value="south_african">South African</option>
                        <option value="international">International</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="act-number">Act Number:</label>
                    <input type="number" id="act-number">
                </div>

                <div class="form-group">
                    <label for="act-year">Year:</label>
                    <input type="number" id="act-year" required>
                </div>

                <div class="form-group">
                    <label for="act-section">Section (optional):</label>
                    <input type="text" id="act-section">
                </div>

                <div id="international-fields" style="display: none;">
                    <div class="form-group">
                        <label for="date-signed">Date Signed:</label>
                        <input type="date" id="date-signed">
                    </div>

                    <div class="form-group">
                        <label for="date-enforced">Date Entered into Force:</label>
                        <input type="date" id="date-enforced">
                    </div>

                    <div class="form-group">
                        <label for="serial-number">Serial Number/UNTS/Document Number:</label>
                        <input type="text" id="serial-number">
                    </div>
                </div>

                <div class="form-group">
                    <label for="abbreviation">Custom Abbreviation (optional):</label>
                    <input type="text" id="abbreviation">
                </div>

                <div class="form-group">
                    <label for="footnote-number">Footnote Number:</label>
                    <input type="number" id="footnote-number" min="1" value="1">
                </div>

                <button type="submit" class="generate-button">Generate Reference</button>
            </form>

            <div id="output-area" class="output-area" style="display: none;">
                <h3>Generated Reference</h3>
                <p id="body-text-output"></p>
                <p id="footnote-output"></p>
                <p id="reference-list-entry-output"></p>
                <button id="add-to-reference-list" class="add-reference-button">Add to Reference List</button>
            </div>
        `;

        const form = document.getElementById('legislation-form');
        const actType = document.getElementById('act-type');
        const internationalFields = document.getElementById('international-fields');
        const isConstitution = document.getElementById('is-constitution');
        const isInterimConstitution = document.getElementById('is-interim-constitution');
        const interimConstitutionGroup = document.getElementById('interim-constitution-group');
        const actNumber = document.getElementById('act-number');

        actType.addEventListener('change', function() {
            internationalFields.style.display = this.value === 'international' ? 'block' : 'none';
        });

        isConstitution.addEventListener('change', function() {
            interimConstitutionGroup.style.display = this.checked ? 'block' : 'none';
            actNumber.required = !this.checked;
        });

        isInterimConstitution.addEventListener('change', function() {
            actNumber.required = this.checked;
        });

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const referenceData = {
                act_name: document.getElementById('act-name').value.trim(),
                is_constitution: isConstitution.checked,
                is_interim_constitution: isInterimConstitution.checked,
                act_type: actType.value,
                act_number: actNumber.value.trim(),
                year: document.getElementById('act-year').value.trim(),
                section: document.getElementById('act-section').value.trim(),
                date_signed: document.getElementById('date-signed').value.trim(),
                date_entered_into_force: document.getElementById('date-enforced').value.trim(),
                serial_number: document.getElementById('serial-number').value.trim(),
                abbreviation: document.getElementById('abbreviation').value.trim(),
                footnote_number: document.getElementById('footnote-number').value.trim()
            };

            const result = processReference(referenceData);
            displayResult(result);
        });

        const addToReferenceListButton = document.getElementById('add-to-reference-list');
        addToReferenceListButton.addEventListener('click', function() {
            const referenceListEntry = document.getElementById('reference-list-entry-output').textContent.split(': ')[1];
            addToReferenceList(referenceListEntry);
            alert('Reference added to the list!');
        });
    }

    function processReference(referenceData) {
        const referenceType = determineReferenceType(referenceData);
        const bodyText = generateBodyTextReference(referenceType, referenceData, true);
        const footnote = generateFootnote(referenceType, referenceData);
        const referenceListEntry = compileReferenceListEntry(referenceType, referenceData);

        return {
            body_text: bodyText,
            footnote: footnote,
            reference_list_entry: referenceListEntry
        };
    }

    function determineReferenceType(referenceData) {
        if (referenceData.is_constitution) {
            return 'constitution';
        } else if (referenceData.act_type === 'south_african') {
            return 'south_african_act';
        } else if (referenceData.act_type === 'international') {
            return 'international_instrument';
        }
    }

    function generateAbbreviation(actName) {
        const words = actName.split(' ');
        let abbreviation = '';
        for (let word of words) {
            if (word.toLowerCase() !== 'act') {
                abbreviation += word[0].toUpperCase();
            }
        }
        return abbreviation + 'A';
    }

    function generateBodyTextReference(referenceType, referenceData, isFirstUse = false) {
        let bodyText = '';
        if (referenceType === 'constitution') {
            if (referenceData.is_interim_constitution) {
                bodyText = isFirstUse ? 
                    `The Constitution of the Republic of South Africa<sup>${referenceData.footnote_number}</sup> (the interim Constitution)` : 
                    `the interim Constitution`;
            } else {
                bodyText = isFirstUse ? 
                    `The Constitution of the Republic of South Africa, ${referenceData.year} (The Constitution)` : 
                    `The Constitution`;
            }
        } else if (referenceType === 'south_african_act') {
            if (isFirstUse) {
                const abbreviation = referenceData.abbreviation || generateAbbreviation(referenceData.act_name);
                bodyText = `${referenceData.act_name}, ${referenceData.year}<sup>${referenceData.footnote_number}</sup> (${abbreviation})`;
            } else {
                bodyText = referenceData.abbreviation || generateAbbreviation(referenceData.act_name);
            }
        } else if (referenceType === 'international_instrument') {
            bodyText = `${referenceData.act_name}<sup>${referenceData.footnote_number}</sup>`;
        }
        return bodyText;
    }

    function generateFootnote(referenceType, referenceData) {
        let footnote = '';
        if (referenceType === 'constitution') {
            if (referenceData.is_interim_constitution) {
                footnote = `${referenceData.act_number} of ${referenceData.year}`;
            } else {
                return null; // No footnote for the main Constitution
            }
        } else if (referenceType === 'south_african_act') {
            footnote = referenceData.section
                ? `S ${referenceData.section} of Act ${referenceData.act_number} of ${referenceData.year}`
                : `${referenceData.act_number} of ${referenceData.year}.`;
        } else if (referenceType === 'international_instrument') {
            footnote = `${referenceData.act_name} (adopted ${formatDate(referenceData.date_signed)}, entered into force ${formatDate(referenceData.date_entered_into_force)}) ${referenceData.serial_number}`;
        }
        return footnote ? `${referenceData.footnote_number}. ${footnote}` : null;
    }

    function compileReferenceListEntry(referenceType, referenceData) {
        let entry = '';
        if (referenceType === 'constitution') {
            entry = referenceData.is_interim_constitution
                ? `Constitution of the Republic of South Africa Act ${referenceData.act_number} of ${referenceData.year}`
                : `Constitution of the Republic of South Africa, ${referenceData.year}`;
        } else if (referenceType === 'south_african_act') {
            entry = `${referenceData.act_name} ${referenceData.act_number} of ${referenceData.year}`;
        } else if (referenceType === 'international_instrument') {
            entry = `${referenceData.act_name}` + 
                   (referenceData.date_signed ? ` (adopted ${formatDate(referenceData.date_signed)}` : '') + 
                   (referenceData.date_entered_into_force ? `, entered into force ${formatDate(referenceData.date_entered_into_force)})` : '') + 
                   (referenceData.serial_number ? ` ${referenceData.serial_number}` : '');
        }
        return entry + '.';
    }

    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    }

    function displayResult(result) {
        const outputArea = document.getElementById('output-area');
        const bodyTextOutput = document.getElementById('body-text-output');
        const footnoteOutput = document.getElementById('footnote-output');
        const referenceListEntryOutput = document.getElementById('reference-list-entry-output');

        bodyTextOutput.innerHTML = `<strong>Body Text:</strong> ${result.body_text}`;
        
        if (result.footnote) {
            footnoteOutput.innerHTML = `<strong>Footnote:</strong> ${result.footnote}`;
            footnoteOutput.style.display = 'block';
        } else {
            footnoteOutput.innerHTML = '';
            footnoteOutput.style.display = 'none';
        }

        referenceListEntryOutput.innerHTML = `<strong>Reference List Entry:</strong> ${result.reference_list_entry}`;

        outputArea.style.display = 'block';
    }

    function addToReferenceList(entry) {
        referenceList.push(entry);
    }

    function showReferenceList() {
        mainContent.innerHTML = `
            <h2>Reference List</h2>
            <div id="reference-list" class="reference-list">
                <table id="reference-table">
                    <thead>
                        <tr>
                            <th>Reference</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
            <button id="copy-reference-list" class="copy-button">Copy Reference List</button>
        `;

        updateReferenceTable();

        const copyButton = document.getElementById('copy-reference-list');
        copyButton.addEventListener('click', copyReferenceList);
    }

    function updateReferenceTable() {
        const tableBody = document.querySelector('#reference-table tbody');
        tableBody.innerHTML = '';

        referenceList.forEach((entry, index) => {
            const row = tableBody.insertRow();
            const cellReference = row.insertCell(0);
            const cellAction = row.insertCell(1);

            cellReference.textContent = entry;
            cellAction.innerHTML = `<button onclick="removeReference(${index})" class="remove-button">Remove</button>`;
        });
    }

    // Make removeReference function global so it can be called from inline event handlers
    window.removeReference = function(index) {
        referenceList.splice(index, 1);
        updateReferenceTable();
    };

    function copyReferenceList() {
        const referenceListText = referenceList.join('\n');
        navigator.clipboard.writeText(referenceListText).then(() => {
            alert('Reference list copied to clipboard!');
        }, (err) => {
            console.error('Could not copy text: ', err);
        });
    }

    function showSettingsPage() {
        mainContent.innerHTML = `
            <div class="settings-container">
                <h2>Settings</h2>
                <h3>Font Size</h3>
                <div class="font-size-slider">
                    <input type="range" min="12" max="24" value="16" class="slider" id="font-size-slider">
                    <div class="font-size-display">16px</div>
                </div>
            </div>
        `;

        const fontSizeSlider = document.getElementById('font-size-slider');
        const fontSizeDisplay = document.querySelector('.font-size-display');

        fontSizeSlider.addEventListener('input', function() {
            const fontSize = this.value + 'px';
            fontSizeDisplay.textContent = fontSize;
            document.documentElement.style.setProperty('--font-size', fontSize);
            localStorage.setItem('selectedFontSize', fontSize);
            applyFontSize(fontSize);
        });

        // Set the selected font size on page load
        const savedFontSize = localStorage.getItem('selectedFontSize');
        if (savedFontSize) {
            fontSizeSlider.value = parseInt(savedFontSize);
            fontSizeDisplay.textContent = savedFontSize;
            document.documentElement.style.setProperty('--font-size', savedFontSize);
            applyFontSize(savedFontSize);
        }
    }

    function applyFontSize(fontSize) {
        document.body.style.fontSize = fontSize;
        const allElements = document.getElementsByTagName('*');
        for (let i = 0; i < allElements.length; i++) {
            allElements[i].style.fontSize = fontSize;
        }
    }

    // Apply saved font size on initial load
    const savedFontSize = localStorage.getItem('selectedFontSize');
    if (savedFontSize) {
        document.documentElement.style.setProperty('--font-size', savedFontSize);
        applyFontSize(savedFontSize);
    }

    // Show homepage on initial load
    showHomePage();
});