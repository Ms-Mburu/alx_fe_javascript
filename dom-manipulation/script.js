const API_BASE_URL = "https://jsonplaceholder.typicode.com/posts";


// Load quotes from localStorage or use defaults
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
const categoryFilter = document.getElementById("categoryFilter");
const filteredQuotesDiv = document.getElementById("filteredQuotes");
const importInput = document.getElementById("importFile");

// Save to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Populate categories
function populateCategories() {
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];

  categorySelect.innerHTML = `<option value="">--Select--</option>`;
  uniqueCategories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });

  if (categoryFilter) {
    categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
    uniqueCategories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      categoryFilter.appendChild(option);
    });

    const lastFilter = localStorage.getItem("lastCategoryFilter");
    if (lastFilter) {
      categoryFilter.value = lastFilter;
      filterQuotes();
    }
  }
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
    quoteDisplay.textContent = "No quotes in this category.";
    return;
  }

  const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  quoteDisplay.textContent = randomQuote.text;
  sessionStorage.setItem("lastViewedQuote", randomQuote.text);
}

// Filter by category
function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem("lastCategoryFilter", selected);

  let displayQuotes = selected === "all" ? quotes : quotes.filter(q => q.category === selected);

  if (displayQuotes.length === 0) {
    filteredQuotesDiv.textContent = "No quotes found in this category.";
    return;
  }

  filteredQuotesDiv.innerHTML = "";
  displayQuotes.forEach(q => {
    const quoteEl = document.createElement("p");
    quoteEl.textContent = `"${q.text}" — ${q.category}`;
    filteredQuotesDiv.appendChild(quoteEl);
  });
}

// Add new quote
function addQuote() {
  const text = quoteTextInput.value.trim();
  const category = quoteCategoryInput.value.trim();

  if (!text || !category) {
    alert("Please fill in both fields.");
    return;
  }

  const newQuote = { text, category, timestamp: new Date().toISOString() };
  quotes.push(newQuote);
  saveQuotes();
  postQuoteToServer(newQuote);
  populateCategories();
  filterQuotes();
  quoteTextInput.value = "";
  quoteCategoryInput.value = "";
  alert("Quote added!");
}

// Add new category
function addCategory() {
  const newCategory = newCategoryInput.value.trim();
  if (!newCategory) {
    alert("Enter a category name.");
    return;
  }

  if (!quotes.some(q => q.category === newCategory)) {
    const placeholder = {
      text: `This is your first quote in ${newCategory}.`,
      category: newCategory,
      timestamp: new Date().toISOString()
    };
    quotes.push(placeholder);
    saveQuotes();
    postQuoteToServer(placeholder);
    populateCategories();
    filterQuotes();
    alert("Category added!");
    newCategoryInput.value = "";
  } else {
    alert("Category already exists.");
  }
}

// Export to JSON
function exportQuotesToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();
}

// Import from JSON file
function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        importedQuotes.forEach(q => postQuoteToServer(q));
        populateCategories();
        filterQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid file structure.");
      }
    } catch {
      alert("Could not parse the file.");
    }
  };
  reader.readAsText(event.target.files[0]);
}

// Sync from mock API
async function fetchQuotesFromServer() {
  try {
    const res = await fetch(API_BASE_URL);
    const serverData = await res.json();

    // Extract valid quote data (simulate structure)
    return serverData
      .filter(post => post.title && post.body)
      .map(post => ({
        text: post.title,
        category: "Imported",
        timestamp: new Date().toISOString()
      }));
  } catch (err) {
    console.error("Fetch error:", err);
    return [];
  }
}


async function postQuoteToServer(quote) {
  try {
    await fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: quote.text,
        body: quote.category,
        userId: 1 // placeholder structure requires this
      })
    });
  } catch (err) {
    console.error("Post error:", err);
  }
}


async function syncWithServer() {
  const serverQuotes = await fetchQuotesFromServer();
  let newCount = 0;

  serverQuotes.forEach(serverQuote => {
    if (!quotes.some(local => local.text === serverQuote.text)) {
      quotes.push(serverQuote);
      newCount++;
      function syncQuotes() {
  syncWithServer();
}
    }
  });

  if (newCount > 0) {
    saveQuotes();
    populateCategories();
    filterQuotes();
    notifySync(`${newCount} new quote(s) synced from server.`);
  }
}

// UI notification
function notifySync(message) {
  const alertBox = document.createElement("div");
  alertBox.textContent = message;
  alertBox.style.cssText = "background:#dff0d8; color:#3c763d; padding:10px; margin-top:10px; text-align:center;";
  document.body.insertBefore(alertBox, document.body.firstChild);
  setTimeout(() => alertBox.remove(), 4000);
}

// Initialize
populateCategories();
showQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
addCategoryBtn.addEventListener("click", addCategory);
if (categoryFilter) categoryFilter.addEventListener("change", filterQuotes);
if (importInput) importInput.addEventListener("change", importFromJsonFile);
setInterval(syncWithServer, 60000); // Sync every 60 seconds
function syncQuotes() {
  syncWithServer();
}
