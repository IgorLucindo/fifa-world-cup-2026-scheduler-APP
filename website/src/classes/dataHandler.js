import { CITIES, DATES } from '../data/data.js';


export class DataHandler {
    static async loadSchedule(url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ${url}`);
        const text = await response.text();
        return DataHandler.parseCSV(text);
    }


    static parseCSV(csvText) {
        const lines = csvText.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim()); 
        const matches = [];

        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            const row = lines[i].split(',');
            const cityKey = row[0].trim();
            if (!CITIES[cityKey]) continue; 

            for (let j = 1; j < row.length; j++) {
                const cellContent = row[j] ? row[j].trim() : '';
                const date = headers[j];
                if (cellContent && date) {
                    const matchRegex = /m(\d+)\s*\(([A-Z])\d*\):\s*(.*)\s*vs\s*(.*)/i;
                    const parsed = cellContent.match(matchRegex);
                    if (parsed) {
                        matches.push({
                            id: `m${parsed[1]}`,
                            group: parsed[2],
                            t1: parsed[3].trim(),
                            t2: parsed[4].trim(),
                            city: cityKey,
                            date: date
                        });
                    }
                }
            }
        }
        return matches;
    }


    static getCSVString(data) {
        const header = ['City', ...DATES].join(',');
        
        const rows = Object.keys(CITIES).map(cityKey => {
            const row = [cityKey];
            DATES.forEach(date => {
                const match = data.find(m => m.city === cityKey && m.date === date);
                if (match) {
                    const idStr = match.id.replace('m', '');
                    row.push(`"m${idStr} (${match.group}): ${match.t1} vs ${match.t2}"`);
                } else {
                    row.push('');
                }
            });
            return row.join(',');
        });

        return [header, ...rows].join('\n');
    }


    static triggerFileDownload(blob, filename) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        
        if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            link.target = '_blank';
        }

        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 100);
    }


    static exportToCSV(data, filename) {
        const csvContent = DataHandler.getCSVString(data);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        DataHandler.triggerFileDownload(blob, filename);
    }


    static downloadAll(app) {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 640;

        if (isMobile) {
            let filename = 'fifa_schedule.csv';
            if (app.currentMode === 'official') filename = 'official_schedule.csv';
            else if (app.currentMode === 'optimal') filename = 'mip_schedule.csv';
            else if (app.currentMode === 'custom') filename = 'your_schedule.csv';

            const csvContent = DataHandler.getCSVString(app.scheduleData);
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            DataHandler.triggerFileDownload(blob, filename);
        } else {
            DataHandler.exportToCSV(app.officialData, 'official_schedule.csv');
            setTimeout(() => DataHandler.exportToCSV(app.optimalData, 'mip_schedule.csv'), 300);
            
            if (app.customData) {
                setTimeout(() => DataHandler.exportToCSV(app.customData, 'your_schedule.csv'), 600);
            }
        }
    }
}