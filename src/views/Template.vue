<template>
  <MainHeader :importedPageName="pageName" @pageNameChanged="handlePageNameChange" @deletePage="handleDeletePage" />
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

import { getDatabase, ref as firebaseRef, onValue } from "firebase/database";
// Importing stuff from vue
import { ref, computed, onMounted, onUpdated } from "vue";
import router from "@/router";

const toast = useToast() // Notifications

const transactions = ref([]);

const currentRoute = router.currentRoute

let previousRoute = null; // Variable to store the previous route

let pageName = ref('');
function loadPageName() {
  // Get the menuItems from localStorage
  let menuItems = JSON.parse(localStorage.getItem('menuItems'));

  if (menuItems && menuItems.length > 0) {
    // Find the "Pages" section
    const pages = menuItems.find(item => item.label === 'Pages');

    if (pages && pages.items) {
      // Loop through the pages' items to find a matching route
      const matchingPage = pages.items.find(page => page.route === currentRoute.value.path);

      if (matchingPage) {
        // If a match is found, set the pageName to the matching label
        pageName.value = matchingPage.label;
        console.log('Page Name:', pageName.value);
      } else {
        console.log('No matching route found in menuItems');
      }
    } else {
      console.log('Pages section not found in menuItems');
    }
  } else {
    console.log('No menuItems found in localStorage');
  }
}

function loadTransactions() {
  console.log('Route changed to:', currentRoute.value.path);

  // Load global currency setting if available
  const savedCurrency = localStorage.getItem('currency');
  if (savedCurrency) {
    currency.value = savedCurrency;
  }

  // Load saved transactions from localStorage, or initialize as an empty object
  let savedTransactions = JSON.parse(localStorage.getItem('transactions')) || {};

  // Get the current route path
  const routePath = currentRoute.value.path;

  // Reference to the current user's data in the database
  const currentUserUID = localStorage.getItem('userID');
  const database = getDatabase();
  const reference = firebaseRef(database, `users/${currentUserUID}/transactions`);
  console.log(reference);


  // If there are no transactions for the current route, initialize it
  // if (!savedTransactions[routePath]) {
  //   console.log(`No transactions found for ${routePath}. Initializing new transactions.`);
  //   savedTransactions[routePath] = [{
  //     id: Math.floor(Math.random() * 1000000), // Generate a random ID
  //     text: '',
  //     projectedCost: 0,
  //     actualCost: 0
  //   }];
  //   localStorage.setItem('transactions', JSON.stringify(savedTransactions));
  // }

  // // Load transactions for the current route
  // transactions.value = savedTransactions[routePath];
  // console.log(`Loaded transactions for ${routePath}:`, transactions.value);

  // Load transactions from the database
  onValue(reference, (snapshot) => {
    if (snapshot.exists()) {
      // Parse the snapshot data (string) into an array since savedTransactions is an object
      const userData = JSON.parse(snapshot.val()) 
      // console.log(userData)
      // console.log(typeof userData)
      // console.log(savedTransactions)
      // console.log(typeof savedTransactions)

      // const userDataObject = JSON.parse(userData);
      // console.log(userDataObject)
      // console.log(typeof userDataObject)

      savedTransactions = userData; // Use fetched data from the database
      localStorage.setItem('transactions', JSON.stringify(savedTransactions)); // Save fetched items to localStorage
      transactions.value = savedTransactions[routePath]; // Use fetched data from the database
      console.log(`Loaded transactions for ${routePath}:`, transactions.value);
    }
    // } else {
    //   console.log(`No transactions found in the database for ${currentRoute.value.path}. Initializing new transactions.`);
    //   savedTransactions[routePath] = [{ 
    //     id: Math.floor(Math.random() * 1000000), // Generate a random ID
    //     text: '', 
    //     projectedCost: 0, 
    //     actualCost: 0 
    //   }];
    //   localStorage.setItem('transactions', JSON.stringify(savedTransactions));
    // }

    // If there are no transactions for the current route, initialize it
    if (!savedTransactions[routePath]) {
      console.log(`No transactions found for ${routePath}. Initializing new transactions.`);
      savedTransactions[routePath] = [{
        id: Math.floor(Math.random() * 1000000), // Generate a random ID
        text: '',
        projectedCost: 0,
        actualCost: 0
      }];
    }

    // Load transactions for the current route
    transactions.value = savedTransactions[routePath];
    console.log(`Loaded transactions for ${routePath}:`, transactions.value);
  });
}


// Load saved data on component mount
onMounted(() => {
  previousRoute = currentRoute.value.path; // Store the initial route on mount
  loadTransactions();
  loadPageName()
  saveToLocalStorage()
});

// Update transactions only if the route changes
onUpdated(() => {
  const newRoute = router.currentRoute.value.path;

  // Only load transactions if the route has actually changed
  if (newRoute !== previousRoute) {
    localStorage.setItem('lastRoute', newRoute); // Save the last route
    loadTransactions();
    loadPageName()
    previousRoute = newRoute; // Update previousRoute to the new one
    console.log(`Previous route: ${previousRoute}`);
  }
});


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

// For changing the page name
const emit = defineEmits(['pageNameChanged', 'deletePage']);
const handlePageNameChange = (newPageName, currentRoute) => {
  emit('pageNameChanged', newPageName, currentRoute);
}

const handleDeletePage = (currentRoute) => {
  emit('deletePage', currentRoute);
}

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
.container {
  display: flex;
  flex-direction: column;
}
</style>
