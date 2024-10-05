<template>
  <div class="inc-exp-container">
    <div>
      <h4>Income</h4>
      <p class="money plus">+{{currency}}{{income}}</p>
    </div>
    <div>
      <h4>Expenses</h4>
      <p class="money minus">{{currency}}{{expenses}}</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

defineProps({
    income: {
        type: Number,
        required: true,
    },
    expenses: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
})
</script>
