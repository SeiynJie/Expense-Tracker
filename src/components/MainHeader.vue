<template>
    <div>
        <h2>Expense Tracker & Planner - </h2>
        <textarea v-model="pageName" class="currency-input" @input="handlePageNameChange" placeholder="Change Page Name"
            rows="1.5"></textarea>
        <Button class="deleteButton" label="Delete Page" @click="visible = true" />
        <Dialog v-model:visible="visible" modal header="Confirm Delete Page" :style="{ width: '25rem' }">
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button class="confirmDelete" label="Delete" @click="deletePage"></Button>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, onMounted, onUpdated } from 'vue';
import router from '@/router';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';

const pageName = ref('');

const emit = defineEmits(['pageNameChanged', 'deletePage']);

// Handle currency change logic
const handlePageNameChange = () => {
    const currentRoute = router.currentRoute.value.path
    emit('pageNameChanged', pageName.value, currentRoute);   // Emit the page name
};

const visible = ref(false);
function deletePage() {
    visible.value = false
    let currentRoute = localStorage.getItem('lastRoute')

    // alert(currentRoute)
    emit('deletePage', currentRoute);   // Emit the page name
}

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

.deleteButton {
    height: 36px;
    align-self: center;
    margin-left: 10px;
    border-radius: 16px;
    background-color: red;
    border-color: red;
}

.connfirmDelete {
    background-color: red;
    border-color: red;
}

</style>