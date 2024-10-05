<template>
    <div class="overallBalance">
        <div class="balanceDiv">
            <h4>Your Balance</h4>
            <!-- Input field for entering the currency symbol -->
            <input v-model="selectedCurrency" class="currency-input" @input="handleCurrencyChange" placeholder="_"
                maxlength="3" />
        </div>
        <div class="projectedBalance">
            <h4>Projected Balance</h4>
            <h1 id="projectedBalance">
                {{ projectedTotal }}
            </h1>
        </div>
        <div class="actualBalance">
            <h4>Actual balance</h4>
            <h1 id="actualBalance">
                {{ actualTotal }}
            </h1>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

// Define props for the total amount
defineProps({
    actualTotal: {
        type: Number,
        required: true,
    },
    projectedTotal: {
        type: Number,
        required: true,
    },
});

// Ref for selected currency symbol (default to PHP)
let selectedCurrency = ref('');
selectedCurrency.value = localStorage.getItem('currency');

// Emit event to send data to parent
const emit = defineEmits(['currencyChanged']);

// Function to handle currency change
const handleCurrencyChange = () => {
    emit('currencyChanged', selectedCurrency.value);
};
</script>

<style scoped>
.overallBalance {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* Style for the input field */
.currency-input {
    font-size: 2.5rem;
    border: 0.5px solid #bebebe;
    opacity: 1;
    border-radius: 25px;
    /* background: transparent; */
    outline: none;
    /* Remove default outline on focus */
    width: 80px;
    /* Set width to accommodate currency symbols */
    text-align: center;
    /* Center align the text */
}
</style>