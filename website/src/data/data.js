export const CITIES = {
    // Western
    'Vancouver': { lat: 49.282729, lon: -123.120738, name: 'Vancouver', region: 'Western' },
    'Seattle': { lat: 47.595152, lon: -122.331639, name: 'Seattle', region: 'Western' },
    'Santa_Clara': { lat: 37.403000, lon: -121.970000, name: 'San Francisco', region: 'Western' },
    'Inglewood': { lat: 33.953300, lon: -118.338700, name: 'Los Angeles', region: 'Western' },
    
    // Central
    'Guadalajara': { lat: 20.659698, lon: -103.349609, name: 'Guadalajara', region: 'Central' },
    'Mexico_City': { lat: 19.432608, lon: -99.133209, name: 'Mexico City', region: 'Central' },
    'Monterrey': { lat: 25.686613, lon: -100.316116, name: 'Monterrey', region: 'Central' },
    'Houston': { lat: 29.684700, lon: -95.410700, name: 'Houston', region: 'Central' },
    'Arlington': { lat: 32.747300, lon: -97.094500, name: 'Dallas', region: 'Central' },
    'Kansas_City': { lat: 39.048900, lon: -94.483900, name: 'Kansas City', region: 'Central' },
    
    // Eastern
    'Atlanta': { lat: 33.755000, lon: -84.401000, name: 'Atlanta', region: 'Eastern' },
    'Miami_Gardens': { lat: 25.958000, lon: -80.238900, name: 'Miami', region: 'Eastern' },
    'Toronto': { lat: 43.651070, lon: -79.347015, name: 'Toronto', region: 'Eastern' },
    'Foxborough': { lat: 42.090900, lon: -71.264300, name: 'Boston', region: 'Eastern' },
    'Philadelphia': { lat: 39.900800, lon: -75.167500, name: 'Philadelphia', region: 'Eastern' },
    'East_Rutherford': { lat: 40.813600, lon: -74.074500, name: 'New York/NJ', region: 'Eastern' }
};


export const DATES = [
    '2026-06-11', '2026-06-12', '2026-06-13', '2026-06-14', '2026-06-15', '2026-06-16',
    '2026-06-17', '2026-06-18', '2026-06-19', '2026-06-20', '2026-06-21', '2026-06-22',
    '2026-06-23', '2026-06-24', '2026-06-25', '2026-06-26', '2026-06-27'
];


export const GROUPS = {
    'A': 'bg-[#9cd267] text-black',
    'B': 'bg-[#f32e2e] text-white',
    'C': 'bg-[#fced84] text-black',
    'D': 'bg-[#006ebd] text-white',
    'E': 'bg-[#f47920] text-white',
    'F': 'bg-[#007751] text-white',
    'G': 'bg-[#c0c4e7] text-black',
    'H': 'bg-[#6cc2bd] text-black',
    'I': 'bg-[#483a8b] text-white',
    'J': 'bg-[#ffb4b9] text-black',
    'K': 'bg-[#f93591] text-white',
    'L': 'bg-[#8a1538] text-white',
};


export const REGIONS = {
    'Western': { color: '#6bcbc0', label: 'WESTERN REGION' }, // Teal
    'Central': { color: '#9cd267', label: 'CENTRAL REGION' }, // Green
    'Eastern': { color: '#fa9d8d', label: 'EASTERN REGION' }  // Salmon
};


export const FLAG_CODES = {
    'ARG': 'ar', 'AUS': 'au', 'AUT': 'at', 'BEL': 'be', 'BOL': 'bo',
    'BRA': 'br', 'CAN': 'ca', 'CIV': 'ci', 'COD': 'cd', 'COL': 'co',
    'CPV': 'cv', 'CRC': 'cr', 'CRO': 'hr', 'CUW': 'cw', 'DEN': 'dk',
    'ECU': 'ec', 'EGY': 'eg', 'ENG': 'gb-eng', 'ESP': 'es', 'FRA': 'fr',
    'GER': 'de', 'GHA': 'gh', 'HAI': 'ht', 'IRN': 'ir', 'IRQ': 'iq',
    'ITA': 'it', 'JAM': 'jm', 'JOR': 'jo', 'JPN': 'jp', 'KDR': 'kp',
    'KOR': 'kr', 'KSA': 'sa', 'MAR': 'ma', 'MEX': 'mx', 'NCL': 'nc',
    'NED': 'nl', 'NIR': 'gb-nir', 'NOR': 'no', 'NZL': 'nz', 'PAN': 'pa',
    'PAR': 'py', 'POL': 'pl', 'POR': 'pt', 'QAT': 'qa', 'RSA': 'za',
    'SCO': 'gb-sct', 'SEN': 'sn', 'SOL': 'sb', 'SUI': 'ch', 'SUR': 'sr',
    'SWE': 'se', 'TUN': 'tn', 'TUR': 'tr', 'UKR': 'ua', 'URU': 'uy',
    'USA': 'us', 'UZB': 'uz', 'WAL': 'gb-wls', 'ALG': 'dz', 'ROU': 'ro',
    'SVK': 'sk', 'KOS': 'xk', 'BIH': 'ba', 'MKD': 'mk', 'CZE': 'cz',
    'IRL': 'ie', 'ALB': 'al'
};

export const FLAG_CUSTOM_SRCS = {
    'IRN': 'website/assets/images/flags/iran.svg'
};

// Full country names keyed by FIFA 3-letter code
export const TEAM_NAMES = {
    'ALB': 'Albania',       'ALG': 'Algeria',       'ARG': 'Argentina',
    'AUS': 'Australia',     'AUT': 'Austria',       'BEL': 'Belgium',
    'BIH': 'Bosnia & Herz.','BOL': 'Bolivia',       'BRA': 'Brazil',
    'CAN': 'Canada',        'CIV': 'Ivory Coast',   'COD': 'DR Congo',
    'COL': 'Colombia',      'CPV': 'Cape Verde',    'CRC': 'Costa Rica',
    'CRO': 'Croatia',       'CUW': 'Curaçao',       'CZE': 'Czech Republic',
    'DEN': 'Denmark',       'ECU': 'Ecuador',       'EGY': 'Egypt',
    'ENG': 'England',       'ESP': 'Spain',         'FRA': 'France',
    'GER': 'Germany',       'GHA': 'Ghana',         'HAI': 'Haiti',
    'IRL': 'Ireland',       'IRN': 'Iran',          'IRQ': 'Iraq',
    'ITA': 'Italy',         'JAM': 'Jamaica',       'JOR': 'Jordan',
    'JPN': 'Japan',         'KDR': 'North Korea',   'KOR': 'South Korea',
    'KOS': 'Kosovo',        'KSA': 'Saudi Arabia',  'MAR': 'Morocco',
    'MEX': 'Mexico',        'MKD': 'N. Macedonia',  'NCL': 'New Caledonia',
    'NED': 'Netherlands',   'NIR': 'N. Ireland',    'NOR': 'Norway',
    'NZL': 'New Zealand',   'PAN': 'Panama',        'PAR': 'Paraguay',
    'POL': 'Poland',        'POR': 'Portugal',      'QAT': 'Qatar',
    'ROU': 'Romania',       'RSA': 'South Africa',  'SCO': 'Scotland',
    'SEN': 'Senegal',       'SVK': 'Slovakia',      'SOL': 'Solomon Islands',
    'SUI': 'Switzerland',   'SUR': 'Suriname',      'SWE': 'Sweden',
    'TUN': 'Tunisia',       'TUR': 'Turkey',        'UKR': 'Ukraine',
    'URU': 'Uruguay',       'USA': 'United States', 'UZB': 'Uzbekistan',
    'WAL': 'Wales',
};

// Official kick-off times (UTC HH:MM) for each match, keyed by match ID.
// Based on the official FIFA 2026 Group Stage schedule.
// Jun 11-12: 2 matches/day. Jun 13-23: 4 matches/day. Jun 24-27: 6 matches/day (simultaneous pairs).
export const MATCH_TIMES_UTC = {
    // Jun 11
    'm1': '19:00', 
    'm2': '02:00', // ⚠️ Next Day UTC

    // Jun 12
    'm3': '19:00', 
    'm4': '01:00', // ⚠️ Next Day UTC

    // Jun 13
    'm5': '01:00', // ⚠️ Next Day UTC
    'm6': '04:00', // ⚠️ Next Day UTC
    'm7': '22:00', 
    'm8': '19:00', 

    // Jun 14
    'm9': '23:00', 
    'm10': '17:00', 
    'm11': '20:00', 
    'm12': '02:00', // ⚠️ Next Day UTC

    // Jun 15
    'm13': '22:00', 
    'm14': '16:00', 
    'm15': '01:00', // ⚠️ Next Day UTC
    'm16': '19:00', 

    // Jun 16
    'm17': '19:00', 
    'm18': '22:00', 
    'm19': '01:00', // ⚠️ Next Day UTC
    'm20': '04:00', // ⚠️ Next Day UTC

    // Jun 17
    'm21': '23:00', 
    'm22': '20:00', 
    'm23': '17:00', 
    'm24': '02:00', // ⚠️ Next Day UTC

    // Jun 18
    'm25': '16:00', 
    'm26': '19:00', 
    'm27': '22:00', 
    'm28': '01:00', // ⚠️ Next Day UTC

    // Jun 19
    'm29': '00:30', // ⚠️ Next Day UTC
    'm30': '22:00', 
    'm31': '03:00', // ⚠️ Next Day UTC
    'm32': '19:00', 

    // Jun 20
    'm33': '20:00', 
    'm34': '00:00', // ⚠️ Next Day UTC
    'm35': '17:00', 
    'm36': '04:00', // ⚠️ Next Day UTC

    // Jun 21
    'm37': '22:00', 
    'm38': '16:00', 
    'm39': '19:00', 
    'm40': '01:00', // ⚠️ Next Day UTC

    // Jun 22
    'm41': '00:00', // ⚠️ Next Day UTC
    'm42': '21:00', 
    'm43': '17:00', 
    'm44': '03:00', // ⚠️ Next Day UTC

    // Jun 23
    'm45': '20:00', 
    'm46': '23:00', 
    'm47': '17:00', 
    'm48': '02:00', // ⚠️ Next Day UTC

    // Jun 24 – simultaneous pairs 
    'm49': '22:00', 
    'm50': '22:00', 
    'm51': '19:00', 
    'm52': '19:00', 
    'm53': '01:00', // ⚠️ Next Day UTC
    'm54': '01:00', // ⚠️ Next Day UTC

    // Jun 25 – simultaneous pairs
    'm55': '20:00', 
    'm56': '20:00', 
    'm57': '23:00', 
    'm58': '23:00', 
    'm59': '02:00', // ⚠️ Next Day UTC
    'm60': '02:00', // ⚠️ Next Day UTC

    // Jun 26 – simultaneous pairs 
    'm61': '19:00', 
    'm62': '19:00', 
    'm63': '03:00', // ⚠️ Next Day UTC
    'm64': '03:00', // ⚠️ Next Day UTC
    'm65': '00:00', // ⚠️ Next Day UTC
    'm66': '00:00', // ⚠️ Next Day UTC

    // Jun 27 – simultaneous pairs
    'm67': '21:00', 
    'm68': '21:00', 
    'm69': '02:00', // ⚠️ Next Day UTC
    'm70': '02:00', // ⚠️ Next Day UTC
    'm71': '23:30',
    'm72': '23:30',
};