// Load quotes from localStorage or use default
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "You’ve survived 100% of your worst days — you’re doing better than you think.", category: "Resilience" },
  { text: "You are enough. Just as you are.", category: "Self-Love" },
  { text: "Let go with grace, not bitterness.", category: "Detachment" }
];

// DOM references
const categorySelect = document.getElementById("categorySelect");
const quoteDisplay = document.getElementById("quoteDisplay");
const showQuoteBtn = document.getElementById("showQuoteBtn");
const quoteTextInput = document.getElementById("quoteTextInput");
const quoteCategoryInput = document.getElementById("quoteCategoryInput");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const newCategoryInput = document.getElementById("newCategoryInput");
const addCategoryBtn = document.getElementById("addCategoryBtn");

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Populate category dropdown
function populateCategories() {
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];
  categorySelect.innerHTML = `<option value="">--Select--</option>`;
  uniqueCategories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

// Show random quote
function showRandomQuote() {
  const selectedCategory = categorySelect.value;
  if (!selectedCategory) {
    quoteDisplay.textContent = "Please select a category.";
    return;
  }

  const filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes in this category yet.";
    return;
  }

  const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  quoteDisplay.textContent = randomQuote.text;

  // Save to sessionStorage
  sessionStorage.setItem("lastViewedQuote", randomQuote.text);
}

// Add a new quote
function addQuote() {
  const text = quoteTextInput.value.trim();
  const category = quoteCategoryInput.value.trim();
  if (!text || !category) {
    alert("Please fill in both fields.");
    return;
  }
  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  quoteTextInput.value = "";
  quoteCategoryInput.value = "";
  alert("Quote added successfully!");
}

// Add a new category
function addCategory() {
  const newCategory = newCategoryInput.value.trim();
  if (!newCategory) {
    alert("Enter a category name.");
    return;
  }
  if (!quotes.find(q => q.category === newCategory)) {
    quotes.push({ text: `This is your first quote in ${newCategory}.`, category: newCategory });
    saveQuotes();
    populateCategories();
    newCategoryInput.value = "";
    alert("Category added!");
  } else {
    alert("Category already exists.");
  }
}

// Export quotes to JSON file
function exportQuotesToJson() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "quotes.json";
  downloadLink.click();
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON structure.");
      }
    } catch (err) {
      alert("Error parsing the file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Initial load
populateCategories();

// ✅ Add all event listeners
showQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
addCategoryBtn.addEventListener("click", addCategory);