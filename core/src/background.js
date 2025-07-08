// // ===== background.js =====
// // Service Worker: holt Blacklist von OpenAI API
// const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// // console.log(OPENAI_API_KEY);
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
// 	if (message.action === 'fetchBlacklist') {
// 		fetch('https://api.openai.com/v1/completions', {
// 			method: 'POST',
// 			headers: {
// 				'Content-Type': 'application/json',
// 				'Authorization': `Bearer ${OPENAI_API_KEY}`
// 			},
// 			body: JSON.stringify({
// 				model: 'text-davinci-003',
// 				prompt: 'Gib mir eine durch Kommas getrennte Liste problematischer Begriffe (Gewalt, Drogen, Sexualität).',
// 				max_tokens: 60,
// 				temperature: 0.2
// 			})
// 		})
// 			.then(res => res.json())
// 			.then(data => {
// 				const text = data.choices?.[0]?.text || '';
// 				const words = text.split(',').map(w => w.trim().toLowerCase()).filter(Boolean);
// 				console.log(words);
// 				sendResponse({ words });
// 			})
// 			.catch(err => {
// 				console.error('[ChildSafeNow] API error', err);
// 				sendResponse({ error: err.toString() });
// 			});
// 		return true; // async
// 	}
// });

// src/background.js

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action === 'fetchBlacklist') {
		fetch('https://api.openai.com/v1/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${OPENAI_API_KEY}`
			},
			body: JSON.stringify({
				model: 'text-davinci-003',
				prompt: 'Liste problematischer Begriffe durch Komma getrennt:',
				max_tokens: 60,
				temperature: 0.2
			})
		})
			.then(r => r.json())
			.then(data => {
				const text = data.choices?.[0]?.text || '';
				const words = text.split(',')
					.map(w => w.trim().toLowerCase())
					.filter(Boolean);
				sendResponse({ words });
			})
			.catch(err => {
				console.error('[ChildSafeNow] API error', err);
				sendResponse({ error: err.message });
			});
		return true; // signalisiert async sendResponse
	}
});
