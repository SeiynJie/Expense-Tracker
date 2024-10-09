<template>
    <div>
        <h2>Expense Tracker & Planner - </h2>
        <textarea v-model="pageName" class="currency-input" @input="handlePageNameChange" placeholder="Change Page Name"
            rows="1.5"></textarea>
        <!-- <Button label="Save Route" @click="handlePageNameChange" /> -->
    </div>
</template>

<script setup>
import { ref, onMounted, onUpdated } from 'vue';
import router from '@/router';
import Button from 'primevue/button';

const currentRoute = router.currentRoute

let previousRoute = localStorage.getItem('lastRoute').value; // Variable to store the previous route
// 

const pageName = ref('');
// 4:15 PM
// It should first take in the page name as props

const emit = defineEmits(['pageNameChanged'])

// Handle currency change logic
const handlePageNameChange = () => {
    const currentRoute = router.currentRoute.value.path
    emit('pageNameChanged', pageName.value, currentRoute);   // Emit the page name
};

</script>

<style scoped>
div {
    display: flex;
    justify-content: space-between;
}

/* Style for the input field */
.currency-input {
    font-size: 24px;
    align-self: center;
    border: 0.5px solid #bebebe;
    border-radius: 15px;
    outline: none;
    width: 50%;
    height: auto;
    max-height: 90%;
    text-align: center;
    overflow-wrap: break-word;
    /* Handle text wrapping */
    white-space: pre-wrap;
    /* Preserve whitespace and allow wrapping */
    resize: none;
    /* Disable manual resizing */
}

/* button{
    height: 36px;
    align-self: center;
    margin-left: 10px;
    border-radius: 16px;
} */
</style>