// contentScript.js
// Einfache Content-Skript für kinderfreundliches Filtern von problematischen Begriffen

/**
 * Konfigurierbare Filterstufe:
 *  - "low": nur hartes Filtern
 *  - "medium": erweitert um zusätzliche Begriffe
 *  - "high": semantischere und umfassendere Liste
 */
const filterLevel = "medium";  // Ändere auf "low" | "medium" | "high"

// Begriffslisten je nach Filterstufe
const filterLists = {
	low: ["kill", "blood"],
	medium: ["kill", "blood", "drugs"],
	high: ["kill", "blood", "drugs", "violence", "sex"]
};

// Aktive Blacklist ermitteln
const blacklist = filterLists[filterLevel] || [];
// RegEx für Wortgrenzen (case-insensitive)
const pattern = new RegExp(`\\b(${blacklist.join("|")})\\b`, "gi");

// CSS für Hervorhebung & Tooltip injizieren
const style = document.createElement("style");
style.textContent = `
.csa-filter {
  background-color: rgba(255, 255, 0, 0.4);
  border-radius: 2px;
  cursor: help;
}
`;
document.head.appendChild(style);

/**
 * Scannt Textknoten unter dem angegebenen Root und ersetzt Treffer
 */
function scanAndReplace(root = document.body) {
	const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
	let node;
	const nodesToReplace = [];

	// Textknoten sammeln, die Treffer enthalten
	while ((node = walker.nextNode())) {
		const text = node.nodeValue;
		if (!text.trim()) continue;
		if (pattern.test(text)) {
			nodesToReplace.push(node);
		}
	}

	// Ersetzungen durchführen
	nodesToReplace.forEach(textNode => {
		const parent = textNode.parentNode;
		// Vermeide doppelte Ersetzungen
		if (parent.classList && parent.classList.contains("csa-filter")) return;

		// Span-Container für gemischten HTML-Content
		const wrapper = document.createElement("span");
		// Ersetze jeden Treffer durch ein ⚠️-Icon mit Tooltip
		wrapper.innerHTML = textNode.nodeValue.replace(pattern, match => {
			return `<span class="csa-filter" title="${match}">⚠️</span>`;
		});
		parent.replaceChild(wrapper, textNode);
	});
}

// Erster Durchlauf beim Laden
scanAndReplace();

// Bonus: Beobachter für dynamisch nachgeladene Inhalte (z.B. AJAX)
const observer = new MutationObserver(mutations => {
	mutations.forEach(mutation => {
		mutation.addedNodes.forEach(node => {
			if (node.nodeType === Node.ELEMENT_NODE) {
				scanAndReplace(node);
			}
		});
	});
});
observer.observe(document.body, { childList: true, subtree: true });
