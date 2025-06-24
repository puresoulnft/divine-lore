// Main JavaScript functionality for Character Lore page
import { characters } from './characters.js';

// DOM Elements
const characterGrid = document.getElementById('characterGrid');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');
const characterModal = document.getElementById('characterModal');

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    generateCharacterCards();
    setupEventListeners();
    filterCharacters();
});

// Generate all character cards dynamically
function generateCharacterCards() {
    const characterKeys = Object.keys(characters);
    
    characterKeys.forEach(key => {
        const character = characters[key];
        const card = createCharacterCard(character, key);
        characterGrid.appendChild(card);
    });
}

// Create individual character card
function createCharacterCard(character, key) {
    const card = document.createElement('div');
    card.className = 'character-card';
    card.setAttribute('data-faction', character.faction);
    card.setAttribute('data-rarity', character.rarity);
    
    card.innerHTML = `
        <div class="character-header">
            <div class="character-avatar">
                ${character.image ? 
                    `<img src="${character.image}" alt="${character.name}">` : 
                    `<span class="placeholder">${character.avatar}</span>`
                }
            </div>
            <div class="character-name">${character.name}</div>
            <div class="character-title">${character.title}</div>
            <div class="character-faction">${character.faction}</div>
            <div class="character-rarity rarity-${character.rarity.toLowerCase()}">${character.rarity}</div>
        </div>
        <div class="character-content">
            <div class="lore-preview">
                ${character.loreBackground.substring(0, 200)}...
            </div>
            <button class="expand-btn" onclick="openCharacterModal('${key}')">View Full Lore</button>
        </div>
    `;
    
    return card;
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', filterCharacters);
    
    // Filter button functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter characters
            filterCharacters();
        });
    });
    
    // Modal close functionality
    characterModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeCharacterModal();
        }
    });
}

// Filter characters based on search and rarity
function filterCharacters() {
    const searchTerm = searchInput.value.toLowerCase();
    const activeFilter = document.querySelector('.filter-btn.active').dataset.rarity;
    const cards = document.querySelectorAll('.character-card');

    cards.forEach(card => {
        const name = card.querySelector('.character-name').textContent.toLowerCase();
        const rarity = card.dataset.rarity;
        
        const matchesSearch = name.includes(searchTerm);
        const matchesFilter = activeFilter === 'all' || rarity === activeFilter;

        if (matchesSearch && matchesFilter) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Open character modal
window.openCharacterModal = function(characterKey) {
    const character = characters[characterKey];
    if (!character) return;

    // Handle avatar image or placeholder
    const modalAvatar = document.getElementById('modalAvatar');
    if (character.image) {
        modalAvatar.innerHTML = `<img src="${character.image}" alt="${character.name}">`;
    } else {
        modalAvatar.innerHTML = `<span class="placeholder">${character.avatar}</span>`;
    }

    // Populate modal header
    document.getElementById('modalName').textContent = character.name;
    document.getElementById('modalTitle').textContent = character.title;
    document.getElementById('modalFaction').textContent = character.faction;

    // Populate modal content
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = `
        <div class="lore-section">
            <h3>Lore Background</h3>
            <p>${character.loreBackground.replace(/\n\n/g, '</p><p>')}</p>
        </div>

        <div class="lore-section">
            <h3>Role in the Pure Soul Universe</h3>
            <p>${character.role}</p>
        </div>

        <div class="signature-power">
            <h4>Signature Power / Skill</h4>
            <p>${character.signaturePower}</p>
        </div>

        <div class="lore-section">
            <h3>Personality Profile</h3>
            <div class="personality-traits">
                ${character.personality.map(trait => `<span class="trait">${trait}</span>`).join('')}
            </div>
        </div>

        <div class="lore-section">
            <h3>Faction War Impact</h3>
            <p>${character.factionImpact}</p>
        </div>
    `;

    // Show modal
    characterModal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

// Close character modal
window.closeCharacterModal = function() {
    characterModal.classList.remove('active');
    document.body.style.overflow = 'auto';
};