<template>
  <main>
    <section class="sidebar">
      <Button label="Toggle Dark Mode" @click="toggleDarkMode()" />

      <PanelMenu :model="items"/>
      <Button label="Add new page" @click="addItemToMenu()" />
    </section>

    <section>
      <RouterView />
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { RouterLink, RouterView, useRouter } from 'vue-router';

const router = useRouter();

// -------------------- For different components using PrimeVue & Vuesax
import PanelMenu from "primevue/panelmenu";
import Button from 'primevue/button';

// Load dark mode state from localStorage
onMounted(() => {
  const isDarkMode = localStorage.getItem('darkMode');
  if (isDarkMode === 'enabled') {
    document.querySelector('html').classList.add('my-app-dark');
  }

  // Load items from localStorage if they exist
  const savedItems = localStorage.getItem('menuItems');
  if (savedItems) {
    items.value = JSON.parse(savedItems);
  }
});

// Initialize items with a ref, will load from localStorage later
const items = ref([
  {
    label: 'Pages',
    items: [
      { 
        label: 'September',
        command: () => {
          console.log('Reports');
          router.push('/about');
        }
      }
    ]
  },
]);

// Function to save items to localStorage
function saveItemsToLocalStorage() {
  localStorage.setItem('menuItems', JSON.stringify(items.value));
}

// Function to add a new item under the "Pages" section
import Template from "./views/Template.vue"; // Import the Template.vue component

// Function to add a new item under the "Pages" section
function addItemToMenu() {
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  let label = currentMonth;
  let route = `/${currentMonth.toLowerCase()}`;

  // Find the "Pages" section
  const pages = items.value.find(item => item.label === 'Pages');

  if (!pages) {
    console.error("Pages section not found!");
    return;
  }

  // Check for duplicates in the Pages section
  const existingItem = pages.items?.find(subItem => subItem.label === label);
  if (existingItem) {
    // Append "(1)" for duplicates
    label += ' (1)';
    route += '-1';
  }

  // Push the new item under the "Pages" item
  pages.items.push({
    label: label,
    command: () => {
      console.log(`${label} clicked`);
      router.push(route);
    }
  });

  // Dynamically register the route for the new month
  router.addRoute({
    path: route,
    component: Template,
    props: { month: label } // Pass the month as a prop if needed
  });

  // Save the updated items to localStorage
  saveItemsToLocalStorage();

  console.log(items.value);
}

function toggleDarkMode() {
  const element = document.querySelector('html');
  element.classList.toggle('my-app-dark');
  
  if (element.classList.contains('my-app-dark')) {
    localStorage.setItem('darkMode', 'enabled');
  } else {
    localStorage.setItem('darkMode', 'disabled');
  }
}
</script>

<style scoped>
main {
  display: flex;
  justify-content: space-between;
}

.sidebar {
  display: flex;
  flex-direction: column;
  width: 200px;
  height: 100vh;
  padding: 20px;
  gap: 5px;
  /* background-color: #f0f0f0; */
}
</style>