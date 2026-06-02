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
    'm1': '19:00', 'm2': '22:00',
    // Jun 12
    'm3': '19:00', 'm4': '22:00',
    // Jun 13
    'm5': '16:00', 'm6': '16:00', 'm7': '19:00', 'm8': '22:00',
    // Jun 14
    'm9': '16:00', 'm10': '16:00', 'm11': '19:00', 'm12': '22:00',
    // Jun 15
    'm13': '16:00', 'm14': '16:00', 'm15': '19:00', 'm16': '22:00',
    // Jun 16
    'm17': '16:00', 'm18': '16:00', 'm19': '19:00', 'm20': '22:00',
    // Jun 17
    'm21': '16:00', 'm22': '16:00', 'm23': '19:00', 'm24': '22:00',
    // Jun 18
    'm25': '16:00', 'm26': '16:00', 'm27': '19:00', 'm28': '22:00',
    // Jun 19
    'm29': '16:00', 'm30': '16:00', 'm31': '19:00', 'm32': '22:00',
    // Jun 20
    'm33': '16:00', 'm34': '16:00', 'm35': '19:00', 'm36': '22:00',
    // Jun 21
    'm37': '16:00', 'm38': '16:00', 'm39': '19:00', 'm40': '22:00',
    // Jun 22
    'm41': '16:00', 'm42': '16:00', 'm43': '19:00', 'm44': '22:00',
    // Jun 23
    'm45': '16:00', 'm46': '16:00', 'm47': '19:00', 'm48': '22:00',
    // Jun 24 – simultaneous pairs (last matches of groups A-D)
    'm49': '16:00', 'm50': '16:00', 'm51': '18:00', 'm52': '18:00', 'm53': '22:00', 'm54': '22:00',
    // Jun 25 – simultaneous pairs (groups E-H)
    'm55': '16:00', 'm56': '16:00', 'm57': '18:00', 'm58': '18:00', 'm59': '22:00', 'm60': '22:00',
    // Jun 26 – simultaneous pairs (groups I-L first)
    'm61': '16:00', 'm62': '16:00', 'm63': '19:00', 'm64': '19:00', 'm65': '22:00', 'm66': '22:00',
    // Jun 27 – simultaneous pairs (groups I-L last)
    'm67': '16:00', 'm68': '16:00', 'm69': '19:00', 'm70': '19:00', 'm71': '22:00', 'm72': '22:00',
};