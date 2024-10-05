<template>
    <h4>Your Balance</h4>
    <div class="balanceDiv">
        <!-- Input field for entering the currency symbol -->
        <input v-model="selectedCurrency" class="currency-input" @input="handleCurrencyChange"
            placeholder="_" maxlength="3" 
        />
        <h1 id="balance">
            {{ total }}
        </h1>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

// Define props for the total amount
defineProps({
    total: {
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
.balanceDiv {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* Align items vertically center */
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