export class Validator {
    static validateAllConstraints(tempSchedule, optimalData) {
        const violations = [];
        const matchViolations = new Set();

        const addViolation = (ids, msg) => {
            violations.push({ ids, msg });
            ids.forEach(id => matchViolations.add(id));
        };

        const getDayDiff = (d1, d2) => Math.abs((new Date(d2) - new Date(d1)) / 86400000);

        const FIXED_OPENING_DATES = ['2026-06-11', '2026-06-12'];
        const HOST_OPENING_VENUES = {
            'MEX': { date: '2026-06-11', city: 'Mexico_City', display: 'Mexico City' },
            'CAN': { date: '2026-06-12', city: 'Toronto', display: 'Toronto' },
            'USA': { date: '2026-06-12', city: 'Inglewood', display: 'Los Angeles (Inglewood)' }
        };

        for (const team of ['MEX', 'CAN', 'USA']) {
            const opener = HOST_OPENING_VENUES[team];
            const match = tempSchedule.find(m => (m.t1 === team || m.t2 === team) && m.date === opener.date);
            if (match && match.city !== opener.city) {
                addViolation([match.id], `${team}'s opening match is fixed to ${opener.display}.`);
            }
        }

        tempSchedule.forEach(m => {
            const originalMatch = optimalData.find(om => om.id === m.id);
            if (originalMatch && FIXED_OPENING_DATES.includes(m.date) && originalMatch.date !== m.date) {
                addViolation([m.id], `Matches cannot be moved to opening dates (${m.date}).`);
            }
        });

        const dateGroups = {};
        tempSchedule.forEach(m => { if(!dateGroups[m.date]) dateGroups[m.date] = []; dateGroups[m.date].push(m); });
        for (const [date, matches] of Object.entries(dateGroups)) {
            const isRound3 = new Date(date) >= new Date('2026-06-24');
            const maxMatches = isRound3 ? 6 : 4;
            if (matches.length > maxMatches) {
                addViolation(matches.map(m => m.id), `Exceeded daily limit on ${date} (Max ${maxMatches}, has ${matches.length}).`);
            }
        }

        const cityGroups = {};
        tempSchedule.forEach(m => { if(!cityGroups[m.city]) cityGroups[m.city] = []; cityGroups[m.city].push(m); });
        for (const [city, matches] of Object.entries(cityGroups)) {
            if (matches.length < 3 || matches.length > 6) {
                addViolation(matches.map(m=>m.id), `Venue Load: ${city.replace('_', ' ')} has ${matches.length} matches (Allowed: 3 to 6).`);
            }

            matches.sort((a,b) => new Date(a.date) - new Date(b.date));
            for (let i = 0; i < matches.length - 1; i++) {
                if (getDayDiff(matches[i].date, matches[i+1].date) < 2) {
                    addViolation([matches[i].id, matches[i+1].id], `Stadium ${city.replace('_', ' ')} needs a rest day between ${matches[i].date} & ${matches[i+1].date}.`);
                }
            }
        }

        const teamGroups = {};
        tempSchedule.forEach(m => {
            [m.t1, m.t2].forEach(team => {
                team.split('/').forEach(t => {
                    const tTrim = t.trim();
                    if (!teamGroups[tTrim]) teamGroups[tTrim] = [];
                    teamGroups[tTrim].push(m);
                });
            });
        });
        
        for (const [team, matches] of Object.entries(teamGroups)) {
            matches.sort((a,b) => new Date(a.date) - new Date(b.date));
            for (let i = 0; i < matches.length - 1; i++) {
                if (getDayDiff(matches[i].date, matches[i+1].date) < 4) {
                    addViolation([matches[i].id, matches[i+1].id], `${team} plays too soon between ${matches[i].date} & ${matches[i+1].date} (Min 3 rest days).`);
                }
            }
        }

        return { violations, matchViolations };
    }
}