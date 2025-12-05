// Mapped to match the CSV city names (keys) to display names and coords
export const CITIES = {
    'Vancouver': { lat: 49.2827, lon: -123.1207, name: 'Vancouver' },
    'Seattle': { lat: 47.6062, lon: -122.3321, name: 'Seattle' },
    'Santa_Clara': { lat: 37.4030, lon: -121.9698, name: 'San Francisco' },
    'Inglewood': { lat: 33.9583, lon: -118.3398, name: 'Los Angeles' },
    'Guadalajara': { lat: 20.6597, lon: -103.3496, name: 'Guadalajara' },
    'Mexico_City': { lat: 19.4326, lon: -99.1332, name: 'Mexico City' },
    'Monterrey': { lat: 25.6866, lon: -100.3161, name: 'Monterrey' },
    'Houston': { lat: 29.7604, lon: -95.3698, name: 'Houston' },
    'Arlington': { lat: 32.7357, lon: -97.1081, name: 'Dallas' },
    'Kansas_City': { lat: 39.0997, lon: -94.5786, name: 'Kansas City' },
    'Atlanta': { lat: 33.7490, lon: -84.3880, name: 'Atlanta' },
    'Miami_Gardens': { lat: 25.9580, lon: -80.2389, name: 'Miami' },
    'Toronto': { lat: 43.6532, lon: -79.3832, name: 'Toronto' },
    'Foxborough': { lat: 42.0909, lon: -71.2643, name: 'Boston' },
    'Philadelphia': { lat: 39.9526, lon: -75.1652, name: 'Philadelphia' },
    'East_Rutherford': { lat: 40.8128, lon: -74.0742, name: 'New York/NJ' },
};

export const DATES = [
    '2026-06-11', '2026-06-12', '2026-06-13', '2026-06-14', '2026-06-15', '2026-06-16',
    '2026-06-17', '2026-06-18', '2026-06-19', '2026-06-20', '2026-06-21', '2026-06-22',
    '2026-06-23', '2026-06-24', '2026-06-25', '2026-06-26', '2026-06-27'
];

export const GROUPS = {
    'A': 'bg-red-500 text-white',
    'B': 'bg-blue-500 text-white',
    'C': 'bg-green-500 text-white',
    'D': 'bg-yellow-500 text-black',
    'E': 'bg-purple-500 text-white',
    'F': 'bg-pink-500 text-white',
    'G': 'bg-indigo-500 text-white',
    'H': 'bg-orange-500 text-white',
    'I': 'bg-teal-500 text-white',
    'J': 'bg-cyan-500 text-black',
    'K': 'bg-lime-600 text-white',
    'L': 'bg-rose-500 text-white',
};