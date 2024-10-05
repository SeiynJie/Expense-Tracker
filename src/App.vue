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

  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
  </nav>

  <RouterView />
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'

// Main components
import MainHeader from "./components/MainHeader.vue";
import MainBalance from "./components/MainBalance.vue";
import IncomeExpenses from "./components/IncomeExpenses.vue";
import TransactionList from "./components/TransactionList.vue";
import AddTransaction from "./components/AddTransaction.vue";

// Importing stuff from vue
import { ref, computed, onMounted } from "vue";

// For notifications
import { useToast } from "vue-toastification";

const toast = useToast() // Notifications

const transactions = ref([]);

// Load saved data
onMounted(() => {
  const savedTransactions = JSON.parse(localStorage.getItem('transactions'))
  const savedCurrency = localStorage.getItem('currency')
  if (savedCurrency) {
    currency.value = savedCurrency
  }

  if (savedTransactions) {
    transactions.value = savedTransactions
  }
})

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

// Save to local storage
const saveToLocalStorage = () => {
  localStorage.setItem('transactions', JSON.stringify(transactions.value))
  localStorage.setItem('currency', currency.value)
}

</script>

<style scoped>
nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}
</style>