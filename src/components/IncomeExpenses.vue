<template>
  <div class="inc-exp-container">
    <div>
      <h4>Projected Income</h4>
      <p class="money plus">+{{ currency }}{{ formatNumber(projectedIncome) }}</p>
    </div>
    <div>
      <h4>P. Expenses</h4>
      <p class="money minus">{{ currency }}{{ formatNumber(projectedExpenses) }}</p>
    </div>
    <div>
      <h4>Actual Income</h4>
      <p class="money plus">+{{ currency }}{{ formatNumber(actualIncome) }}</p>
    </div>
    <div>
      <h4>A. Expenses</h4>
      <p class="money minus">{{ currency }}{{ formatNumber(actualExpenses) }}</p>
    </div>
  </div>
</template>

<script setup>
// Format numbers with commas
const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

defineProps({
  actualIncome: {
    type: Number,
    required: true,
  },
  projectedIncome: {
    type: Number,
    required: true,
  },
  actualExpenses: {
    type: Number,
    required: true,
  },
  projectedExpenses: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
});
</script>
