<template>
  <MainHeader />
  <div class="container">
    <MainBalance :actualTotal="+actualTotal" :projectedTotal="+projectedTotal"
      @currencyChanged="handleCurrencyChange" />
    <IncomeExpenses :actualIncome="+actualIncome" :projectedIncome="+projectedIncome" :actualExpenses="+actualExpenses"
      :projectedExpenses="+projectedExpenses" :currency="currency" />
    <TransactionList :transactions="transactions" :currency="currency" @transactionDeleted="handleTransactionDeleted"
      @transactionEdited="handleTransactionEdited" />
    <AddTransaction @transactionSubmitted="handleTransactionSubmitted" />
  </div>
</template>

<script setup>
// Main components
import MainHeader from "../components/MainHeader.vue";
import MainBalance from "../components/MainBalance.vue";
import IncomeExpenses from "../components/IncomeExpenses.vue";
import TransactionList from "../components/TransactionList.vue";
import AddTransaction from "../components/AddTransaction.vue";

import { useToast } from "vue-toastification";

// Importing stuff from vue
import { ref, computed, onMounted, onUpdated } from "vue";
import router from "@/router";

const toast = useToast() // Notifications

const transactions = ref([]);

const currentRoute = router.currentRoute

function loadTransactions(){
  const savedTransactions = JSON.parse(localStorage.getItem('transactions')) || {}; // Initialize as an empty object if not present
  const savedCurrency = localStorage.getItem('currency'); // Load global currency setting

  if (savedCurrency) {
    currency.value = savedCurrency;
  }

  // Load transactions specific to the current route
  const routePath = currentRoute.value.path; // Get current route path
  if (savedTransactions[routePath]) {
    transactions.value = savedTransactions[routePath]; // Load transactions for the current route
    console.log(`Loaded transactions for ${routePath}:`, transactions.value);
  }
}
// Load saved data
onMounted(() => {
  loadTransactions()
});

// Update transactions when the route changes
onUpdated(() => {
  console.log('Route changed to:', currentRoute.value.path);
})

// Save to local storage
const saveToLocalStorage = () => {
  const routePath = currentRoute.value.path; // Get current route path
  const savedTransactions = JSON.parse(localStorage.getItem('transactions')) || {}; // Initialize as an empty object if not present

  // Update transactions for the current route
  savedTransactions[routePath] = transactions.value;
  console.log(savedTransactions)

  // Save the entire transactions object back to local storage
  localStorage.setItem('transactions', JSON.stringify(savedTransactions)); // Save all transactions under the main transactions table
  localStorage.setItem('currency', currency.value); // Save global currency setting
};

let currency = ref(''); // Replace this with the selected currency symbol

// Handle currency change
const handleCurrencyChange = (newCurrency) => {
  if (!newCurrency) {
    toast.error('Please enter a currency symbol')
    return
  }

  // Make new currency a string
  currency.value = newCurrency;
  console.log(`Currency changed to ${currency.value}`)
  saveToLocalStorage()
};

// Get total
const actualTotal = computed(() => {
  return transactions.value.reduce(
    (acc, transaction) => acc + transaction.actualCost,
    0
  );
});

const projectedTotal = computed(() => {
  return transactions.value.reduce(
    (acc, transaction) => acc + transaction.projectedCost,
    0
  );
})

// Get actual income
const actualIncome = computed(() => {
  return transactions.value
    .filter((transaction) => transaction.actualCost > 0)
    .reduce((acc, transaction) => acc + transaction.actualCost, 0)
    .toFixed(2);
});

// Get projected income
const projectedIncome = computed(() => {
  return transactions.value
    .filter((transaction) => transaction.projectedCost > 0)
    .reduce((acc, transaction) => acc + transaction.projectedCost, 0)
    .toFixed(2);
});

// Get actual expenses
const actualExpenses = computed(() => {
  return transactions.value
    .filter((transaction) => transaction.actualCost < 0)
    .reduce((acc, transaction) => acc + transaction.actualCost, 0)
    .toFixed(2);
});

// Get projected expenses
const projectedExpenses = computed(() => {
  return transactions.value
    .filter((transaction) => transaction.projectedCost < 0)
    .reduce((acc, transaction) => acc + transaction.projectedCost, 0)
    .toFixed(2);
});

// Handle transaction submitted
const handleTransactionSubmitted = (transactionData) => {
  transactions.value.push({
    id: transactionData.id,
    text: transactionData.text,
    projectedCost: transactionData.projectedCost,
    actualCost: transactionData.actualCost,
  });

  // console.log(transactions.value)
  saveToLocalStorage()
  toast.success('Transaction added', { timeout: 2000 })
}

// Handle transaction edited
const handleTransactionEdited = (transactionData) => {
  // Find the transaction to edit
  transactions.value.forEach((transaction) => {
    if (transaction.id === transactionData.id) {
      transaction.text = transactionData.text;
      transaction.projectedCost = transactionData.projectedCost;
      transaction.actualCost = transactionData.actualCost;
    }
  });
  saveToLocalStorage();
  // console.log(JSON.stringify(transactions.value))
}

// Handle transaction deletion
const handleTransactionDeleted = (id) => {
  transactions.value = transactions.value.filter((transaction) => transaction.id !== id)

  saveToLocalStorage()
  toast.success('Transaction deleted', { timeout: 2000 })
}
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
