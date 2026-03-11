import { CITIES } from '../data/data.js';


export class Calculator {
    static calculateDistance(city1, city2) {
        if (!CITIES[city1] || !CITIES[city2]) return 0;
        if (city1 === city2) return 0;

        const R = 3958.8; 
        const dLat = (CITIES[city2].lat - CITIES[city1].lat) * (Math.PI / 180);
        const dLon = (CITIES[city2].lon - CITIES[city1].lon) * (Math.PI / 180);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(CITIES[city1].lat * (Math.PI / 180)) * Math.cos(CITIES[city2].lat * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }


    static calculateTotalDistance(data) {
        const teamPaths = {};
        const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
        sorted.forEach(match => {
            [match.t1, match.t2].forEach(team => {
                if (!teamPaths[team]) teamPaths[team] = [];
                teamPaths[team].push(match.city);
            });
        });
        let totalDistance = 0;
        Object.values(teamPaths).forEach(cities => {
            for (let i = 0; i < cities.length - 1; i++) {
                totalDistance += Calculator.calculateDistance(cities[i], cities[i+1]);
            }
        });
        return totalDistance;
    }


    static calculateRegionCrossings(data) {
        const teamPaths = {};
        const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
        
        sorted.forEach(match => {
            [match.t1, match.t2].forEach(team => {
                if (!teamPaths[team]) teamPaths[team] = [];
                teamPaths[team].push(match.city);
            });
        });

        let totalCrossings = 0;
        Object.values(teamPaths).forEach(cities => {
            for (let i = 0; i < cities.length - 1; i++) {
                if (CITIES[cities[i]] && CITIES[cities[i+1]]) {
                    const region1 = CITIES[cities[i]].region;
                    const region2 = CITIES[cities[i+1]].region;
                    if (region1 !== region2) totalCrossings++;
                }
            }
        });
        return totalCrossings;
    }
}