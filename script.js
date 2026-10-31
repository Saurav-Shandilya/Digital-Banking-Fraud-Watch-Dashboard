
"use strict";

// Fraud-Watch Rules Engine
// Milestone 01: Client-side educational prototype

const form = document.getElementById("transactionForm");
const amountInput = document.getElementById("amount");
const frequencyInput = document.getElementById("frequency");
const locationInput = document.getElementById("location");

const amountThresholdInput = document.getElementById("amountThreshold");
const frequencyThresholdInput = document.getElementById("frequencyThreshold");

const riskBadge = document.getElementById("riskBadge");
const riskScoreElement = document.getElementById("riskScore");
const scoreBar = document.getElementById("scoreBar");
const ruleList = document.getElementById("ruleList");
const decision = document.getElementById("decision");
const historyBody = document.getElementById("historyBody");
const clearHistoryButton = document.getElementById("clearHistory");

const history = [];

const RISK_LEVELS = [
    { max: 24, label: "LOW", className: "low" },
    { max: 49, label: "MEDIUM", className: "medium" },
    { max: 74, label: "HIGH", className: "high" },
    { max: 100, label: "CRITICAL", className: "critical" }
];

// Configurable risk weights
const RULE_WEIGHTS = {
    highAmount: 35,
    highFrequency: 35,
    locationMismatch: 30
};

function getRiskLevel(score) {
    return RISK_LEVELS.find(level => score <= level.max);
}

function validateInputs(amount, frequency, amountThreshold, frequencyThreshold) {
    if (
        !Number.isFinite(amount) ||
        !Number.isFinite(frequency) ||
        !Number.isFinite(amountThreshold) ||
        !Number.isFinite(frequencyThreshold)
    ) {
        throw new Error("Please enter valid numeric values.");
    }

    if (amount <= 0 || amountThreshold <= 0) {
        throw new Error("Amount and amount threshold must be greater than zero.");
    }

    if (
        !Number.isInteger(frequency) ||
        !Number.isInteger(frequencyThreshold) ||
        frequency < 1 ||
        frequencyThreshold < 1
    ) {
        throw new Error("Transaction counts must be positive whole numbers.");
    }
}

function analyzeTransaction(transaction, thresholds) {
    validateInputs(
        transaction.amount,
        transaction.frequency,
        thresholds.amount,
        thresholds.frequency
    );

    let score = 0;
    const triggeredRules = [];

    // Rule 1: Unusually high transaction amount
    if (transaction.amount >= thresholds.amount) {
        score += RULE_WEIGHTS.highAmount;
        triggeredRules.push({
            name: "High transaction amount",
            points: RULE_WEIGHTS.highAmount
        });
    }

    // Rule 2: Too many transactions in one hour
    if (transaction.frequency > thresholds.frequency) {
        score += RULE_WEIGHTS.highFrequency;
        triggeredRules.push({
            name: "High transaction frequency",
            points: RULE_WEIGHTS.highFrequency
        });
    }

    // Rule 3: Unusual transaction location
    if (transaction.locationMismatch) {
        score += RULE_WEIGHTS.locationMismatch;
        triggeredRules.push({
            name: "Location mismatch",
            points: RULE_WEIGHTS.locationMismatch
        });
    }

    // Keep the score between 0 and 100
    score = Math.min(score, 100);

    const level = getRiskLevel(score);

    return {
        score,
        level,
        triggeredRules,
        decision: level.label === "LOW"
            ? "Low risk under the configured demo rules."
            : level.label === "MEDIUM"
                ? "Review this transaction for possible risk."
                : level.label === "HIGH"
                    ? "Flag this transaction for further review."
                    : "Critical risk score. Escalate for manual review."
    };
}

function displayResult(result) {
    riskScoreElement.textContent = result.score;
    scoreBar.style.width = `${result.score}%`;

    riskBadge.textContent = result.level.label;
    riskBadge.className = `badge ${result.level.className}`;

    const barColors = {
        LOW: "#39c99a",
        MEDIUM: "#e9b949",
        HIGH: "#f28b52",
        CRITICAL: "#ef5364"
    };

    scoreBar.style.backgroundColor = barColors[result.level.label];

    ruleList.replaceChildren();

    if (result.triggeredRules.length === 0) {
        const item = document.createElement("li");
        item.textContent = "No configured risk rules were triggered.";
        ruleList.appendChild(item);
    } else {
        result.triggeredRules.forEach(rule => {
            const item = document.createElement("li");
            item.textContent = `${rule.name} (+${rule.points} points)`;
            ruleList.appendChild(item);
        });
    }

    decision.textContent = result.decision;
}

function renderHistory() {
    historyBody.replaceChildren();

    if (history.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 3;
        cell.textContent = "No transactions analyzed yet.";
        row.appendChild(cell);
        historyBody.appendChild(row);
        return;
    }

    history.slice().reverse().forEach(entry => {
        const row = document.createElement("tr");

        const amountCell = document.createElement("td");
        amountCell.textContent = `₹${entry.amount.toLocaleString("en-IN")}`;

        const scoreCell = document.createElement("td");
        scoreCell.textContent = `${entry.score}/100`;

        const levelCell = document.createElement("td");
        const badge = document.createElement("span");

        badge.className = `badge ${entry.level.className}`;
        badge.textContent = entry.level.label;

        levelCell.appendChild(badge);
        row.append(amountCell, scoreCell, levelCell);
        historyBody.appendChild(row);
    });
}

form.addEventListener("submit", function (event) {
    event.preventDefault();

    try {
        const transaction = {
            amount: Number(amountInput.value),
            frequency: Number(frequencyInput.value),
            locationMismatch: locationInput.value === "mismatch"
        };

        const thresholds = {
            amount: Number(amountThresholdInput.value),
            frequency: Number(frequencyThresholdInput.value)
        };

        const result = analyzeTransaction(transaction, thresholds);

        displayResult(result);

        history.push({
            amount: transaction.amount,
            score: result.score,
            level: result.level
        });

        renderHistory();
    } catch (error) {
        decision.textContent = error.message;
    }
});

clearHistoryButton.addEventListener("click", function () {
    history.length = 0;
    renderHistory();
});

console.log("Fraud-Watch Rules Engine initialized successfully.");
