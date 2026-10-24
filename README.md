# 🔍 GDG Algiers - Performant Auto-Completion Search Box

A fast, lightweight, and responsive client-side auto-completion search box built with vanilla JavaScript, HTML5, and CSS3 for the **GDG Algiers** selection process.

---

## 🔗 Live Demo
You can test the application live here:
👉 
https://pmchaib-code.github.io/Auto-complete-search-/
---

## ✨ Features

- **⚡ Fast Client-Side Search:** High-performance filtering with debouncing (`200ms`) to minimize render latency.
- **🎯 Mid-Word Matching:** Finds matches anywhere within the text (e.g., typing `land` matches `Iceland`, `Ireland`, `Switzerland`).
- **🔤 Diacritics & Special Character Normalization:** 
  - Handles accents seamlessly (e.g., typing `cote` or `côte` finds `côte d'ivoire`).
  - Ignores apostrophes and punctuation differences during comparison (e.g., `cote divoire` matches `côte d'ivoire`).
- **💡 Substring Highlighting:** Highlights matching characters dynamically in the drop-down menu.
- **⌨️ Keyboard Navigation:** Full accessibility with `Up` / `Down` arrows, `Enter` to select, and `Esc` to close the dropdown.
- **🎨 GDG Algiers Branding:** Styled with official Google Developer Groups color palette (`#4285F4`, `#EA4335`, `#FBBC05`, `#34A853`) and modern Material Design principles.

---

## 🛠️ How It Works (Algorithm Overview)

The search matching engine normalizes both the target string and the user input before performing comparisons:

1. **NFD Normalization:** Unfolds combined accent characters into base letters + diacritic marks.
2. **Regex Replacement:** Removes diacritic marks (`\u0300-\u036f`) and apostrophes/punctuation.
3. **Substring Matching:** Uses `.indexOf()` on normalized strings to ensure mid-word matches while retaining original formatting in the visual result.

```javascript
// Example of the normalization helper
function normalizeText(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’'"]/g, "")
    .toLowerCase();
}
