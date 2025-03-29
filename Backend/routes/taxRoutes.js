const express = require("express");
const BankAccount = require("../models/BankAccount");
const Transaction = require("../models/Transaction");
const Stock = require("../models/Stock");
const Tax = require("../models/Tax");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Calculate tax liability for a specific bank account
router.get("/calculate", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const financialYear = "2024-25";
    const bankAccountId = req.query.bankAccountId;

    if (!bankAccountId) {
      return res.status(400).json({ error: "Bank account ID is required" });
    }

    const bankAccount = await BankAccount.findOne({
      _id: bankAccountId,
      user: userId,
    });

    if (!bankAccount) {
      return res.status(404).json({ error: "Bank account not found" });
    }

    const transactions = await Transaction.find({
      user: userId,
      bankAccount: bankAccountId,
    });

    // Process stock transactions
    const stockTransactions = transactions.filter(
      (txn) => txn.category === "Stock Purchase"
    );

    const stockSymbols = stockTransactions
      .map((txn) => {
        const match = txn.description.match(/Stock Purchase: (.+) \((.+)\)/);
        if (!match) {
          console.warn(`Invalid stock purchase description format: ${txn.description}`);
          return null;
        }
        return match[2];
      })
      .filter(Boolean);

    const stocks = await Stock.find({
      user: userId,
      symbol: { $in: stockSymbols },
    });

    const totalIncomeFromBank = (bankAccount.income || 0) * 12;

    let capitalGains = 0;
    let stcgTax = 0;

    if (stocks.length > 0) {
      for (const stock of stocks) {
        if (!stock.purchasePrice || !stock.quantity) {
          console.warn(`Skipping stock with missing data: ${JSON.stringify(stock)}`);
          continue;
        }

        const currentPrice = stock.purchasePrice * 1.1;
        const gain = (currentPrice - stock.purchasePrice) * stock.quantity;
        capitalGains += gain > 0 ? gain : 0;
      }
      stcgTax = capitalGains * 0.15;
    }

    const totalIncome = totalIncomeFromBank + capitalGains;

    // Calculate deductions
    const housingExpenses = transactions
      .filter((txn) => txn.category === "Housing")
      .reduce((sum, txn) => sum + txn.amount, 0);

    // Cap housing expenses deduction at ₹50,000
    const housingDeduction = Math.min(housingExpenses, 50000);

    // Assume a small Section 80C deduction (e.g., ₹10,000 for insurance, PPF, etc.)
    const section80CDeduction = 10000;

    // Total deductions
    const deductions = housingDeduction + section80CDeduction;

    const taxableIncome = Math.max(totalIncome - deductions, 0);

    let tax = 0;
    if (taxableIncome > 300000) {
      if (taxableIncome <= 600000) {
        tax = (taxableIncome - 300000) * 0.05;
      } else if (taxableIncome <= 900000) {
        tax = 300000 * 0.05 + (taxableIncome - 600000) * 0.1;
      } else if (taxableIncome <= 1200000) {
        tax = 300000 * 0.05 + 300000 * 0.1 + (taxableIncome - 900000) * 0.15;
      } else if (taxableIncome <= 1500000) {
        tax = 300000 * 0.05 + 300000 * 0.1 + 300000 * 0.15 + (taxableIncome - 1200000) * 0.2;
      } else {
        tax = 300000 * 0.05 + 300000 * 0.1 + 300000 * 0.15 + 300000 * 0.2 + (taxableIncome - 1500000) * 0.3;
      }
    }

    tax += stcgTax;
    const cess = tax * 0.04;
    const totalTaxLiability = tax + cess;

    const taxRecord = new Tax({
      user: userId,
      financialYear,
      totalIncome,
      deductions,
      taxableIncome,
      taxLiability: totalTaxLiability,
    });

    await taxRecord.save();

    res.json({
      totalIncome,
      deductions,
      taxableIncome,
      taxLiability: totalTaxLiability,
      capitalGains,
      stcgTax,
    });
  } catch (error) {
    console.error("Error calculating tax:", error);
    res.status(500).json({ error: "Error calculating tax", details: error.message });
  }
});

// Generate pre-filled tax form for a specific bank account
router.get("/form", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const bankAccountId = req.query.bankAccountId;

    if (!bankAccountId) {
      return res.status(400).json({ error: "Bank account ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const bankAccount = await BankAccount.findOne({
      _id: bankAccountId,
      user: userId,
    });

    if (!bankAccount) {
      return res.status(404).json({ error: "Bank account not found" });
    }

    const transactions = await Transaction.find({
      user: userId,
      bankAccount: bankAccountId,
    });

    const stockTransactions = transactions.filter(
      (txn) => txn.category === "Stock Purchase"
    );

    const stockSymbols = stockTransactions
      .map((txn) => {
        const match = txn.description.match(/Stock Purchase: (.+) \((.+)\)/);
        if (!match) {
          console.warn(`Invalid stock purchase description format: ${txn.description}`);
          return null;
        }
        return match[2];
      })
      .filter(Boolean);

    const stocks = await Stock.find({
      user: userId,
      symbol: { $in: stockSymbols },
    });

    const totalIncomeFromBank = (bankAccount.income || 0) * 12;

    let capitalGains = 0;
    for (const stock of stocks) {
      if (!stock.purchasePrice || !stock.quantity) continue;
      capitalGains += (stock.purchasePrice * 1.1 - stock.purchasePrice) * stock.quantity;
    }

    const totalIncome = totalIncomeFromBank + capitalGains;

    const housingExpenses = transactions
      .filter((txn) => txn.category === "Housing")
      .reduce((sum, txn) => sum + txn.amount, 0);

    const housingDeduction = Math.min(housingExpenses, 50000);
    const section80CDeduction = 10000;
    const deductions = housingDeduction + section80CDeduction;

    const taxableIncome = Math.max(totalIncome - deductions, 0);

    const taxForm = {
      financialYear: "2024-25",
      name: user.name || "Unknown User", // Use user.name instead of user.username
      pan: "ABCDE1234F",
      bankAccountName: bankAccount.name,
      totalIncome: totalIncome,
      incomeFromSalary: totalIncomeFromBank,
      incomeFromCapitalGains: capitalGains,
      deductions: deductions,
      taxableIncome: taxableIncome,
    };

    res.json(taxForm);
  } catch (error) {
    console.error("Error generating tax form:", error);
    res.status(500).json({ error: "Error generating tax form", details: error.message });
  }
});

module.exports = router;
