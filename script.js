
(function () {
'use strict';

// 1. EMBEDDED DEFAULT DATASET (Exact coding test dataset format)
const DEFAULT_COUNTRIES = [
    { id: 1, name: "Afghanistan" },
    { id: 2, name: "Albania" },
    { id: 3, name: "Algeria" },
    { id: 4, name: "Argentina" },
    { id: 5, name: "Armenia" },
    { id: 6, name: "Australia" },
    { id: 7, name: "Austria" },
    { id: 8, name: "Azerbaijan" },
    { id: 9, name: "Bangladesh" },
    { id: 10, name: "Belarus" },
    { id: 11, name: "Belgium" },
    { id: 12, name: "Bolivia" },
    { id: 13, name: "Bosnia and Herzegovina" },
    { id: 14, name: "Botswana" },
    { id: 15, name: "Brazil" },
    { id: 16, name: "Bulgaria" },
    { id: 17, name: "Cambodia" },
    { id: 18, name: "Cameroon" },
    { id: 19, name: "Canada" },
    { id: 20, name: "Chad" },
    { id: 21, name: "Chile" },
    { id: 22, name: "China" },
    { id: 23, name: "Colombia" },
    { id: 24, name: "Costa Rica" },
    { id: 25, name: "Côte d'Ivoire" },
    { id: 26, name: "Croatia" },
    { id: 27, name: "Cuba" },
    { id: 28, name: "Czech Republic" },
    { id: 29, name: "Denmark" },
    { id: 30, name: "Dominican Republic" },
    { id: 31, name: "Ecuador" },
    { id: 32, name: "Egypt" },
    { id: 33, name: "El Salvador" },
    { id: 34, name: "Equatorial Guinea" },
    { id: 35, name: "Estonia" },
    { id: 36, name: "Ethiopia" },
    { id: 37, name: "Finland" },
    { id: 38, name: "France" },
    { id: 39, name: "Georgia" },
    { id: 40, name: "Germany" },
    { id: 41, name: "Ghana" },
    { id: 42, name: "Greece" },
    { id: 43, name: "Guatemala" },
    { id: 44, name: "Guinea" },
    { id: 45, name: "Guinea-Bissau" },
    { id: 46, name: "Haiti" },
    { id: 47, name: "Honduras" },
    { id: 48, name: "Hungary" },
    { id: 49, name: "Iceland" },
    { id: 50, name: "India" },
    { id: 51, name: "Indonesia" },
    { id: 52, name: "Iran" },
    { id: 53, name: "Iraq" },
    { id: 54, name: "Ireland" },
    { id: 55, name: "Italy" },
    { id: 56, name: "Jamaica" },
    { id: 57, name: "Japan" },
    { id: 58, name: "Jordan" },
    { id: 59, name: "Kazakhstan" },
    { id: 60, name: "Kenya" },
    { id: 61, name: "Kuwait" },
    { id: 62, name: "Latvia" },
    { id: 63, name: "Lebanon" },
    { id: 64, name: "Libya" },
    { id: 65, name: "Lithuania" },
    { id: 66, name: "Madagascar" },
    { id: 67, name: "Malaysia" },
    { id: 68, name: "Mali" },
    { id: 69, name: "Mexico" },
    { id: 70, name: "Morocco" },
    { id: 71, name: "Mozambique" },
    { id: 72, name: "Nepal" },
    { id: 73, name: "Netherlands" },
    { id: 74, name: "New Zealand" },
    { id: 75, name: "Nigeria" },
    { id: 76, name: "North Macedonia" },
    { id: 77, name: "Norway" },
    { id: 78, name: "Oman" },
    { id: 79, name: "Pakistan" },
    { id: 80, name: "Palestine" },
    { id: 81, name: "Panama" },
    { id: 82, name: "Papua New Guinea" },
    { id: 83, name: "Peru" },
    { id: 84, name: "Philippines" },
    { id: 85, name: "Poland" },
    { id: 86, name: "Portugal" },
    { id: 87, name: "Qatar" },
    { id: 88, name: "Romania" },
    { id: 89, name: "Saudi Arabia" },
    { id: 90, name: "Senegal" },
    { id: 91, name: "Serbia" },
    { id: 92, name: "Singapore" },
    { id: 93, name: "South Africa" },
    { id: 94, name: "South Sudan" },
    { id: 95, name: "Spain" },
    { id: 96, name: "Sudan" },
    { id: 97, name: "Sweden" },
    { id: 98, name: "Switzerland" },
    { id: 99, name: "São Tomé and Príncipe" },
    { id: 100, name: "Tunisia" },
    { id: 101, name: "Turkey" },
    { id: 102, name: "Uganda" },
    { id: 103, name: "Ukraine" },
    { id: 104, name: "United Arab Emirates" },
    { id: 105, name: "United Kingdom" },
    { id: 106, name: "United States" },
    { id: 107, name: "Uruguay" },
    { id: 108, name: "Venezuela" },
    { id: 109, name: "Vietnam" },
    { id: 110, name: "Zimbabwe" },
];

// Retrieve active dataset: seamless support for external countries / SEARCH_DATA or embedded fallback
const dataset = (typeof window !== 'undefined' && (window.countries || window.SEARCH_DATA || window.data)) || DEFAULT_COUNTRIES;

// 2. TEXT NORMALIZATION & SUBSTRING SEARCH UTILITIES
/**
 * Strip diacritics / accents using NFD normalization.
 */
function removeDiacritics(str) {
    if (!str) return '';
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Strip apostrophes, quotes, hyphens, and punctuation.
 */
function cleanPunctuation(str) {
    if (!str) return '';
    return str.replace(/['’`´"".,\/#!$%\^&\*;:{}=\-_~()]/g, '');
}

/**
 * Normalize a string completely for comparison.
 */
function normalizeForSearch(str) {
    return cleanPunctuation(removeDiacritics(str))
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Escape HTML special characters for safe innerHTML.
 */
function escapeHtml(str) {
    return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Maps normalized clean string positions back to original string character indices.
 * Enables exact substring highlighting even when accents or apostrophes are omitted.
 */
function buildCharMap(original) {
    let cleanStr = '';
    const indexMap = [];

    for (let i = 0; i < original.length; i++) {
    const char = original[i];
    const withoutPunct = cleanPunctuation(char);
    if (!withoutPunct) {
        // Punctuation is stripped in comparison but remains in original
        continue;
    }
    const normChar = removeDiacritics(withoutPunct).toLowerCase();
    for (let j = 0; j < normChar.length; j++) {
        cleanStr += normChar[j];
        indexMap.push(i);
    }
    }

    return { cleanStr, indexMap };
}

/**
 * Matches an item against the search query.
 * Accepts { id, name } object or raw string.
 */
function matchItem(rawItem, query) {
    const item = typeof rawItem === 'string' ? rawItem : rawItem.name;
    const id = typeof rawItem === 'object' ? rawItem.id : undefined;

    const normQuery = normalizeForSearch(query);
    if (!normQuery) {
    return {
        item,
        id,
        rawItem,
        matched: false,
        highlightedHtml: escapeHtml(item),
        score: 0,
        matchType: 'none',
    };
    }

    const { cleanStr, indexMap } = buildCharMap(item);
    const matchIndex = cleanStr.indexOf(normQuery);

    if (matchIndex === -1) {
    return {
        item,
        id,
        rawItem,
        matched: false,
        highlightedHtml: escapeHtml(item),
        score: -1,
        matchType: 'none',
    };
    }

    const originalStart = indexMap[matchIndex];
    const lastMatchedCleanIndex = matchIndex + normQuery.length - 1;
    const originalEnd = indexMap[lastMatchedCleanIndex] + 1;

    // Determine match type for visual badge
    let matchType = 'Mid-word';
    let score = 0;

    if (cleanStr === normQuery) {
    matchType = 'Exact match';
    score += 200;
    } else if (matchIndex === 0) {
    matchType = 'Starts with';
    score += 120;
    } else if (cleanStr[matchIndex - 1] === ' ') {
    matchType = 'Word boundary';
    score += 70;
    } else {
    matchType = 'Mid-word';
    score += 30;
    }

    // Positional ranking & tie-breakers
    score += Math.max(0, 40 - matchIndex);
    score += Math.max(0, 30 - item.length);

    const before = escapeHtml(item.slice(0, originalStart));
    const matchedText = escapeHtml(item.slice(originalStart, originalEnd));
    const after = escapeHtml(item.slice(originalEnd));
    const highlightedHtml = `${before}<mark class="gdg-highlight">${matchedText}</mark>${after}`;

    return {
    item,
    id,
    rawItem,
    matched: true,
    startIndex: originalStart,
    endIndex: originalEnd,
    highlightedHtml,
    score,
    matchType,
    };
}

/**
 * Search dataset and return sorted results.
 */
function search(query, limit = 10) {
    const normQuery = normalizeForSearch(query);
    if (!normQuery) return [];

    const results = [];
    for (let i = 0; i < dataset.length; i++) {
    const res = matchItem(dataset[i], query);
    if (res.matched) {
        results.push(res);
    }
    }

    results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.item.localeCompare(b.item);
    });

    return results.slice(0, limit);
}

/**
 * Debounce function with configurable delay (defaults to 200ms per requirements).
 */
function debounce(func, waitMs = 200) {
    let timeoutId = null;
    return function (...args) {
    if (timeoutId !== null) {
        clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
        func.apply(this, args);
    }, waitMs);
    };
}

// 3. DOM ELEMENTS & INTERACTION STATE
const searchInput = document.getElementById('search-input');
const searchContainer = document.getElementById('search-container');
const clearBtn = document.getElementById('clear-btn');
const dropdownContainer = document.getElementById('dropdown-container');
const resultsListbox = document.getElementById('results-listbox');
const resultsCountLabel = document.getElementById('results-count-label');
const resultsLatencyLabel = document.getElementById('results-latency-label');
const datasetCountText = document.getElementById('dataset-count-text');
const selectedCard = document.getElementById('selected-card');
const selectedCountryName = document.getElementById('selected-country-name');
const selectedDetailsText = document.getElementById('selected-details-text');
const closeSelectedBtn = document.getElementById('close-selected-btn');
const presetChips = document.querySelectorAll('.chip-btn');

let currentResults = [];
let activeIndex = -1; // -1 means none highlighted

// Initialize dataset badge count
if (datasetCountText) {
    datasetCountText.textContent = `${dataset.length} Countries Loaded`;
}

// 4. RENDERING FUNCTIONS
function renderResults(results, query, latencyMs) {
    currentResults = results;
    activeIndex = -1;
    resultsListbox.innerHTML = '';

    resultsLatencyLabel.textContent = `${latencyMs.toFixed(1)} ms`;
    resultsCountLabel.textContent = `${results.length} result${results.length === 1 ? '' : 's'}`;

    if (results.length === 0) {
    resultsListbox.innerHTML = `
        <li class="empty-state" role="presentation">
        <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>
        <div class="empty-title">No countries found</div>
        <div class="empty-desc">No matches for "${escapeHtml(query)}". Try another query or check spelling.</div>
        </li>
    `;
    } else {
    results.forEach((match, idx) => {
        const li = document.createElement('li');
        li.id = `option-${idx}`;
        li.className = 'result-item';
        li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', 'false');
        li.setAttribute('data-index', idx);

        li.innerHTML = `
        <div class="result-item-main">
            <div class="result-icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            </div>
            <span class="result-text">
            ${match.id !== undefined ? `<span class="result-id-badge">#${match.id}</span>` : ''}
            ${match.highlightedHtml}
            </span>
        </div>
        <span class="result-tag">${escapeHtml(match.matchType)}</span>
        `;

        li.addEventListener('click', () => {
        selectItem(match);
        });

        resultsListbox.appendChild(li);
    });
    }

    openDropdown();
}

function openDropdown() {
    dropdownContainer.classList.add('open');
    searchContainer.classList.add('has-results-open');
    searchInput.setAttribute('aria-expanded', 'true');
}

function closeDropdown() {
    dropdownContainer.classList.remove('open');
    searchContainer.classList.remove('has-results-open');
    searchInput.setAttribute('aria-expanded', 'false');
    searchInput.removeAttribute('aria-activedescendant');
    activeIndex = -1;
}

function updateActiveOption(newIndex) {
    const items = resultsListbox.querySelectorAll('.result-item');
    if (items.length === 0) return;

    // Remove active state from current item
    if (activeIndex >= 0 && activeIndex < items.length) {
    items[activeIndex].classList.remove('active');
    items[activeIndex].setAttribute('aria-selected', 'false');
    }

    activeIndex = newIndex;

    if (activeIndex >= 0 && activeIndex < items.length) {
    const activeItem = items[activeIndex];
    activeItem.classList.add('active');
    activeItem.setAttribute('aria-selected', 'true');
    searchInput.setAttribute('aria-activedescendant', activeItem.id);

    // Ensure item is scrolled into view smoothly
    activeItem.scrollIntoView({ block: 'nearest' });
    } else {
    searchInput.removeAttribute('aria-activedescendant');
    }
}

function selectItem(match) {
    if (!match) return;
    searchInput.value = match.item;
    clearBtn.classList.add('visible');
    closeDropdown();

    // Show confirmation card
    selectedCountryName.textContent = match.id !== undefined ? `#${match.id} - ${match.item}` : match.item;
    selectedDetailsText.innerHTML = `
    ${match.id !== undefined ? `<strong>Country ID:</strong> #${match.id} • ` : ''}
    <strong>Search query:</strong> "${escapeHtml(searchInput.value)}" • 
    <strong>Match category:</strong> ${escapeHtml(match.matchType)} • 
    <strong>Original length:</strong> ${match.item.length} characters
    `;
    selectedCard.classList.add('visible');
}

// 5. EVENT LISTENERS & INTERACTION LOGIC
// Debounced search handler
const performSearch = debounce((query) => {
    const trimmed = query.trim();
    if (!trimmed) {
    closeDropdown();
    return;
    }

    const t0 = performance.now();
    const results = search(trimmed, 12);
    const t1 = performance.now();
    const latencyMs = Math.max(0.1, t1 - t0);

    renderResults(results, trimmed, latencyMs);
}, 200);

// Input event
searchInput.addEventListener('input', (e) => {
    const val = e.target.value;
    if (val.length > 0) {
    clearBtn.classList.add('visible');
    performSearch(val);
    } else {
    clearBtn.classList.remove('visible');
    closeDropdown();
    }
});

// Focus & Blur
searchInput.addEventListener('focus', () => {
    searchContainer.classList.add('focused');
    if (searchInput.value.trim().length > 0 && currentResults.length > 0) {
    openDropdown();
    }
});

searchInput.addEventListener('blur', () => {
    searchContainer.classList.remove('focused');
});

// Global click outside to dismiss dropdown
document.addEventListener('click', (e) => {
    const searchWrapper = document.getElementById('search-wrapper');
    if (searchWrapper && !searchWrapper.contains(e.target)) {
    closeDropdown();
    }
});

// Clear button
clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.classList.remove('visible');
    closeDropdown();
    searchInput.focus();
});

// Keyboard Navigation (ArrowUp, ArrowDown, Enter, Escape, Slash '/')
searchInput.addEventListener('keydown', (e) => {
    const isDropdownOpen = dropdownContainer.classList.contains('open');
    const totalItems = currentResults.length;

    if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (!isDropdownOpen && searchInput.value.trim().length > 0) {
        performSearch(searchInput.value);
        return;
    }
    if (totalItems > 0) {
        const nextIndex = (activeIndex + 1) >= totalItems ? 0 : activeIndex + 1;
        updateActiveOption(nextIndex);
    }
    } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (isDropdownOpen && totalItems > 0) {
        const prevIndex = (activeIndex - 1) < 0 ? totalItems - 1 : activeIndex - 1;
        updateActiveOption(prevIndex);
    }
    } else if (e.key === 'Enter') {
    if (isDropdownOpen && activeIndex >= 0 && activeIndex < totalItems) {
        e.preventDefault();
        selectItem(currentResults[activeIndex]);
    } else if (isDropdownOpen && totalItems > 0) {
        // If none explicitly focused with arrow keys, select first item
        e.preventDefault();
        selectItem(currentResults[0]);
    }
    } else if (e.key === 'Escape') {
    if (isDropdownOpen) {
        e.preventDefault();
        closeDropdown();
    }
    }
});

// Global hotkey: '/' to focus search input
document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput) {
    e.preventDefault();
    searchInput.focus();
    searchInput.select();
    }
});

// Quick Preset Chips click
presetChips.forEach((chip) => {
    chip.addEventListener('click', () => {
    const query = chip.getAttribute('data-query');
    if (query) {
        searchInput.value = query;
        clearBtn.classList.add('visible');
        searchInput.focus();

        const t0 = performance.now();
        const results = search(query, 12);
        const t1 = performance.now();
        renderResults(results, query, Math.max(0.1, t1 - t0));
    }
    });
});

// Selected card dismiss button
if (closeSelectedBtn) {
    closeSelectedBtn.addEventListener('click', () => {
    selectedCard.classList.remove('visible');
    });
}

// Technical specs collapsible toggle
const specsToggle = document.getElementById('specs-toggle');
const specsContent = document.getElementById('specs-content-body');
const specsChevron = document.getElementById('specs-chevron');

if (specsToggle && specsContent) {
    const toggleSpecs = () => {
    const isCollapsed = specsContent.classList.toggle('collapsed');
    if (specsChevron) {
        specsChevron.classList.toggle('collapsed', isCollapsed);
    }
    specsToggle.setAttribute('aria-expanded', !isCollapsed);
    };
    specsToggle.addEventListener('click', toggleSpecs);
    specsToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleSpecs();
    }
    });
}
})();
