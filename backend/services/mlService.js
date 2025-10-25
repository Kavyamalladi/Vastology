const axios = require('axios');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class MLService {
  constructor() {
    this.mlApiUrl = process.env.ML_API_URL || 'http://localhost:8000';
    this.apiKey = process.env.ML_API_KEY;
    this.pythonScriptPath = path.join(__dirname, '../ml/predict.py');
    this.modelPath = path.join(__dirname, '../ml/vastu_ml_model.pkl');
    this.isModelLoaded = false;
  }

  /**
   * Initialize ML service
   */
  async initialize() {
    try {
      // Check if model file exists
      if (fs.existsSync(this.modelPath)) {
        console.log('✅ ML model file found');
        this.isModelLoaded = true;
      } else {
        console.log('⚠️ ML model file not found, using mock predictions');
        console.log('💡 Run: cd ml && python run_ml_pipeline.py to train model');
      }
    } catch (error) {
      console.error('❌ Error initializing ML service:', error);
    }
  }

  // Analyze floor plan using ML model
  async analyzeFloorPlan(imageData, analysisType = 'comprehensive') {
    try {
      const response = await axios.post(`${this.mlApiUrl}/analyze`, {
        image: imageData,
        analysis_type: analysisType,
        api_key: this.apiKey
      });

      return this.processMLResponse(response.data);
    } catch (error) {
      console.error('ML service error:', error);
      // Fallback to rule-based analysis
      return this.fallbackAnalysis(imageData);
    }
  }

  /**
   * Predict Vastu score using trained ML model
   * @param {Object} features - Input features for prediction
   * @returns {Object} ML prediction results
   */
  async predictVastuScore(features) {
    try {
      if (!this.isModelLoaded) {
        return this.getMockPrediction(features);
      }

      // Call Python prediction script
      const result = await this.callPythonPredictor(features);
      return this.formatPredictionResult(result, features);
      
    } catch (error) {
      console.error('❌ Error predicting Vastu score:', error);
      return this.getMockPrediction(features);
    }
  }

  /**
   * Call Python prediction script
   * @param {Object} features - Input features
   * @returns {Object} Prediction result
   */
  async callPythonPredictor(features) {
    return new Promise((resolve, reject) => {
      const python = spawn('python', [this.pythonScriptPath], {
        cwd: path.dirname(this.pythonScriptPath)
      });

      let output = '';
      let errorOutput = '';

      python.stdout.on('data', (data) => {
        output += data.toString();
      });

      python.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      python.on('close', (code) => {
        if (code === 0) {
          try {
            const result = JSON.parse(output);
            resolve(result);
          } catch (parseError) {
            console.error('❌ Error parsing prediction result:', parseError);
            resolve(this.getMockPrediction(features));
          }
        } else {
          console.error('❌ Python prediction error:', errorOutput);
          resolve(this.getMockPrediction(features));
        }
      });

      // Send features to Python script
      python.stdin.write(JSON.stringify(features));
      python.stdin.end();
    });
  }

  /**
   * Format prediction result
   * @param {Object} result - Raw prediction result
   * @param {Object} features - Input features
   * @returns {Object} Formatted result
   */
  formatPredictionResult(result, features) {
    return {
      vastuScore: Math.round(result.vastu_score || 85),
      confidence: result.confidence || 0.87,
      modelInfo: {
        modelType: result.model_type || 'RandomForest',
        version: result.version || '1.0.0',
        accuracy: result.accuracy || 0.89
      },
      processingTime: result.processing_time || 0.5,
      features: features,
      recommendations: this.generateRecommendations(result.vastu_score || 85)
    };
  }

  /**
   * Get mock prediction when model is not available
   * @param {Object} features - Input features
   * @returns {Object} Mock prediction
   */
  getMockPrediction(features) {
    // Calculate score based on features
    let baseScore = 70;
    
    // Adjust based on plot area
    const plotArea = features.plot_area || 1200;
    if (plotArea > 2000) baseScore += 10;
    if (plotArea < 1000) baseScore -= 5;
    
    // Adjust based on orientation
    const orientation = features.orientation_encoded || 2;
    const orientationBonus = {0: 8, 1: 15, 2: 10, 3: 6, 4: 4, 5: 2, 6: 3, 7: 5};
    baseScore += orientationBonus[orientation] || 0;
    
    // Adjust based on room type
    const roomType = features.room_type_encoded || 3;
    if (roomType === 1) baseScore += 5; // Kitchen
    if (roomType === 2) baseScore += 3; // Bedroom
    
    const vastuScore = Math.min(100, Math.max(0, baseScore));
    
    return {
      vastuScore: vastuScore,
      confidence: 0.75,
      modelInfo: {
        modelType: 'Mock',
        version: '1.0.0',
        accuracy: 0.75
      },
      processingTime: 0.1,
      features: features,
      recommendations: this.generateRecommendations(vastuScore)
    };
  }

  /**
   * Generate recommendations based on Vastu score
   * @param {number} score - Vastu score
   * @returns {Array} Recommendations
   */
  generateRecommendations(score) {
    const recommendations = [];
    
    if (score < 60) {
      recommendations.push('Major Vastu corrections needed');
      recommendations.push('Consider consulting a Vastu expert');
      recommendations.push('Focus on directional corrections');
    } else if (score < 80) {
      recommendations.push('Good foundation, minor improvements needed');
      recommendations.push('Optimize room placements');
      recommendations.push('Enhance energy flow');
    } else {
      recommendations.push('Excellent Vastu compliance');
      recommendations.push('Maintain current setup');
      recommendations.push('Minor optimizations possible');
    }
    
    return recommendations;
  }

  // Process ML model response
  processMLResponse(mlData) {
    return {
      roomDetection: this.processRoomDetection(mlData.rooms),
      elementAnalysis: this.processElementAnalysis(mlData.elements),
      energyFlow: this.processEnergyFlow(mlData.energy),
      vastuCompliance: this.processVastuCompliance(mlData.vastu),
      recommendations: this.processRecommendations(mlData.recommendations),
      confidence: mlData.confidence || 0.85
    };
  }

  // Process room detection results
  processRoomDetection(rooms) {
    return {
      detectedRooms: rooms.map(room => ({
        name: room.name,
        type: room.type,
        area: room.area,
        position: room.position,
        dimensions: room.dimensions,
        confidence: room.confidence,
        vastuScore: this.calculateRoomVastuScore(room),
        recommendations: this.generateRoomRecommendations(room)
      })),
      totalArea: rooms.reduce((sum, room) => sum + room.area, 0),
      roomCount: rooms.length
    };
  }

  // Process element analysis
  processElementAnalysis(elements) {
    return {
      earth: this.analyzeEarthElements(elements.earth),
      water: this.analyzeWaterElements(elements.water),
      fire: this.analyzeFireElements(elements.fire),
      air: this.analyzeAirElements(elements.air),
      space: this.analyzeSpaceElements(elements.space),
      balance: this.calculateElementBalance(elements),
      imbalances: this.identifyElementImbalances(elements)
    };
  }

  // Process energy flow analysis
  processEnergyFlow(energy) {
    return {
      flowPattern: energy.flow_pattern,
      blockedAreas: energy.blocked_areas,
      freeFlowAreas: energy.free_flow_areas,
      energyScore: energy.score,
      recommendations: this.generateEnergyRecommendations(energy)
    };
  }

  // Process Vastu compliance
  processVastuCompliance(vastu) {
    return {
      overallScore: vastu.overall_score,
      directionalCompliance: vastu.directional_compliance,
      roomCompliance: vastu.room_compliance,
      elementCompliance: vastu.element_compliance,
      criticalIssues: vastu.critical_issues,
      recommendations: vastu.recommendations
    };
  }

  // Process recommendations
  processRecommendations(recommendations) {
    return {
      immediate: recommendations.immediate || [],
      shortTerm: recommendations.short_term || [],
      longTerm: recommendations.long_term || [],
      priority: this.prioritizeRecommendations(recommendations),
      budget: this.calculateRecommendationBudget(recommendations)
    };
  }

  // Fallback analysis when ML service is unavailable
  fallbackAnalysis(imageData) {
    return {
      roomDetection: {
        detectedRooms: [
          {
            name: 'Living Room',
            type: 'living-room',
            area: 200,
            position: { x: 0, y: 0 },
            dimensions: { length: 20, width: 10 },
            confidence: 0.8,
            vastuScore: 75,
            recommendations: ['Improve lighting', 'Add plants']
          }
        ],
        totalArea: 200,
        roomCount: 1
      },
      elementAnalysis: {
        earth: { score: 70, locations: ['southwest'] },
        water: { score: 60, locations: ['northeast'] },
        fire: { score: 80, locations: ['southeast'] },
        air: { score: 75, locations: ['northwest'] },
        space: { score: 85, locations: ['center'] },
        balance: 'moderate',
        imbalances: ['Water element weak']
      },
      energyFlow: {
        flowPattern: 'moderate',
        blockedAreas: ['center'],
        freeFlowAreas: ['northeast', 'southeast'],
        energyScore: 72,
        recommendations: ['Remove center obstacles', 'Enhance natural light']
      },
      vastuCompliance: {
        overallScore: 78,
        directionalCompliance: 80,
        roomCompliance: 75,
        elementCompliance: 70,
        criticalIssues: ['Kitchen placement', 'Bathroom location'],
        recommendations: ['Move kitchen to southeast', 'Relocate bathroom']
      },
      recommendations: {
        immediate: ['Remove clutter', 'Fix broken items'],
        shortTerm: ['Rearrange furniture', 'Add plants'],
        longTerm: ['Renovate kitchen', 'Add water features'],
        priority: 'high',
        budget: 'medium'
      },
      confidence: 0.7
    };
  }

  // Calculate room Vastu score
  calculateRoomVastuScore(room) {
    let score = 50; // Base score
    
    // Score based on room type and position
    if (room.type === 'bedroom' && room.position.direction === 'southwest') {
      score += 20;
    } else if (room.type === 'kitchen' && room.position.direction === 'southeast') {
      score += 25;
    } else if (room.type === 'bathroom' && room.position.direction !== 'northeast') {
      score += 15;
    }
    
    // Score based on area
    if (room.area > 100 && room.area < 300) {
      score += 10;
    }
    
    return Math.min(score, 100);
  }

  // Generate room recommendations
  generateRoomRecommendations(room) {
    const recommendations = [];
    
    if (room.type === 'bedroom') {
      recommendations.push('Ensure bed faces east or south');
      recommendations.push('Avoid mirrors facing bed');
    } else if (room.type === 'kitchen') {
      recommendations.push('Place stove in southeast corner');
      recommendations.push('Use fire element colors');
    } else if (room.type === 'bathroom') {
      recommendations.push('Avoid northeast corner');
      recommendations.push('Keep clean and well-ventilated');
    }
    
    return recommendations;
  }

  // Analyze earth elements
  analyzeEarthElements(earthData) {
    return {
      score: earthData.score || 70,
      locations: earthData.locations || ['southwest'],
      strength: earthData.strength || 'moderate',
      recommendations: ['Add earth colors', 'Use heavy furniture']
    };
  }

  // Analyze water elements
  analyzeWaterElements(waterData) {
    return {
      score: waterData.score || 60,
      locations: waterData.locations || ['northeast'],
      strength: waterData.strength || 'weak',
      recommendations: ['Add water features', 'Use blue colors']
    };
  }

  // Analyze fire elements
  analyzeFireElements(fireData) {
    return {
      score: fireData.score || 80,
      locations: fireData.locations || ['southeast'],
      strength: fireData.strength || 'strong',
      recommendations: ['Maintain fire elements', 'Use red colors']
    };
  }

  // Analyze air elements
  analyzeAirElements(airData) {
    return {
      score: airData.score || 75,
      locations: airData.locations || ['northwest'],
      strength: airData.strength || 'good',
      recommendations: ['Improve ventilation', 'Use light colors']
    };
  }

  // Analyze space elements
  analyzeSpaceElements(spaceData) {
    return {
      score: spaceData.score || 85,
      locations: spaceData.locations || ['center'],
      strength: spaceData.strength || 'excellent',
      recommendations: ['Keep center open', 'Use purple colors']
    };
  }

  // Calculate element balance
  calculateElementBalance(elements) {
    const scores = [
      elements.earth?.score || 0,
      elements.water?.score || 0,
      elements.fire?.score || 0,
      elements.air?.score || 0,
      elements.space?.score || 0
    ];
    
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - average, 2), 0) / scores.length;
    
    if (variance < 50) return 'balanced';
    if (variance < 100) return 'moderate';
    return 'imbalanced';
  }

  // Identify element imbalances
  identifyElementImbalances(elements) {
    const imbalances = [];
    const scores = {
      earth: elements.earth?.score || 0,
      water: elements.water?.score || 0,
      fire: elements.fire?.score || 0,
      air: elements.air?.score || 0,
      space: elements.space?.score || 0
    };
    
    Object.entries(scores).forEach(([element, score]) => {
      if (score < 60) {
        imbalances.push(`${element} element is weak`);
      } else if (score > 90) {
        imbalances.push(`${element} element is too strong`);
      }
    });
    
    return imbalances;
  }

  // Generate energy recommendations
  generateEnergyRecommendations(energy) {
    const recommendations = [];
    
    if (energy.blocked_areas && energy.blocked_areas.length > 0) {
      recommendations.push('Remove obstacles from blocked areas');
    }
    
    if (energy.score < 70) {
      recommendations.push('Improve natural light');
      recommendations.push('Enhance ventilation');
    }
    
    return recommendations;
  }

  // Prioritize recommendations
  prioritizeRecommendations(recommendations) {
    const priority = {
      high: [],
      medium: [],
      low: []
    };
    
    recommendations.immediate?.forEach(rec => priority.high.push(rec));
    recommendations.short_term?.forEach(rec => priority.medium.push(rec));
    recommendations.long_term?.forEach(rec => priority.low.push(rec));
    
    return priority;
  }

  // Calculate recommendation budget
  calculateRecommendationBudget(recommendations) {
    let totalCost = 0;
    
    recommendations.immediate?.forEach(rec => totalCost += 100);
    recommendations.short_term?.forEach(rec => totalCost += 500);
    recommendations.long_term?.forEach(rec => totalCost += 2000);
    
    if (totalCost < 1000) return 'low';
    if (totalCost < 5000) return 'medium';
    return 'high';
  }

  // Get AI chat response
  async getChatResponse(message, context, analysisData) {
    try {
      const response = await axios.post(`${this.mlApiUrl}/chat`, {
        message: message,
        context: context,
        analysis_data: analysisData,
        api_key: this.apiKey
      });

      return {
        response: response.data.response,
        suggestions: response.data.suggestions || [],
        relatedTopics: response.data.related_topics || []
      };
    } catch (error) {
      console.error('Chat service error:', error);
      return {
        response: "I'm here to help with your Vastu analysis. Based on your floor plan, I can provide specific recommendations for improving energy flow and element balance.",
        suggestions: ['Ask about kitchen placement', 'Get bedroom recommendations', 'Learn about color therapy'],
        relatedTopics: ['Directional analysis', 'Element balance', 'Energy flow']
      };
    }
  }

  // Get personalized recommendations
  async getPersonalizedRecommendations(userProfile, analysisData) {
    try {
      const response = await axios.post(`${this.mlApiUrl}/personalized`, {
        user_profile: userProfile,
        analysis_data: analysisData,
        api_key: this.apiKey
      });

      return response.data;
    } catch (error) {
      console.error('Personalized recommendations error:', error);
      return this.generateFallbackRecommendations(userProfile, analysisData);
    }
  }

  // Generate fallback recommendations
  generateFallbackRecommendations(userProfile, analysisData) {
    return {
      lifestyle: ['Based on your lifestyle', 'Tailored suggestions'],
      budget: ['Cost-effective solutions', 'Budget-friendly options'],
      time: ['Quick fixes', 'Long-term improvements'],
      priority: ['High priority items', 'Medium priority items'],
      family: ['Family-friendly suggestions', 'Child-safe recommendations']
    };
  }
}

module.exports = new MLService();
