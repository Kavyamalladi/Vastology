const axios = require('axios');

class MapsService {
  constructor() {
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY;
    this.baseUrl = 'https://maps.googleapis.com/maps/api';
  }

  // Get surroundings information from Google Maps
  async getSurroundings(latitude, longitude, radius = 2000) {
    try {
      const places = await this.getNearbyPlaces(latitude, longitude, radius);
      const elevation = await this.getElevation(latitude, longitude);
      const geocoding = await this.getReverseGeocoding(latitude, longitude);
      
      return {
        places: places,
        elevation: elevation,
        address: geocoding,
        analysis: this.analyzeSurroundings(places, elevation)
      };
    } catch (error) {
      console.error('Maps service error:', error);
      throw new Error('Failed to fetch surroundings data');
    }
  }

  // Get nearby places using Google Places API
  async getNearbyPlaces(latitude, longitude, radius) {
    const types = [
      'water', 'park', 'school', 'hospital', 'shopping_mall', 
      'restaurant', 'gas_station', 'bank', 'church', 'mosque',
      'temple', 'cemetery', 'airport', 'train_station', 'bus_station'
    ];

    const allPlaces = [];

    for (const type of types) {
      try {
        const response = await axios.get(`${this.baseUrl}/place/nearbysearch/json`, {
          params: {
            location: `${latitude},${longitude}`,
            radius: radius,
            type: type,
            key: this.apiKey
          }
        });

        if (response.data.results) {
          allPlaces.push(...response.data.results.map(place => ({
            name: place.name,
            type: type,
            distance: place.distance || this.calculateDistance(latitude, longitude, place.geometry.location.lat, place.geometry.location.lng),
            rating: place.rating,
            vicinity: place.vicinity,
            geometry: place.geometry
          })));
        }
      } catch (error) {
        console.error(`Error fetching ${type} places:`, error);
      }
    }

    return allPlaces;
  }

  // Get elevation data
  async getElevation(latitude, longitude) {
    try {
      const response = await axios.get(`${this.baseUrl}/elevation/json`, {
        params: {
          locations: `${latitude},${longitude}`,
          key: this.apiKey
        }
      });

      return response.data.results[0]?.elevation || 0;
    } catch (error) {
      console.error('Elevation service error:', error);
      return 0;
    }
  }

  // Get reverse geocoding information
  async getReverseGeocoding(latitude, longitude) {
    try {
      const response = await axios.get(`${this.baseUrl}/geocode/json`, {
        params: {
          latlng: `${latitude},${longitude}`,
          key: this.apiKey
        }
      });

      const result = response.data.results[0];
      return {
        formatted_address: result.formatted_address,
        address_components: result.address_components,
        place_id: result.place_id
      };
    } catch (error) {
      console.error('Geocoding service error:', error);
      return null;
    }
  }

  // Analyze surroundings for Vastu compliance
  analyzeSurroundings(places, elevation) {
    const analysis = {
      positiveElements: [],
      negativeElements: [],
      recommendations: [],
      vastuScore: 0,
      directionalAnalysis: {}
    };

    // Analyze water bodies
    const waterBodies = places.filter(place => place.type === 'water');
    if (waterBodies.length > 0) {
      analysis.positiveElements.push('Water bodies nearby - good for prosperity');
      analysis.vastuScore += 10;
    }

    // Analyze parks and green spaces
    const parks = places.filter(place => place.type === 'park');
    if (parks.length > 0) {
      analysis.positiveElements.push('Green spaces nearby - good for health');
      analysis.vastuScore += 8;
    }

    // Analyze schools and educational institutions
    const schools = places.filter(place => place.type === 'school');
    if (schools.length > 0) {
      analysis.positiveElements.push('Educational institutions nearby - good for learning');
      analysis.vastuScore += 5;
    }

    // Analyze hospitals
    const hospitals = places.filter(place => place.type === 'hospital');
    if (hospitals.length > 0) {
      analysis.positiveElements.push('Healthcare facilities nearby - good for health');
      analysis.vastuScore += 7;
    }

    // Analyze negative elements
    const cemeteries = places.filter(place => place.type === 'cemetery');
    if (cemeteries.length > 0) {
      analysis.negativeElements.push('Cemetery nearby - may affect energy');
      analysis.vastuScore -= 15;
    }

    const airports = places.filter(place => place.type === 'airport');
    if (airports.length > 0) {
      analysis.negativeElements.push('Airport nearby - noise and disturbance');
      analysis.vastuScore -= 10;
    }

    // Generate recommendations
    if (analysis.negativeElements.length > 0) {
      analysis.recommendations.push('Consider planting trees to block negative energy');
      analysis.recommendations.push('Use Vastu remedies to neutralize negative influences');
    }

    if (analysis.positiveElements.length > 0) {
      analysis.recommendations.push('Enhance positive energy flow from beneficial directions');
      analysis.recommendations.push('Use specific colors and elements to amplify positive influences');
    }

    // Directional analysis based on surroundings
    analysis.directionalAnalysis = this.analyzeDirections(places);

    return analysis;
  }

  // Analyze directions based on surrounding elements
  analyzeDirections(places) {
    const directions = {
      north: { score: 0, elements: [] },
      south: { score: 0, elements: [] },
      east: { score: 0, elements: [] },
      west: { score: 0, elements: [] },
      northeast: { score: 0, elements: [] },
      northwest: { score: 0, elements: [] },
      southeast: { score: 0, elements: [] },
      southwest: { score: 0, elements: [] }
    };

    places.forEach(place => {
      const direction = this.getDirectionFromPlace(place);
      if (direction && directions[direction]) {
        directions[direction].elements.push(place.name);
        
        // Score based on element type
        if (place.type === 'water') {
          directions[direction].score += 10;
        } else if (place.type === 'park') {
          directions[direction].score += 8;
        } else if (place.type === 'school') {
          directions[direction].score += 5;
        } else if (place.type === 'hospital') {
          directions[direction].score += 7;
        } else if (place.type === 'cemetery') {
          directions[direction].score -= 15;
        } else if (place.type === 'airport') {
          directions[direction].score -= 10;
        }
      }
    });

    return directions;
  }

  // Get direction from place location (simplified)
  getDirectionFromPlace(place) {
    // This is a simplified version - in reality, you'd calculate the actual direction
    // based on the place's coordinates relative to the property
    const directions = ['north', 'south', 'east', 'west', 'northeast', 'northwest', 'southeast', 'southwest'];
    return directions[Math.floor(Math.random() * directions.length)];
  }

  // Calculate distance between two points
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in kilometers
    return d;
  }

  deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  // Get property orientation based on surroundings
  getPropertyOrientation(latitude, longitude, surroundings) {
    const orientation = {
      primaryDirection: 'north',
      secondaryDirection: 'east',
      orientationScore: 85,
      recommendations: []
    };

    // Analyze based on surrounding elements
    if (surroundings.analysis.positiveElements.includes('Water bodies nearby')) {
      orientation.recommendations.push('Main entrance should face north for prosperity');
    }

    if (surroundings.analysis.positiveElements.includes('Green spaces nearby')) {
      orientation.recommendations.push('Kitchen in southeast for health');
    }

    return orientation;
  }

  // Get detailed place information
  async getPlaceDetails(placeId) {
    try {
      const response = await axios.get(`${this.baseUrl}/place/details/json`, {
        params: {
          place_id: placeId,
          fields: 'name,rating,formatted_phone_number,website,opening_hours,reviews',
          key: this.apiKey
        }
      });

      return response.data.result;
    } catch (error) {
      console.error('Place details service error:', error);
      return null;
    }
  }

  // Get directions between two points
  async getDirections(origin, destination, mode = 'driving') {
    try {
      const response = await axios.get(`${this.baseUrl}/directions/json`, {
        params: {
          origin: origin,
          destination: destination,
          mode: mode,
          key: this.apiKey
        }
      });

      return response.data;
    } catch (error) {
      console.error('Directions service error:', error);
      return null;
    }
  }

  // Get traffic information
  async getTrafficInfo(latitude, longitude) {
    try {
      const response = await axios.get(`${this.baseUrl}/roads/nearestRoads`, {
        params: {
          points: `${latitude},${longitude}`,
          key: this.apiKey
        }
      });

      return response.data;
    } catch (error) {
      console.error('Traffic service error:', error);
      return null;
    }
  }

  // Get weather information (if needed for Vastu analysis)
  async getWeatherInfo(latitude, longitude) {
    try {
      // This would integrate with a weather API
      return {
        temperature: 25,
        humidity: 60,
        windDirection: 'north',
        conditions: 'clear'
      };
    } catch (error) {
      console.error('Weather service error:', error);
      return null;
    }
  }
}

module.exports = new MapsService();
