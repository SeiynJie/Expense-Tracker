<template>
  <div class="inc-exp-container">
    <div>
      <h4>Projected Income
        <p class="money plus">+{{ currency }}{{ formatNumber(projectedIncome) }}</p>
      </h4>
    </div>
    <div>
      <h4>P. Expenses
        <p class="money minus">{{ currency }}{{ formatNumber(projectedExpenses) }}</p>
      </h4>
    </div>
    <div>
      <h4>Actual Income
        <p class="money plus">+{{ currency }}{{ formatNumber(actualIncome) }}</p>
      </h4>
    </div>
    <div>
      <h4>A. Expenses
        <p class="money minus">{{ currency }}{{ formatNumber(actualExpenses) }}</p>
      </h4>
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

<style scoped>

h4{
  font-size: .9em;
}

.inc-exp-container {
  display:flex;
  flex-direction: row;
  text-align: left;
  justify-content: space-between;
  align-content: space-between;
  margin: 1%;
}

@media (max-width: 750px){
  div{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-content: space-between;
    margin: 12px;
  }
}

</style>