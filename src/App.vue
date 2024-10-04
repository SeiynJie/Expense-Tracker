<template>
  <MainHeader />
  <div class="container">
    <MainBalance :total="+total" />
    <IncomeExpenses :income="+income" :expenses="+expenses" />
    <TransactionList :transactions="transactions" @transactionDeleted="handleTransactionDeleted" />
    <AddTransaction @transactionSubmitted="handleTransactionSubmitted" />
  </div>
</template>

<script setup>
// Main components
import MainBalance from "./components/MainBalance.vue";
import MainHeader from "./components/MainHeader.vue";
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

  if (savedTransactions) {
    transactions.value = savedTransactions
  } 
})

// Get total
const total = computed(() => {
  return transactions.value.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );
});

// Get income
const income = computed(() => {
  return transactions.value.filter((transaction) => transaction.amount > 0).reduce(
    (acc, transaction) => acc + transaction.amount,
    0).toFixed(2);
});

// Get expenses
const expenses = computed(() => {
  return transactions.value.filter((transaction) => transaction.amount < 0).reduce(
    (acc, transaction) => acc + transaction.amount,
    0).toFixed(2);
});

// Handle transaction submitted
const handleTransactionSubmitted = (transactionData) => {
  // console.log(transactionData)
  transactions.value.push({
    id: generateUniqueId(),
    text: transactionData.text,
    amount: transactionData.amount
  });

  saveToLocalStorage()
  toast.success('Transaction added')
}

// Helped function for generating unique id
const generateUniqueId = () => {
  return Math.floor(Math.random() * 1000000)
}

// Handle transaction deletion
const handleTransactionDeleted = (id) => {
  transactions.value = transactions.value.filter((transaction) => transaction.id !== id)

  saveToLocalStorage()
  toast.success('Transaction deleted')
}

// Save to local storage
const saveToLocalStorage = () => {
  localStorage.setItem('transactions', JSON.stringify(transactions.value))
}

</script>
