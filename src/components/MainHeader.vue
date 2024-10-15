<template>
    <div>
        <h2>Expense Tracker & Planner - </h2>
        <textarea v-model="pageName" class="name-input" @input="handlePageNameChange" placeholder="Change Page Name"
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
    align-items: center;
    flex-wrap: wrap; /* Allow wrapping on smaller screens */
    margin: 10px 0; /* Add some spacing between elements */
}

/* Style for the input field */
.name-input {
    font-size: 1em; /* Use relative font size */
    font-family: 'Roboto', sans-serif;
    border: 0.5px solid #bebebe;
    border-radius: 15px;
    outline: none;
    width: 30%; /* Adjust width dynamically */
    min-width: 30%;
    max-width: 50%; /* Ensure max width */
    height: auto;
    text-align: center;
    overflow-wrap: break-word;
    white-space: pre-wrap;
    resize: none;
    padding: 10px; /* Add padding for better spacing */
    box-sizing: border-box; /* Ensure padding doesn't increase width */
}

/* Style for delete button */
.deleteButton {
    height: 36px;
    align-self: center;
    margin-left: 10px;
    border-radius: 16px;
    background-color: red;
    color: white;
    border: none;
    padding: 0 15px; /* Adjust padding for better sizing */
    cursor: pointer; /* Add pointer to indicate it's clickable */
}

.confirmDelete {
    background-color: darkred;
    border: none;
}

/* Media Queries for responsiveness */
@media (max-width: 1000px) {
    .name-input {
        width: 100%; /* Full width on smaller screens */
    }
}

@media (max-width: 750px) {
    div {
        flex-direction: column; /* Stack elements vertically */
    }
    
    .name-input {
        font-size: 1.2em; /* Reduce font size for smaller screens */
        width: 70%; /* Ensure input takes full width */
    }
    
    .deleteButton {
        width: 52%; /* Full-width button on small screens */
        margin-top: 10px; /* Add margin for spacing */
    }
}

</style>
