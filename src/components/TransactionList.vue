<template>
  <h3>History</h3>
  <div>
    <label>Transaction name</label>
    <label>Projected Cost</label>
    <label>Actual Cost</label>
  </div>
  
  <ul id="list" class="list">
    <li
    v-for="transaction in transactions"
    v-bind:key="transaction.id"
    v-bind:class="transaction.actualCost < 0 ? 'minus' : 'plus'"
    >
      <span class="items">
        <!-- Transaction text and amount are editable by default -->
        <input
          v-model="transaction.text"
          @blur="saveTransaction(transaction)"
          @keyup.enter="saveTransaction(transaction)"
          type="text"
          placeholder="Edit transaction text"
        />
        <input
          v-model="transaction.projectedCost"
          @blur="saveTransaction(transaction)"
          @keyup.enter="saveTransaction(transaction)"
          type="number"
          placeholder="Edit amount"
        />
        <input
          v-model="transaction.actualCost"
          @blur="saveTransaction(transaction)"
          @keyup.enter="saveTransaction(transaction)"
          type="number"
          placeholder="Edit amount"
        />
      </span>
      <button @click="deleteTransaction(transaction.id)" class="delete-btn">x</button>
    </li>
  </ul>
</template>

<script setup>
import { defineProps } from "vue";

// Define props for transactions and currency
defineProps({
  transactions: {
    type: Array,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
});

// Emit events
const emit = defineEmits(['transactionDeleted', 'transactionEdited']);

// Function to delete a transaction
const deleteTransaction = (id) => {
  emit('transactionDeleted', id);
};

// Function to save a transaction after editing
const saveTransaction = (transaction) => {
  emit('transactionEdited', transaction)
  // Here you can perform additional validation or save logic if needed
};
</script>

<style scoped>
div {
  display: flex;
  justify-content: space-evenly;
}

div label {
  text-align: center;
  width: 75%;
  padding: 0;
  margin: 0
}

span {
  display: flex;
  justify-content: space-between; /* Changed to space-between for better alignment */
  align-items: center;
  width: 100%;
}

/* Style for input fields */
input {
  margin-right: 10px;
  text-align: center;
  font-family: 'Lato', sans-serif;
  font-size: 18px;
  flex: 1; /* Make inputs fill available space */
}
</style>
