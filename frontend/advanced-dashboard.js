// Advanced Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeAdvancedDashboard();
    initializeTabSystem();
    initializeMapsIntegration();
    initializeEnergyVisualization();
    initializeAIChat();
    initializeCompass();
    initializeElementMapping();
    initializeProsperityZones();
    initializeRecommendations();
});

// Initialize Advanced Dashboard
function initializeAdvancedDashboard() {
    console.log('🚀 Advanced Vastu Dashboard initialized');
    
    // Simulate loading of analysis data
    setTimeout(() => {
        loadAnalysisData();
    }, 1000);
}

// Load Analysis Data
function loadAnalysisData() {
    // Simulate API call to get analysis data
    const analysisData = {
        overallScore: 82,
        directionalScore: 85,
        elementScore: 80,
        energyScore: 78,
        directionalAnalysis: {
            north: 85,
            south: 78,
            east: 92,
            west: 75,
            northeast: 88,
            northwest: 82,
            southeast: 90,
            southwest: 85
        },
        elementMapping: {
            earth: { score: 80, locations: ['southwest', 'center'] },
            water: { score: 65, locations: ['northeast'] },
            fire: { score: 90, locations: ['southeast', 'south'] },
            air: { score: 75, locations: ['northwest'] },
            space: { score: 85, locations: ['center', 'northeast'] }
        },
        energyFlow: {
            score: 78,
            blockedAreas: ['northwest corner', 'center area'],
            freeFlowAreas: ['northeast', 'southeast']
        },
        prosperityZones: {
            wealth: { location: 'northeast', score: 88 },
            career: { location: 'north', score: 85 },
            health: { location: 'east', score: 92 },
            relationships: { location: 'southwest', score: 80 }
        }
    };
    
    updateDashboardStats(analysisData);
    updateCompassScores(analysisData.directionalAnalysis);
    updateElementMapping(analysisData.elementMapping);
    updateProsperityZones(analysisData.prosperityZones);
}

// Update Dashboard Stats
function updateDashboardStats(data) {
    document.getElementById('overallScore').textContent = data.overallScore;
    document.getElementById('directionalScore').textContent = data.directionalScore;
    document.getElementById('elementScore').textContent = data.elementScore;
    document.getElementById('energyScore').textContent = data.energyScore;
    
    // Animate score updates
    animateScoreUpdates();
}

// Animate Score Updates
function animateScoreUpdates() {
    const scoreElements = document.querySelectorAll('.stat-content h3');
    scoreElements.forEach(element => {
        const finalValue = parseInt(element.textContent);
        let currentValue = 0;
        const increment = finalValue / 50;
        
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
                element.textContent = finalValue;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(currentValue);
            }
        }, 30);
    });
}

// Initialize Tab System
function initializeTabSystem() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            // Trigger specific tab initialization
            initializeTabContent(targetTab);
        });
    });
}

// Initialize Tab Content
function initializeTabContent(tabName) {
    switch(tabName) {
        case 'directional':
            initializeCompass();
            break;
        case 'elements':
            initializeElementMapping();
            break;
        case 'energy':
            initializeEnergyVisualization();
            break;
        case 'prosperity':
            initializeProsperityZones();
            break;
        case 'recommendations':
            initializeRecommendations();
            break;
        case 'ai-chat':
            initializeAIChat();
            break;
    }
}

// Initialize Maps Integration
function initializeMapsIntegration() {
    const getLocationBtn = document.getElementById('getLocationBtn');
    const locationInput = document.getElementById('locationInput');
    
    getLocationBtn.addEventListener('click', () => {
        const address = locationInput.value.trim();
        if (address) {
            analyzeLocation(address);
        } else {
            showNotification('Please enter a valid address', 'error');
        }
    });
    
    // Auto-detect location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            locationInput.value = `${lat}, ${lng}`;
        });
    }
}

// Analyze Location
async function analyzeLocation(address) {
    const getLocationBtn = document.getElementById('getLocationBtn');
    const mapsResults = document.getElementById('mapsResults');
    
    getLocationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
    getLocationBtn.disabled = true;
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show results
        mapsResults.style.display = 'block';
        mapsResults.scrollIntoView({ behavior: 'smooth' });
        
        showNotification('Location analysis completed!', 'success');
    } catch (error) {
        showNotification('Failed to analyze location', 'error');
    } finally {
        getLocationBtn.innerHTML = '<i class="fas fa-search"></i> Analyze Location';
        getLocationBtn.disabled = false;
    }
}

// Initialize Compass
function initializeCompass() {
    const directions = document.querySelectorAll('.direction');
    
    directions.forEach(direction => {
        direction.addEventListener('click', () => {
            const directionName = direction.getAttribute('data-direction');
            showDirectionDetails(directionName);
        });
    });
}

// Show Direction Details
function showDirectionDetails(direction) {
    const directionData = {
        north: {
            name: 'North',
            element: 'Water',
            deity: 'Kubera',
            characteristics: ['Wealth', 'Career', 'Opportunities'],
            score: 85,
            recommendations: ['Keep clean and organized', 'Avoid heavy furniture', 'Use blue colors']
        },
        south: {
            name: 'South',
            element: 'Fire',
            deity: 'Yama',
            characteristics: ['Fame', 'Recognition', 'Reputation'],
            score: 78,
            recommendations: ['Use red colors', 'Avoid water features', 'Keep well-lit']
        },
        east: {
            name: 'East',
            element: 'Air',
            deity: 'Indra',
            characteristics: ['Health', 'Family', 'New Beginnings'],
            score: 92,
            recommendations: ['Keep open and airy', 'Use light colors', 'Avoid heavy furniture']
        },
        west: {
            name: 'West',
            element: 'Air',
            deity: 'Varuna',
            characteristics: ['Children', 'Creativity', 'Pleasure'],
            score: 75,
            recommendations: ['Use light colors', 'Keep well-ventilated', 'Avoid dark colors']
        }
    };
    
    const data = directionData[direction];
    if (data) {
        showDirectionModal(data);
    }
}

// Show Direction Modal
function showDirectionModal(data) {
    const modal = document.createElement('div');
    modal.className = 'direction-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${data.name} Direction Analysis</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <div class="direction-info">
                    <div class="info-item">
                        <strong>Element:</strong> ${data.element}
                    </div>
                    <div class="info-item">
                        <strong>Deity:</strong> ${data.deity}
                    </div>
                    <div class="info-item">
                        <strong>Score:</strong> ${data.score}/100
                    </div>
                </div>
                <div class="characteristics">
                    <h4>Characteristics:</h4>
                    <ul>
                        ${data.characteristics.map(char => `<li>${char}</li>`).join('')}
                    </ul>
                </div>
                <div class="recommendations">
                    <h4>Recommendations:</h4>
                    <ul>
                        ${data.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal
    modal.querySelector('.close-btn').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Update Compass Scores
function updateCompassScores(scores) {
    Object.entries(scores).forEach(([direction, score]) => {
        const directionElement = document.querySelector(`[data-direction="${direction}"]`);
        if (directionElement) {
            const scoreElement = directionElement.querySelector('.direction-score');
            if (scoreElement) {
                scoreElement.textContent = score;
                
                // Color code based on score
                if (score >= 85) {
                    directionElement.style.background = '#d4edda';
                    directionElement.style.borderColor = '#28a745';
                } else if (score >= 70) {
                    directionElement.style.background = '#fff3cd';
                    directionElement.style.borderColor = '#ffc107';
                } else {
                    directionElement.style.background = '#f8d7da';
                    directionElement.style.borderColor = '#dc3545';
                }
            }
        }
    });
}

// Initialize Element Mapping
function initializeElementMapping() {
    const elementCards = document.querySelectorAll('.element-card');
    
    elementCards.forEach(card => {
        card.addEventListener('click', () => {
            const elementType = card.classList[1]; // earth, water, fire, air, space
            showElementDetails(elementType);
        });
    });
}

// Show Element Details
function showElementDetails(element) {
    const elementData = {
        earth: {
            name: 'Earth Element',
            symbol: '🌍',
            color: 'Brown/Yellow',
            direction: 'Southwest',
            characteristics: ['Stability', 'Foundation', 'Grounding'],
            rooms: ['Bedroom', 'Study', 'Storage'],
            materials: ['Clay', 'Stone', 'Ceramic', 'Wood'],
            colors: ['Brown', 'Yellow', 'Orange', 'Beige'],
            remedies: ['Add earth elements', 'Use brown colors', 'Place heavy furniture']
        },
        water: {
            name: 'Water Element',
            symbol: '💧',
            color: 'Blue/Black',
            direction: 'Northeast',
            characteristics: ['Fluidity', 'Flow', 'Purity'],
            rooms: ['Bathroom', 'Kitchen', 'Puja Room'],
            materials: ['Glass', 'Mirror', 'Crystal', 'Metal'],
            colors: ['Blue', 'Black', 'Dark Blue', 'Navy'],
            remedies: ['Add water features', 'Use blue colors', 'Place mirrors']
        },
        fire: {
            name: 'Fire Element',
            symbol: '🔥',
            color: 'Red/Orange',
            direction: 'Southeast',
            characteristics: ['Energy', 'Passion', 'Transformation'],
            rooms: ['Kitchen', 'Dining Room', 'Study'],
            materials: ['Metal', 'Copper', 'Brass', 'Stainless Steel'],
            colors: ['Red', 'Orange', 'Pink', 'Coral'],
            remedies: ['Add fire elements', 'Use red colors', 'Place electrical appliances']
        },
        air: {
            name: 'Air Element',
            symbol: '💨',
            color: 'White/Gray',
            direction: 'Northwest',
            characteristics: ['Movement', 'Vitality', 'Communication'],
            rooms: ['Living Room', 'Balcony', 'Study'],
            materials: ['Wood', 'Bamboo', 'Light Fabrics'],
            colors: ['White', 'Gray', 'Light Blue', 'Silver'],
            remedies: ['Improve ventilation', 'Use light colors', 'Add wind chimes']
        },
        space: {
            name: 'Space Element',
            symbol: '🌌',
            color: 'Purple/Violet',
            direction: 'Center',
            characteristics: ['Balance', 'Harmony', 'Spirituality'],
            rooms: ['Center of house', 'Meditation room', 'Puja room'],
            materials: ['Open space', 'Crystals', 'Sacred objects'],
            colors: ['Purple', 'Violet', 'Indigo', 'Deep Blue'],
            remedies: ['Keep center open', 'Use purple colors', 'Add spiritual elements']
        }
    };
    
    const data = elementData[element];
    if (data) {
        showElementModal(data);
    }
}

// Show Element Modal
function showElementModal(data) {
    const modal = document.createElement('div');
    modal.className = 'element-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${data.name} ${data.symbol}</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <div class="element-info">
                    <div class="info-item">
                        <strong>Color:</strong> ${data.color}
                    </div>
                    <div class="info-item">
                        <strong>Direction:</strong> ${data.direction}
                    </div>
                </div>
                <div class="characteristics">
                    <h4>Characteristics:</h4>
                    <ul>
                        ${data.characteristics.map(char => `<li>${char}</li>`).join('')}
                    </ul>
                </div>
                <div class="rooms">
                    <h4>Ideal Rooms:</h4>
                    <ul>
                        ${data.rooms.map(room => `<li>${room}</li>`).join('')}
                    </ul>
                </div>
                <div class="materials">
                    <h4>Materials:</h4>
                    <ul>
                        ${data.materials.map(material => `<li>${material}</li>`).join('')}
                    </ul>
                </div>
                <div class="colors">
                    <h4>Colors:</h4>
                    <ul>
                        ${data.colors.map(color => `<li>${color}</li>`).join('')}
                    </ul>
                </div>
                <div class="remedies">
                    <h4>Remedies:</h4>
                    <ul>
                        ${data.remedies.map(remedy => `<li>${remedy}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal
    modal.querySelector('.close-btn').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Update Element Mapping
function updateElementMapping(elementData) {
    Object.entries(elementData).forEach(([element, data]) => {
        const elementCard = document.querySelector(`.element-card.${element}`);
        if (elementCard) {
            const scoreElement = elementCard.querySelector('.element-score');
            if (scoreElement) {
                scoreElement.textContent = data.score;
                
                // Color code based on score
                if (data.score >= 80) {
                    elementCard.style.borderColor = '#28a745';
                } else if (data.score >= 60) {
                    elementCard.style.borderColor = '#ffc107';
                } else {
                    elementCard.style.borderColor = '#dc3545';
                }
            }
        }
    });
}

// Initialize Energy Visualization
function initializeEnergyVisualization() {
    const canvas = document.getElementById('energyFlowCanvas');
    if (canvas) {
        createEnergyFlowVisualization(canvas);
    }
}

// Create Energy Flow Visualization
function createEnergyFlowVisualization(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw energy flow lines
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.7;
    
    // Draw flowing energy lines
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(50 + i * 150, 50);
        ctx.quadraticCurveTo(200 + i * 100, 200, 350 + i * 150, 350);
        ctx.stroke();
    }
    
    // Draw energy nodes
    const nodes = [
        { x: 100, y: 100, type: 'positive' },
        { x: 300, y: 150, type: 'positive' },
        { x: 500, y: 200, type: 'blocked' },
        { x: 200, y: 300, type: 'positive' },
        { x: 400, y: 350, type: 'positive' }
    ];
    
    nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 15, 0, 2 * Math.PI);
        
        if (node.type === 'positive') {
            ctx.fillStyle = '#28a745';
        } else {
            ctx.fillStyle = '#dc3545';
        }
        
        ctx.fill();
    });
    
    // Add animation
    animateEnergyFlow(ctx, canvas);
}

// Animate Energy Flow
function animateEnergyFlow(ctx, canvas) {
    let frame = 0;
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Redraw with animation
        ctx.strokeStyle = `rgba(102, 126, 234, ${0.5 + 0.3 * Math.sin(frame * 0.1)})`;
        ctx.lineWidth = 3;
        
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(50 + i * 150, 50);
            ctx.quadraticCurveTo(200 + i * 100, 200, 350 + i * 150, 350);
            ctx.stroke();
        }
        
        frame++;
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Initialize Prosperity Zones
function initializeProsperityZones() {
    const prosperityCards = document.querySelectorAll('.prosperity-card');
    
    prosperityCards.forEach(card => {
        card.addEventListener('click', () => {
            const zoneType = card.classList[1]; // wealth, career, health, relationships
            showProsperityDetails(zoneType);
        });
    });
}

// Show Prosperity Details
function showProsperityDetails(zone) {
    const zoneData = {
        wealth: {
            name: 'Wealth Zone',
            location: 'Northeast',
            score: 88,
            activation: ['Add water features', 'Use blue colors', 'Keep area clean'],
            enhancement: ['Place money plant', 'Use crystals', 'Avoid clutter']
        },
        career: {
            name: 'Career Zone',
            location: 'North',
            score: 85,
            activation: ['Place study desk', 'Use white colors', 'Add crystals'],
            enhancement: ['Keep organized', 'Add motivational quotes', 'Ensure good lighting']
        },
        health: {
            name: 'Health Zone',
            location: 'East',
            score: 92,
            activation: ['Add plants', 'Use green colors', 'Ensure good lighting'],
            enhancement: ['Keep clean', 'Add natural elements', 'Avoid electronics']
        },
        relationships: {
            name: 'Relationship Zone',
            location: 'Southwest',
            score: 80,
            activation: ['Place master bedroom', 'Use earth colors', 'Add pairs of objects'],
            enhancement: ['Keep balanced', 'Add romantic elements', 'Avoid single items']
        }
    };
    
    const data = zoneData[zone];
    if (data) {
        showProsperityModal(data);
    }
}

// Show Prosperity Modal
function showProsperityModal(data) {
    const modal = document.createElement('div');
    modal.className = 'prosperity-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${data.name} Analysis</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <div class="zone-info">
                    <div class="info-item">
                        <strong>Location:</strong> ${data.location}
                    </div>
                    <div class="info-item">
                        <strong>Score:</strong> ${data.score}/100
                    </div>
                </div>
                <div class="activation">
                    <h4>Activation Methods:</h4>
                    <ul>
                        ${data.activation.map(method => `<li>${method}</li>`).join('')}
                    </ul>
                </div>
                <div class="enhancement">
                    <h4>Enhancement Tips:</h4>
                    <ul>
                        ${data.enhancement.map(tip => `<li>${tip}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal
    modal.querySelector('.close-btn').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Update Prosperity Zones
function updateProsperityZones(prosperityData) {
    Object.entries(prosperityData).forEach(([zone, data]) => {
        const zoneCard = document.querySelector(`.prosperity-card.${zone}`);
        if (zoneCard) {
            const scoreElement = zoneCard.querySelector('.zone-score');
            if (scoreElement) {
                scoreElement.textContent = data.score;
                
                // Color code based on score
                if (data.score >= 85) {
                    zoneCard.style.borderColor = '#28a745';
                } else if (data.score >= 70) {
                    zoneCard.style.borderColor = '#ffc107';
                } else {
                    zoneCard.style.borderColor = '#dc3545';
                }
            }
        }
    });
}

// Initialize Recommendations
function initializeRecommendations() {
    const recTabButtons = document.querySelectorAll('.rec-tab-btn');
    const recContents = document.querySelectorAll('.rec-content');
    
    recTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-rec-tab');
            
            // Remove active class from all buttons and contents
            recTabButtons.forEach(btn => btn.classList.remove('active'));
            recContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Initialize AI Chat
function initializeAIChat() {
    const chatInput = document.getElementById('chatInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    const chatMessages = document.getElementById('chatMessages');
    const suggestionButtons = document.querySelectorAll('.suggestion-btn');
    
    // Send message functionality
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            addUserMessage(message);
            chatInput.value = '';
            
            // Simulate AI response
            setTimeout(() => {
                const aiResponse = generateAIResponse(message);
                addAIMessage(aiResponse);
            }, 1000);
        }
    }
    
    sendMessageBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Suggestion buttons
    suggestionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const suggestion = button.textContent;
            chatInput.value = suggestion;
            sendMessage();
        });
    });
}

// Add User Message
function addUserMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user-message';
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-user"></i>
        </div>
        <div class="message-content">
            <p>${message}</p>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add AI Message
function addAIMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ai-message';
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <p>${message}</p>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Generate AI Response
function generateAIResponse(userMessage) {
    const responses = {
        'kitchen': 'Based on your Vastu analysis, your kitchen placement needs attention. I recommend moving it to the southeast corner for optimal health and prosperity. This will enhance the fire element and improve digestion.',
        'bedroom': 'Your bedroom analysis shows good potential. For better sleep and relationships, ensure your bed faces east or south. Avoid mirrors facing the bed and use earth colors like brown or beige.',
        'color': 'Color therapy is a powerful Vastu remedy! Use blue in the north for career, red in the south for fame, green in the east for health, and yellow in the center for balance.',
        'energy': 'Your energy flow analysis indicates some blocked areas. I suggest removing obstacles from the northwest corner and opening up the center space. This will improve overall energy circulation.',
        'default': 'I understand your question about Vastu. Based on your analysis, I can provide specific recommendations. Could you tell me more about which area you\'d like to focus on - kitchen, bedroom, living room, or overall energy flow?'
    };
    
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('kitchen')) {
        return responses.kitchen;
    } else if (lowerMessage.includes('bedroom')) {
        return responses.bedroom;
    } else if (lowerMessage.includes('color')) {
        return responses.color;
    } else if (lowerMessage.includes('energy')) {
        return responses.energy;
    } else {
        return responses.default;
    }
}

// Show Notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add CSS for modals
const modalStyles = `
<style>
.direction-modal, .element-modal, .prosperity-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease;
}

.modal-content {
    background: white;
    border-radius: 15px;
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    animation: slideUp 0.3s ease;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
    margin: 0;
    color: #333;
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
}

.modal-body {
    padding: 1.5rem;
}

.info-item {
    margin-bottom: 0.5rem;
    color: #666;
}

.characteristics, .rooms, .materials, .colors, .remedies, .activation, .enhancement {
    margin-top: 1.5rem;
}

.characteristics h4, .rooms h4, .materials h4, .colors h4, .remedies h4, .activation h4, .enhancement h4 {
    color: #667eea;
    margin-bottom: 0.5rem;
}

.characteristics ul, .rooms ul, .materials ul, .colors ul, .remedies ul, .activation ul, .enhancement ul {
    list-style: none;
    padding: 0;
}

.characteristics li, .rooms li, .materials li, .colors li, .remedies li, .activation li, .enhancement li {
    padding: 0.3rem 0;
    color: #666;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideUp {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

@keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', modalStyles);
