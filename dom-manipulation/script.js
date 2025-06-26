// Quote Array — Each quote is an object with text and category
let quotes = [
  { text: "You’ve survived 100% of your worst days — you’re doing better than you think.", category: "Resilience" },
  { text: "Resilience is not about avoiding pain, it’s about feeling it and choosing yourself anyway.", category: "Resilience" },
  { text: "You are enough. Just as you are.", category: "Self-Love" },
  { text: "Every time you choose yourself, you grow stronger.", category: "Self-Love" },
  { text: "Let go with grace, not bitterness.", category: "Detachment" },
  { text: "You don’t chase what’s yours — you align with it.", category: "Detachment" }
];

// DOM Elements
const categorySelect = document.getElementById("categorySelect");
const quoteDisplay = document.getElementById("quoteDisplay");
const showQuoteBtn = document.getElementById("showQuoteBtn");

const newCategoryInput = document.getElementById("newCategoryInput");
const addCategoryBtn = document.getElementById("addCategoryBtn");

const quoteTextInput = document.getElementById("quoteTextInput");
const quoteCategoryInput = document.getElementById("quoteCategoryInput");
const addQuoteBtn = document.getElementById("addQuoteBtn");

// Populate unique categories into the dropdown
function populateCategories() {
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];

  // Clear existing options
  categorySelect.innerHTML = `<option value="">--Select--</option>`;
  uniqueCategories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

// Function to display a random quote from selected category
function showRandomQuote() {
  const selectedCategory = categorySelect.value;
  if (!selectedCategory) {
    quoteDisplay.textContent = "Please select a category to receive your quote.";
    return;
  }

  const filteredQuotes = quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = `No quotes available for the "${selectedCategory}" category yet.`;
    return;
  }

  const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  quoteDisplay.textContent = randomQuote.text;
}

// Function to add a new quote via the form
function addQuote() {
  const newQuoteText = quoteTextInput.value.trim();
  const newQuoteCategory = quoteCategoryInput.value.trim();

  if (!newQuoteText || !newQuoteCategory) {
    alert("Both quote text and category are required.");
    return;
  }

  quotes.push({ text: newQuoteText, category: newQuoteCategory });

  populateCategories();
  alert("New quote added successfully.");

  quoteTextInput.value = "";
  quoteCategoryInput.value = "";
}

// Function to allow creation of a new category
function addCategory() {
  const newCategory = newCategoryInput.value.trim();
  if (!newCategory) {
    alert("Please enter a valid category name.");
    return;
  }

  // Add a dummy quote to initialize the category
  quotes.push({ text: `Your first quote in ${newCategory} goes here.`, category: newCategory });

  populateCategories();
  alert(`Category "${newCategory}" created.`);

  newCategoryInput.value = "";
}

// Optional advanced DOM function to build the Add Quote form (if generated dynamically)
function createAddQuoteForm() {
  const container = document.createElement('div');

  const textInput = document.createElement('input');
  textInput.placeholder = "Enter a new quote";
  textInput.id = "newQuoteText";

  const categoryInput = document.createElement('input');
  categoryInput.placeholder = "Enter quote category";
  categoryInput.id = "newQuoteCategory";

  const button = document.createElement('button');
  button.textContent = "Add Quote";
  button.onclick = addQuote;

  container.appendChild(textInput);
  container.appendChild(categoryInput);
  container.appendChild(button);

  document.body.appendChild(container);
}

// Event listeners
showQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
addCategoryBtn.addEventListener("click", addCategory);

// Initial population of categories
populateCategories();