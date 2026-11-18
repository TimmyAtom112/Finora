/* ========================================
GET HTML ELEMENTS
======================================== */

const form = document.getElementById("expense-form");

const descriptionInput =
document.getElementById("description");

const amountInput =
document.getElementById("amount");

const typeInput =
document.getElementById("type");

const categoryInput =
document.getElementById("category");

const dateInput =
document.getElementById("transaction-date");

const sourceInput =
document.getElementById("source");

const transactionList =
document.getElementById("transaction-list");

const totalIncome =
document.getElementById("total-income");

const totalExpenses =
document.getElementById("total-expenses");

const balance =
document.getElementById("balance");

const categoryBreakdown =
document.getElementById("category-breakdown");

const spendingChart =
document.getElementById("spending-chart");

// Financial Commitments Elements
const commitmentForm = document.getElementById("commitment-form");
const commitmentName = document.getElementById("commitment-name");
const commitmentAmount = document.getElementById("commitment-amount");
const commitmentType = document.getElementById("commitment-type");
const commitmentDate = document.getElementById("commitment-date");

const commitmentsList = document.getElementById("commitments-list");
const totalOwedDisplay = document.getElementById("total-owed");
const totalReceivableDisplay = document.getElementById("total-receivable");

// Financial Calendar Elements
const calendarMonthYear = document.getElementById("calendar-month-year");
const calendarDays = document.getElementById("calendar-days");
const prevMonthButton = document.getElementById("prev-month");
const nextMonthButton = document.getElementById("next-month");
const todayButton = document.getElementById("today-button");

const selectedDateTitle = document.getElementById("selected-date-title");
const calendarActivityList = document.getElementById("calendar-activity-list");

// Monthly Comparison Elements
const comparisonMonth1 = document.getElementById("comparison-month-1");
const comparisonMonth2 = document.getElementById("comparison-month-2");
const compareMonthsButton = document.getElementById("compare-months");
const comparisonResults = document.getElementById("comparison-results");
const financialInsights = document.getElementById("financial-insights");

/* ========================================
EDIT MODAL
======================================== */

const editModal =
document.getElementById("edit-modal");

const editForm =
document.getElementById("edit-form");

const editId =
document.getElementById("edit-id");

const editDescription =
document.getElementById("edit-description");

const editAmount =
document.getElementById("edit-amount");

const editDate =
document.getElementById("edit-date");

const editType =
document.getElementById("edit-type");

const editCategory =
document.getElementById("edit-category");

const editSource =
document.getElementById("edit-source");

const closeModal =
document.getElementById("close-modal");

const cancelEdit =
document.getElementById("cancel-edit");

/* ========================================
BUDGET
======================================== */

const budgetInput =
document.getElementById("budget-input");

const saveBudgetButton =
document.getElementById("save-budget");

const budgetAmount =
document.getElementById("budget-amount");

const budgetSpent =
document.getElementById("budget-spent");

const budgetRemaining =
document.getElementById("budget-remaining");

const budgetProgressBar =
document.getElementById("budget-progress-bar");

const budgetMessage =
document.getElementById("budget-message");

/* ========================================
SAVINGS ELEMENTS
======================================== */

const savingsForm =
    document.getElementById("savings-form");

const savingsName =
    document.getElementById("savings-name");

const savingsTarget =
    document.getElementById("savings-target");

const savingsGoalsContainer =
    document.getElementById("savings-goals");

const totalSavingsDisplay =
    document.getElementById("total-savings");

const activeGoalsDisplay =
    document.getElementById("active-goals");

/* ========================================
DATA
======================================== */

let transactions = [];

let monthlyBudget = 0;

let categoryChart = null;

let savingsGoals = [];

let commitments = [];

let calendarCurrentDate = new Date();
let selectedCalendarDate = getDateKey(new Date());

let monthlyComparisonChart = null;

function setComparisonDefaultMonths() {

    const today = new Date();

    const currentMonth = getDateKey(today).slice(0, 7);

    const previousDate = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        1
    );

    const previousMonth = getDateKey(previousDate).slice(0, 7);

    comparisonMonth1.value = previousMonth;
    comparisonMonth2.value = currentMonth;
}

function getMonthlyComparisonData(month) {

    let income = 0;
    let expenses = 0;

    transactions.forEach(transaction => {

        if (!transaction.date.startsWith(month)) {
            return;
        }

        const amount = Number(transaction.amount) || 0;

        if (transaction.type === "income") {
            income += amount;
        } else if (transaction.type === "expense") {
            expenses += amount;
        }

    });

    return {
        income: income,
        expenses: expenses,
        balance: income - expenses
    };
}

function compareMonthlyFinances() {

    const month1 = comparisonMonth1.value;
    const month2 = comparisonMonth2.value;

    if (!month1 || !month2) {
        alert("Please select both months.");
        return;
    }

    if (month1 === month2) {
        alert("Please select two different months.");
        return;
    }

    const data1 = getMonthlyComparisonData(month1);
    const data2 = getMonthlyComparisonData(month2);

    const formatMoney = amount =>
        "₦" + amount.toLocaleString("en-NG");

    const formatMonth = month =>
        new Date(month + "-01T12:00:00").toLocaleDateString(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        );

    comparisonResults.innerHTML = `
        <div class="comparison-cards">

            <div class="comparison-card">
                <h3>${formatMonth(month1)}</h3>

                <p>Income:
                    <strong>${formatMoney(data1.income)}</strong>
                </p>

                <p>Expenses:
                    <strong>${formatMoney(data1.expenses)}</strong>
                </p>

                <p>Balance:
                    <strong>${formatMoney(data1.balance)}</strong>
                </p>
            </div>

            <div class="comparison-card">
                <h3>${formatMonth(month2)}</h3>

                <p>Income:
                    <strong>${formatMoney(data2.income)}</strong>
                </p>

                <p>Expenses:
                    <strong>${formatMoney(data2.expenses)}</strong>
                </p>

                <p>Balance:
                    <strong>${formatMoney(data2.balance)}</strong>
                </p>
            </div>

        </div>
    `;

    updateComparisonChart(data1, data2, formatMonth(month1), formatMonth(month2));

    displayFinancialInsights(data1, data2);
}

function updateComparisonChart(data1, data2, label1, label2) {

    const ctx = document.getElementById(
        "monthly-comparison-chart"
    );

    if (monthlyComparisonChart) {
        monthlyComparisonChart.destroy();
    }

    monthlyComparisonChart = new Chart(ctx, {

        type: "bar",

        data: {

            labels: ["Income", "Expenses", "Balance"],

            datasets: [

                {
                    label: label1,
                    data: [
                        data1.income,
                        data1.expenses,
                        data1.balance
                    ],
                    backgroundColor: "#2563eb"
                },

                {
                    label: label2,
                    data: [
                        data2.income,
                        data2.expenses,
                        data2.balance
                    ],
                    backgroundColor: "#16a34a"
                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {
                legend: {
                    position: "bottom"
                }
            },

            scales: {
                y: {
                    beginAtZero: true
                }
            }

        }

    });
}

function displayFinancialInsights(data1, data2) {

    function getChange(oldValue, newValue) {

        if (oldValue === 0) {
            return newValue === 0
                ? "No change"
                : "Started from ₦0";
        }

        const percentage =
            ((newValue - oldValue) / Math.abs(oldValue)) * 100;

        const direction = percentage > 0
            ? "increased"
            : percentage < 0
                ? "decreased"
                : "remained unchanged";

        return `${direction} by ${Math.abs(percentage).toFixed(1)}%`;
    }

    const incomeChange = getChange(
        data1.income,
        data2.income
    );

    const expenseChange = getChange(
        data1.expenses,
        data2.expenses
    );

    const balanceChange = getChange(
        data1.balance,
        data2.balance
    );

    financialInsights.innerHTML = `
        <h3>Financial Insights</h3>

        <p><strong>Income:</strong> Your income ${incomeChange}.</p>

        <p><strong>Expenses:</strong> Your expenses ${expenseChange}.</p>

        <p><strong>Balance:</strong> Your balance ${balanceChange}.</p>
    `;
}

// Format date as YYYY-MM-DD
function getDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

// Convert saved history dates into YYYY-MM-DD
function normalizeCalendarDate(value) {
    if (!value) return null;

    const text = String(value);

    // Already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
        return text;
    }

    // Handle dates such as 18/11/2026
    const parts = text.split("/");

    if (parts.length === 3) {
        let day = Number(parts[0]);
        let month = Number(parts[1]);
        let year = Number(parts[2]);

        if (year < 100) year += 2000;

        if (
            day >= 1 && day <= 31 &&
            month >= 1 && month <= 12
        ) {
            return getDateKey(new Date(year, month - 1, day));
        }
    }

    const parsed = new Date(text);

    if (Number.isNaN(parsed.getTime())) return null;

    return getDateKey(parsed);
}

function getCalendarActivities(dateKey) {

    const activities = [];

    // Transactions
    transactions.forEach(transaction => {

        if (normalizeCalendarDate(transaction.date) === dateKey) {

            activities.push({
                type: transaction.type,
                title: transaction.description,
                amount: Number(transaction.amount) || 0
            });

        }

    });

    // Financial Commitments
    commitments.forEach(commitment => {

        const outstanding = Number(commitment.amount) - Number(commitment.paid);

        // Commitment due dates
        if (
            commitment.dueDate === dateKey &&
            outstanding > 0
        ) {

            activities.push({
                type: "commitment",
                title: "Due: " + commitment.name,
                amount: outstanding
            });

        }

        // Commitment payment history
        if (Array.isArray(commitment.history)) {

            commitment.history.forEach(item => {

                if (normalizeCalendarDate(item.date) === dateKey) {

                    activities.push({
                        type: "commitment",
                        title: item.type + ": " + commitment.name,
                        amount: Number(item.amount) || 0
                    });

                }

            });

        }

    });

    // Savings History
    savingsGoals.forEach(goal => {

        if (Array.isArray(goal.history)) {

            goal.history.forEach(item => {

                if (normalizeCalendarDate(item.date) === dateKey) {

                    activities.push({
                        type: "savings",
                        title: item.type + ": " + goal.name,
                        amount: Number(item.amount) || 0
                    });

                }

            });

        }

    });

    return activities;
}

function displayCalendar() {

    const year = calendarCurrentDate.getFullYear();
    const month = calendarCurrentDate.getMonth();

    calendarMonthYear.textContent =
        calendarCurrentDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric"
        });

    calendarDays.innerHTML = "";

    const firstDay = new Date(year, month, 1).getDay();

    // Convert Sunday-first to Monday-first
    const startingDay = (firstDay + 6) % 7;

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Empty spaces before the first day
    for (let i = 0; i < startingDay; i++) {

        const emptyCell = document.createElement("div");
        emptyCell.className = "calendar-empty";

        calendarDays.appendChild(emptyCell);

    }

    const today = getDateKey(new Date());

    for (let day = 1; day <= daysInMonth; day++) {

        const date = new Date(year, month, day);
        const dateKey = getDateKey(date);

        const activities = getCalendarActivities(dateKey);

        const dayCell = document.createElement("button");

        dayCell.type = "button";
        dayCell.className = "calendar-date";

        if (dateKey === today) {
            dayCell.classList.add("calendar-today");
        }

        if (dateKey === selectedCalendarDate) {
            dayCell.classList.add("calendar-selected");
        }

        dayCell.dataset.date = dateKey;

        let indicators = "";

        const types = [...new Set(activities.map(item => item.type))];

        types.forEach(type => {

            indicators += `<span class="calendar-dot ${type}"></span>`;

        });

        dayCell.innerHTML = `
            <span class="calendar-number">${day}</span>
            <span class="calendar-dots">${indicators}</span>
        `;

        calendarDays.appendChild(dayCell);

    }

    displaySelectedDateActivities();
}

function displaySelectedDateActivities() {

    const date = new Date(selectedCalendarDate + "T12:00:00");

    selectedDateTitle.textContent =
        date.toLocaleDateString("en-US", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });

    const activities = getCalendarActivities(selectedCalendarDate);

    calendarActivityList.innerHTML = "";

    if (activities.length === 0) {

        calendarActivityList.innerHTML =
            "<p>No financial activities scheduled for this date.</p>";

        return;
    }

    activities.forEach(activity => {

        const item = document.createElement("div");

        item.className = "calendar-activity-item";

        item.innerHTML = `
            <span class="calendar-dot ${escapeHTML(activity.type)}"></span>

            <div>
                <strong>${escapeHTML(activity.title)}</strong>
                <p>₦${activity.amount.toLocaleString()}</p>
            </div>
        `;

        calendarActivityList.appendChild(item);

    });
}

// Previous month
prevMonthButton.addEventListener("click", function() {

    calendarCurrentDate.setMonth(
        calendarCurrentDate.getMonth() - 1
    );

    displayCalendar();

});

// Next month
nextMonthButton.addEventListener("click", function() {

    calendarCurrentDate.setMonth(
        calendarCurrentDate.getMonth() + 1
    );

    displayCalendar();

});

// Return to today
todayButton.addEventListener("click", function() {

    calendarCurrentDate = new Date();
    selectedCalendarDate = getDateKey(new Date());

    displayCalendar();

});

// Select a calendar date
calendarDays.addEventListener("click", function(event) {

    const selectedDay = event.target.closest(".calendar-date");

    if (!selectedDay) return;

    selectedCalendarDate = selectedDay.dataset.date;

    displayCalendar();

});



/* ========================================
TODAY'S DATE
======================================== */

function setDefaultDate() {

const today =
    new Date().toISOString().split("T")[0];

dateInput.value = today;

}

/* ========================================
ADD TRANSACTION
======================================== */

form.addEventListener("submit", function(event) {

event.preventDefault();

const description =
    descriptionInput.value.trim();

const amount =
    Number(amountInput.value);

const type =
    typeInput.value;

const category =
    categoryInput.value;

const date =
    dateInput.value;

const source =
    sourceInput.value.trim();


if (
    description === "" ||
    amount <= 0 ||
    !date
) {

    alert(
        "Please enter a valid description, amount and date."
    );

    return;

}


const transaction = {

    id: Date.now(),

    description: description,

    amount: amount,

    type: type,

    category: category,

    date: date,

    source: source

};


transactions.push(transaction);

saveTransactions();

refreshApp();

form.reset();

setDefaultDate();

});

/* ========================================
DISPLAY TRANSACTIONS
======================================== */

function displayTransactions() {

transactionList.innerHTML = "";


if (transactions.length === 0) {

    transactionList.innerHTML = `
        <p class="no-expenses">
            No transactions recorded yet.
        </p>
    `;

    return;

}


const sortedTransactions =
    [...transactions].sort(
        (a, b) => b.id - a.id
    );


sortedTransactions.forEach(function(transaction) {

    const transactionElement =
        document.createElement("div");


    transactionElement.classList.add(
        "transaction-item"
    );


    const amountClass =
        transaction.type === "income"
            ? "income"
            : "expense";


    const amountSign =
        transaction.type === "income"
            ? "+"
            : "-";


    const sourceHTML =
        transaction.source
            ? `<small>Source: ${escapeHTML(
                transaction.source
            )}</small>`
            : "";


    transactionElement.innerHTML = `

        <div class="transaction-info">

            <h3>
                ${escapeHTML(
                    transaction.description
                )}
            </h3>

            <p>
                ${escapeHTML(
                    transaction.category || "Other"
                )}

                ${
                    transaction.date
                        ? " • " +
                          escapeHTML(
                              transaction.date
                          )
                        : ""
                }
            </p>

            ${sourceHTML}

        </div>

        <div class="transaction-right">

            <span
                class="transaction-amount ${amountClass}">

                ${amountSign}
                ₦${Number(
                    transaction.amount
                ).toLocaleString()}

            </span>

            <button
                type="button"
                class="edit-btn"
                onclick="editTransaction(${transaction.id})">

                Edit

            </button>

            <button
                type="button"
                class="delete-btn"
                onclick="deleteTransaction(${transaction.id})">

                Delete

            </button>

        </div>

    `;


    transactionList.appendChild(
        transactionElement
    );

});

}

/* ========================================
DELETE TRANSACTION
======================================== */

function deleteTransaction(id) {

transactions =
    transactions.filter(
        function(transaction) {

            return transaction.id !== id;

        }
    );


saveTransactions();

refreshApp();

}

/* ========================================
EDIT TRANSACTION
======================================== */

function editTransaction(id) {

const transaction =
    transactions.find(
        function(transaction) {

            return transaction.id === id;

        }
    );


if (!transaction) {

    return;

}


editId.value =
    transaction.id;

editDescription.value =
    transaction.description;

editAmount.value =
    transaction.amount;

editDate.value =
    transaction.date || "";

editType.value =
    transaction.type;

editCategory.value =
    normalizeCategory(
        transaction.category
    );

editSource.value =
    transaction.source || "";


editModal.classList.add(
    "active"
);

}

/* ========================================
SAVE EDITED TRANSACTION
======================================== */

editForm.addEventListener(
"submit",
function(event) {

    event.preventDefault();


    const id =
        Number(editId.value);


    const transaction =
        transactions.find(
            function(transaction) {

                return transaction.id === id;

            }
        );


    if (!transaction) {

        return;

    }


    const newDescription =
        editDescription.value.trim();

    const newAmount =
        Number(editAmount.value);

    const newDate =
        editDate.value;

    const newType =
        editType.value;

    const newCategory =
        editCategory.value;

    const newSource =
        editSource.value.trim();


    if (
        newDescription === "" ||
        newAmount <= 0 ||
        !newDate
    ) {

        alert(
            "Please enter valid transaction details."
        );

        return;

    }


    transaction.description =
        newDescription;

    transaction.amount =
        newAmount;

    transaction.date =
        newDate;

    transaction.type =
        newType;

    transaction.category =
        newCategory;

    transaction.source =
        newSource;


    saveTransactions();

    refreshApp();

    editModal.classList.remove(
        "active"
    );

}

);

/* ========================================
CLOSE MODAL
======================================== */

closeModal.addEventListener(
"click",
function() {

    editModal.classList.remove(
        "active"
    );

}

);

cancelEdit.addEventListener(
"click",
function() {

    editModal.classList.remove(
        "active"
    );

}

);

compareMonthsButton.addEventListener("click", compareMonthlyFinances);

/* ========================================
UPDATE SUMMARY
======================================== */

function updateSummary() {

    let income = 0;
    let expenses = 0;

    let monthlyIncome = 0;
    let monthlyExpenses = 0;

    const today = new Date();

    const currentMonth =
        today.getFullYear() + "-" +
        String(today.getMonth() + 1).padStart(2, "0");

    transactions.forEach(function(transaction) {

        const amount = Number(transaction.amount) || 0;

        if (transaction.type === "income") {

            income += amount;

        } else {

            expenses += amount;

        }

        if (
            transaction.date &&
            transaction.date.startsWith(currentMonth)
        ) {

            if (transaction.type === "income") {

                monthlyIncome += amount;

            } else {

                monthlyExpenses += amount;

            }

        }

    });

    totalIncome.textContent =
        `₦${income.toLocaleString()}`;

    totalExpenses.textContent =
        `₦${expenses.toLocaleString()}`;

    balance.textContent =
        `₦${(income - expenses).toLocaleString()}`;

    document.getElementById("monthly-income").textContent =
        `₦${monthlyIncome.toLocaleString()}`;

    document.getElementById("monthly-expenses").textContent =
        `₦${monthlyExpenses.toLocaleString()}`;

    document.getElementById("monthly-balance").textContent =
        `₦${(monthlyIncome - monthlyExpenses).toLocaleString()}`;

}

/* ========================================
SAVE TRANSACTIONS
======================================== */

function saveTransactions() {

localStorage.setItem(
    "nyscTransactions",
    JSON.stringify(transactions)
);

}

/* ========================================
LOAD TRANSACTIONS
======================================== */

function loadTransactions() {

const savedTransactions =
    localStorage.getItem(
        "nyscTransactions"
    );


if (savedTransactions) {

    try {

        transactions =
            JSON.parse(savedTransactions);

        if (!Array.isArray(transactions)) {

            transactions = [];

        }

    } catch (error) {

        console.error(
            "Could not load transactions:",
            error
        );

        transactions = [];

    }

}


refreshApp();

}

/* ========================================
SAVE BUDGET
======================================== */

saveBudgetButton.addEventListener(
"click",
function() {

    const amount =
        Number(budgetInput.value);


    if (amount <= 0) {

        alert(
            "Please enter a valid budget."
        );

        return;

    }


    monthlyBudget =
        amount;


    localStorage.setItem(
        "nyscMonthlyBudget",
        monthlyBudget
    );


    updateBudget();

    budgetInput.value = "";

}

);

/* ========================================
UPDATE BUDGET
======================================== */

function updateBudget() {

    let spent = 0;

    const today = new Date();

    const currentMonth =
        today.getFullYear() + "-" +
        String(today.getMonth() + 1).padStart(2, "0");

    transactions.forEach(function(transaction) {

        if (
            transaction.type === "expense" &&
            transaction.date &&
            transaction.date.startsWith(currentMonth)
        ) {

            spent += Number(transaction.amount) || 0;

        }

    });

    const remaining = monthlyBudget - spent;

    budgetAmount.textContent =
        `₦${monthlyBudget.toLocaleString()}`;

    budgetSpent.textContent =
        `₦${spent.toLocaleString()}`;

    budgetRemaining.textContent =
        `₦${remaining.toLocaleString()}`;

    if (monthlyBudget <= 0) {

        budgetProgressBar.style.width = "0%";
        budgetProgressBar.style.backgroundColor = "#22c55e";

        budgetMessage.textContent =
            "Set a budget to start tracking your spending.";

        return;

    }

    const percentage = (spent / monthlyBudget) * 100;

    budgetProgressBar.style.width =
        `${Math.min(percentage, 100)}%`;

    if (percentage >= 100) {

        budgetProgressBar.style.backgroundColor = "#ef4444";

        budgetMessage.textContent =
            `You've exceeded your budget by ₦${Math.abs(remaining).toLocaleString()}.`;

    } else if (percentage >= 80) {

        budgetProgressBar.style.backgroundColor = "#f97316";

        budgetMessage.textContent =
            `Warning: you've used ${percentage.toFixed(0)}% of your budget.`;

    } else if (percentage >= 60) {

        budgetProgressBar.style.backgroundColor = "#eab308";

        budgetMessage.textContent =
            `You've used ${percentage.toFixed(0)}% of your budget.`;

    } else {

        budgetProgressBar.style.backgroundColor = "#22c55e";

        budgetMessage.textContent =
            `You've used ${percentage.toFixed(0)}% of your budget.`;

    }

}

/* ========================================
LOAD BUDGET
======================================== */

function loadBudget() {

const savedBudget =
    localStorage.getItem(
        "nyscMonthlyBudget"
    );


if (savedBudget) {

    monthlyBudget =
        Number(savedBudget) || 0;

}


updateBudget();

}

/* ========================================
CATEGORY BREAKDOWN
======================================== */

function updateCategoryBreakdown() {

const categoryTotals = {};


transactions.forEach(
    function(transaction) {

        if (
            transaction.type !== "expense"
        ) {

            return;

        }


        const category =
            normalizeCategory(
                transaction.category
            );


        if (!categoryTotals[category]) {

            categoryTotals[category] = 0;

        }


        categoryTotals[category] +=
            Number(transaction.amount) || 0;

    }
);


categoryBreakdown.innerHTML = "";


const categories =
    Object.keys(categoryTotals);


if (categories.length === 0) {

    categoryBreakdown.innerHTML = `
        <p class="no-expenses">
            No expenses recorded yet.
        </p>
    `;

    return;

}


categories.forEach(
    function(category) {

        const categoryElement =
            document.createElement("div");


        categoryElement.classList.add(
            "category-item"
        );


        categoryElement.innerHTML = `

            <span class="category-name">
                ${escapeHTML(category)}
            </span>

            <span class="category-amount">
                ₦${categoryTotals[
                    category
                ].toLocaleString()}
            </span>

        `;


        categoryBreakdown.appendChild(
            categoryElement
        );

    }
);

}

/* ========================================
SPENDING CHART
======================================== */

function updateSpendingChart() {

const categoryTotals = {};


transactions.forEach(
    function(transaction) {

        if (
            transaction.type !== "expense"
        ) {

            return;

        }


        const category =
            normalizeCategory(
                transaction.category
            );


        if (!categoryTotals[category]) {

            categoryTotals[category] = 0;

        }


        categoryTotals[category] +=
            Number(transaction.amount) || 0;

    }
);


const categories =
    Object.keys(categoryTotals);

const amounts =
    Object.values(categoryTotals);


if (categoryChart) {

    categoryChart.destroy();

    categoryChart = null;

}


if (
    categories.length === 0 ||
    typeof Chart === "undefined"
) {

    return;

}


categoryChart =
    new Chart(
        spendingChart,
        {

            type: "doughnut",

            data: {

                labels: categories,

                datasets: [
                    {
                        data: amounts
                    }
                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {

                        position: "bottom"

                    }

                }

            }

        }
    );

}

/* ========================================
NORMALIZE OLD CATEGORY VALUES
======================================== */

function normalizeCategory(category) {

if (!category) {

    return "Other";

}


const value =
    String(category).toLowerCase();


const categoryMap = {

    food: "Food",

    transport: "Transport",

    data: "Data",

    accommodation: "Accommodation",

    betting: "Betting",

    other: "Other"

};


return categoryMap[value] || "Other";

}

// Add Financial Commitment
commitmentForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = commitmentName.value.trim();
    const amount = Number(commitmentAmount.value);
    const type = commitmentType.value;
    const dueDate = commitmentDate.value;

    if (!name || !Number.isFinite(amount) || amount <= 0 || !dueDate) {
        alert("Please enter valid commitment details.");
        return;
    }

    const commitment = {
        id: Date.now(),
        name: name,
        amount: amount,
        paid: 0,
        type: type,
        dueDate: dueDate,
        status: "Pending",
        history: []
    };

    commitments.push(commitment);

    saveCommitments();
    displayCommitments();

    commitmentForm.reset();
});

// Save commitments
function saveCommitments() {
    localStorage.setItem(
        "nyscCommitments",
        JSON.stringify(commitments)
    );
}

// Load commitments
function loadCommitments() {
    const saved = localStorage.getItem("nyscCommitments");

    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            commitments = Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.error("Error loading commitments:", error);
            commitments = [];
        }
    }

    displayCommitments();
}

function displayCommitments() {

    commitmentsList.innerHTML = "";

    let totalOwed = 0;
    let totalReceivable = 0;

    if (commitments.length === 0) {
        commitmentsList.innerHTML =
            "<p>No commitments recorded yet.</p>";
    }

    commitments.forEach(commitment => {

        commitment.amount = Number(commitment.amount) || 0;
        commitment.paid = Number(commitment.paid) || 0;

        if (!Array.isArray(commitment.history)) {
            commitment.history = [];
        }

        const outstanding = Math.max(
            0,
            commitment.amount - commitment.paid
        );

        commitment.status =
            outstanding === 0 ? "Paid" :
            commitment.paid > 0 ? "Partially Paid" :
            "Pending";

        if (commitment.type === "owe") {
            totalOwed += outstanding;
        } else {
            totalReceivable += outstanding;
        }

        const card = document.createElement("div");
        card.className = "commitment-card";

        const typeLabel =
            commitment.type === "owe" ? "I Owe" : "Owed to Me";

        const historyHTML = commitment.history.length
            ? commitment.history.slice().reverse().map(item => `
                <div class="commitment-history-item">
                    <span>${item.type}</span>
                    <span>₦${Number(item.amount).toLocaleString()}</span>
                    <small>${escapeHTML(item.date)}</small>
                </div>
            `).join("")
            : "<p>No payment history yet.</p>";

        card.innerHTML = `
            <h3>${escapeHTML(commitment.name)}</h3>

            <p><strong>Type:</strong> ${typeLabel}</p>

            <p><strong>Original Amount:</strong>
                ₦${commitment.amount.toLocaleString()}
            </p>

            <p><strong>Paid/Received:</strong>
                ₦${commitment.paid.toLocaleString()}
            </p>

            <p><strong>Outstanding:</strong>
                ₦${outstanding.toLocaleString()}
            </p>

            <p><strong>Due Date:</strong>
                ${escapeHTML(commitment.dueDate)}
            </p>

            <p><strong>Status:</strong>
                <span class="commitment-status">
                    ${commitment.status}
                </span>
            </p>

            <div class="commitment-actions">

                ${outstanding > 0 ? `
                    <button onclick="recordCommitmentPayment(${commitment.id})">
                        Record Payment
                    </button>
                ` : ""}

                <button class="delete-commitment"
                    onclick="deleteCommitment(${commitment.id})">
                    Delete
                </button>

            </div>

            <div class="commitment-history">
                <h4>Payment History</h4>
                ${historyHTML}
            </div>
        `;

        commitmentsList.appendChild(card);
    });

    totalOwedDisplay.textContent =
        "₦" + totalOwed.toLocaleString();

    totalReceivableDisplay.textContent =
        "₦" + totalReceivable.toLocaleString();

    saveCommitments();
}

function recordCommitmentPayment(id) {

    const commitment = commitments.find(item => item.id === id);

    if (!commitment) return;

    const outstanding = commitment.amount - commitment.paid;

    const amount = Number(
        prompt(
            `Outstanding balance: ₦${outstanding.toLocaleString()}\nEnter payment amount:`
        )
    );

    if (!Number.isFinite(amount) || amount <= 0) {
        alert("Enter a valid payment amount.");
        return;
    }

    if (amount > outstanding) {
        alert("Payment cannot exceed the outstanding balance.");
        return;
    }

    commitment.paid += amount;

    commitment.history.push({
        type: commitment.type === "owe"
            ? "Payment Made"
            : "Payment Received",

        amount: amount,

        date: new Date().toLocaleDateString()
    });

    saveCommitments();
    displayCommitments();
}

function deleteCommitment(id) {

    if (!confirm("Are you sure you want to delete this commitment?")) {
        return;
    }

    commitments = commitments.filter(
        item => item.id !== id
    );

    saveCommitments();
    displayCommitments();
}

/* ========================================
ESCAPE HTML
======================================== */

function escapeHTML(value) {

return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}

/* ========================================
CREATE SAVINGS GOAL
======================================== */

savingsForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = savingsName.value.trim();
    const target = Number(savingsTarget.value);

    if (!name || target <= 0) {
        alert("Please enter a valid goal name and target.");
        return;
    }

    const goal = {
    id: Date.now(),
    name: name,
    target: target,
    saved: 0,
    history: []
 };

    savingsGoals.push(goal);

    saveSavings();

    displaySavings();

    savingsForm.reset();

});

/* ========================================
SAVE AND LOAD SAVINGS
======================================== */

function saveSavings() {

    localStorage.setItem(
        "nyscSavingsGoals",
        JSON.stringify(savingsGoals)
    );

}

function loadSavings() {

    const saved = localStorage.getItem(
        "nyscSavingsGoals"
    );

    if (saved) {

        try {

            const parsed = JSON.parse(saved);

            savingsGoals = Array.isArray(parsed)
                ? parsed
                : [];

        } catch (error) {

            console.error("Could not load savings:", error);

            savingsGoals = [];

        }

    }

    displaySavings();

}

/* ========================================
DISPLAY SAVINGS GOALS
======================================== */

function displaySavings() {

    savingsGoalsContainer.innerHTML = "";

    let total = 0;

    savingsGoals.forEach(function(goal) {

        // Support goals created before this update
        if (!Array.isArray(goal.history)) {
            goal.history = [];
        }

        const saved = Number(goal.saved) || 0;
        const target = Number(goal.target) || 0;

        total += saved;

        const percentage = target > 0
            ? Math.min((saved / target) * 100, 100)
            : 0;

        const completed = saved >= target;

        const goalElement = document.createElement("div");

        goalElement.classList.add("savings-goal-card");

        const historyHTML = goal.history.length > 0

            ? [...goal.history].reverse().map(function(item) {

                return `
                    <div class="savings-history-item">

                        <span>
                            ${escapeHTML(item.type)}
                        </span>

                        <span>
                            ₦${Number(item.amount).toLocaleString()}
                        </span>

                        <small>
                            ${escapeHTML(item.date)}
                        </small>

                    </div>
                `;

            }).join("")

            : "<p>No savings activity yet.</p>";

        goalElement.innerHTML = `

            <h3>${escapeHTML(goal.name)}</h3>

            <p>Saved: ₦${saved.toLocaleString()}</p>

            <p>Target: ₦${target.toLocaleString()}</p>

            <div class="savings-progress">

                <div style="width: ${percentage}%"></div>

            </div>

            <p>${percentage.toFixed(1)}% completed</p>

            <p>
                ${completed ? "🎉 Goal completed!" : "Keep saving!"}
            </p>

            <div class="savings-actions">

                <button onclick="addSavings(${goal.id})">
                    Add Money
                </button>

                <button onclick="withdrawSavings(${goal.id})">
                    Withdraw
                </button>

                <button onclick="deleteSavings(${goal.id})">
                    Delete
                </button>

            </div>

            <div class="savings-history">

                <h4>Transaction History</h4>

                ${historyHTML}

            </div>

        `;

        savingsGoalsContainer.appendChild(goalElement);

    });

    if (savingsGoals.length === 0) {

        savingsGoalsContainer.innerHTML =
            "<p>No savings goals created yet.</p>";

    }

    totalSavingsDisplay.textContent =
        `₦${total.toLocaleString()}`;

    activeGoalsDisplay.textContent =
        savingsGoals.filter(function(goal) {
            return Number(goal.saved) < Number(goal.target);
        }).length;

    saveSavings();

}

/* ========================================
ADD MONEY TO SAVINGS
======================================== */

function addSavings(id) {

    const goal = savingsGoals.find(g => g.id === id);

    if (!goal) return;

    const amount = Number(
        prompt("How much would you like to deposit?")
    );

    if (!Number.isFinite(amount) || amount <= 0) {
        alert("Enter a valid amount.");
        return;
    }

    if (!Array.isArray(goal.history)) {
        goal.history = [];
    }

    goal.saved = Number(goal.saved) || 0;

    goal.saved += amount;

    goal.history.push({

        type: "Deposit",

        amount: amount,

        date: new Date().toLocaleDateString(),

        balanceAfter: goal.saved

    });

    saveSavings();

    displaySavings();

}


/* ========================================
WITHDRAW SAVINGS
======================================== */

function withdrawSavings(id) {

    const goal = savingsGoals.find(g => g.id === id);

    if (!goal) return;

    const amount = Number(
        prompt("How much would you like to withdraw?")
    );

    if (!Number.isFinite(amount) || amount <= 0) {
        alert("Enter a valid amount.");
        return;
    }

    goal.saved = Number(goal.saved) || 0;

    if (amount > goal.saved) {

        alert("You cannot withdraw more than you have saved.");

        return;

    }

    if (!Array.isArray(goal.history)) {
        goal.history = [];
    }

    goal.saved -= amount;

    goal.history.push({

        type: "Withdrawal",

        amount: amount,

        date: new Date().toLocaleDateString(),

        balanceAfter: goal.saved

    });

    saveSavings();

    displaySavings();

}


/* ========================================
DELETE SAVINGS GOAL
======================================== */

function deleteSavings(id) {

    if (!confirm("Are you sure you want to delete this savings goal?")) {
        return;
    }

    savingsGoals = savingsGoals.filter(
        goal => goal.id !== id
    );

    saveSavings();

    displaySavings();

}

/* ========================================
REFRESH EVERYTHING
======================================== */

function refreshApp() {

displayTransactions();

updateSummary();

updateBudget();

updateCategoryBreakdown();

updateSpendingChart();

}

/* ========================================
START APPLICATION
======================================== */

setDefaultDate();
loadBudget();
loadSavings();
loadCommitments();
loadTransactions();

displayCalendar();

setComparisonDefaultMonths();
compareMonthlyFinances();