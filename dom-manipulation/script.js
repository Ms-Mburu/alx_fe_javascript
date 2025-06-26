// Load quotes from localStorage or use default
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "You’ve survived 100% of your worst days — you’re doing better than you think.", category: "Resilience" },
  { text: "Resilience is not about avoiding pain, it’s about feeling it and choosing yourself anyway.", category: "Resilience" },
  { text: "You are enough. Just as you are.", category: "Self-Love" },
  { text: "Every time you choose yourself, you grow stronger.", category: "Self-Love" },
  { text: "Let go with grace, not bitterness.", category: "Detachment" },
  { text: "You don’t chase what’s yours — you align with it.", category: "Detachment" }
];

// DOM elements
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

// Display random quote and save to sessionStorage
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

  // Store last viewed quote in sessionStorage
  sessionStorage.setItem("lastViewedQuote", randomQuote.text);
}

// Add new quote
function addQuote() {
  const newQuoteText = quoteTextInput.value.trim();
  const newQuoteCategory = quoteCategoryInput.value.trim();

  if (!newQuoteText || !newQuoteCategory) {
    alert("Please enter both quote and category.");
    return;
  }

  quotes.push({ text: newQuoteText, category: newQuoteCategory });
  saveQuotes();
  populateCategories();
  alert("Quote added!");
  quoteTextInput.value = "";
  quoteCategoryInput.value = "";
}

// Add new category
function addCategory() {
  const newCategory = newCategoryInput.value.trim();
  if (!newCategory) {
    alert("Please enter a category.");
    return;
  }

  quotes.push({ text: `Your first quote in ${newCategory}.`, category: newCategory });
  saveQuotes();
  populateCategories();
  alert("Category added!");
  newCategoryInput.value = "";
}

// Export quotes to JSON
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
        alert("Quotes imported successfully!"
