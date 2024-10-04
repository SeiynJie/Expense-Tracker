<template>
  <h3>History</h3>
  <ul id="list" class="list">
    <!-- Just having this loop through the transactions array and then display the values. The vbindclass is for assigning the class to the li element. Since in CSS, we have a class for the plus and minus. -->
    <li
      v-for="transaction in transactions"
      v-bind:key="transaction.id"
      v-bind:class="transaction.amount < 0 ? 'minus' : 'plus'"
    >
      {{ transaction.text }}<span>₱{{ transaction.amount }}</span
      ><button @click="deleteTransaction(transaction.id)" class="delete-btn">x</button>
    </li>
  </ul>
</template>

<script setup>
import { defineProps } from "vue";

defineProps({
  transactions: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['transactionDeleted'])
const deleteTransaction = (id) => {
  emit('transactionDeleted', id)
}
</script>

<!-- <script setup>
// This is the shortest and newest syntax but we'll use the transactions in the app.vue instead
const transactions = [
    { id: 1, text: "Flower", amount: -20 },
    { id: 2, text: "Salary", amount: 300 },
    { id: 3, text: "Book", amount: -10 },
    { id: 4, text: "Camera", amount: 150 },
]
</script> -->

<!-- 
<script>
// Another way of doing it:
export default {
  setup() {
    const transactions = [
      { id: 1, text: "Flower", amount: -20 },
      { id: 2, text: "Salary", amount: 300 },
      { id: 3, text: "Book", amount: -10 },
      { id: 4, text: "Camera", amount: 150 },
    ];
    return { transactions };
  },
};

// Old syntax
// export default {
//     data () {
//         return {
//             transactions: [
//                 {id: 1, text: 'Flower', amount: -20},
//                 {id: 2, text: 'Salary', amount: 300},
//                 {id: 3, text: 'Book', amount: -10},
//                 {id: 4, text: 'Camera', amount: 150}
//             ],
//         };
//     },
// }
</script> -->
