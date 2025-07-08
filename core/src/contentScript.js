const API_KEY= process.env.OPENAI_API_KEY;

(async function moderateAndBlurPage() {
	let text = document.body.innerText.replace(/[\n\r\t]+/g, ' ').replace(/\s+/g, ' ').trim();

	if (!text || text.length < 20) return;

	try {
		const response = await fetch('https://api.openai.com/v1/moderations', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${API_KEY}`,
			},
			body: JSON.stringify({
				model: "omni-moderation-latest",
				input: text
			}),
		});

		const data = await response.json();

		if (data.results?.[0]?.flagged) {
			console.log('⚠️ Page content flagged by moderation API.');

			document.body.style.filter = 'blur(8px)';
			document.body.style.pointerEvents = 'none';

			const overlay = document.createElement('div');
			overlay.textContent = 'This content is restricted due to policy violations.';
			Object.assign(overlay.style, {
				position: 'fixed',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				backgroundColor: 'rgba(0,0,0,0.8)',
				color: 'white',
				fontSize: '24px',
				padding: '20px',
				borderRadius: '8px',
				zIndex: 9999,
				pointerEvents: 'auto',
			});
			document.body.appendChild(overlay);
		} else {
			console.log('✅ Page is clean.');
		}
	} catch (err) {
		console.error('❌ Moderation API error:', err);
	}
})();
