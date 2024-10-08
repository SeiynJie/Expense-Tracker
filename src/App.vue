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
import Template from "./views/Template.vue"; // Import the Template.vue component

// Load dark mode state from localStorage
onMounted(() => {
  const isDarkMode = localStorage.getItem('darkMode');
  if (isDarkMode === 'enabled') {
    document.querySelector('html').classList.add('my-app-dark');
  }

  // Load items from localStorage if they exist
  const savedItems = localStorage.getItem('menuItems');

  if (savedItems) {
    // Parse saved items and assign to items.value with added command
    const parsedItems = JSON.parse(savedItems);
    const pages = parsedItems.find(item => item.label === 'Pages'); // Find the "Pages" section

    if (pages && pages.items) {
      // Loop through each item under "Pages" and create routes based on the labels
      pages.items.forEach(page => {
        const routePath = `/${page.label.toLowerCase()}`; // Use route if it exists or construct one
        
        // Add command to the page item
        page.command = () => {
          console.log(`${page.label} clicked`);
          router.push(routePath);
        };

        // Register the route dynamically
        router.addRoute({
          path: routePath,
          component: Template, // Dynamically recreate each route with the Template component
        });
      });
    }

    // Update items.value with the modified pages that now include commands
    items.value = parsedItems;
    console.log(items.value);
  }
});

// Initialize items with a ref, will load from localStorage later
const items = ref([
  {
    label: 'Pages',
    items: [
    ]
  },
]);

// Function to save items to localStorage
function saveItemsToLocalStorage() {
  localStorage.setItem('menuItems', JSON.stringify(items.value));
}

// Function to add a new item under the "Pages" section
function addItemToMenu() {
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  let baseLabel = currentMonth;
  let label = baseLabel;
  let route = `/${currentMonth.toLowerCase()}`;

  // Find the "Pages" section
  const pages = items.value.find(item => item.label === 'Pages');

  if (!pages) {
    console.error("Pages section not found!");
    return;
  }

  // Check for duplicates and increment numbering
  let counter = 1;
  let existingItem = pages.items?.find(subItem => subItem.label === label);
  
  while (existingItem) {
    // Increment label and route if a duplicate is found
    counter++;
    label = `${baseLabel} (${counter})`;
    route = `/${baseLabel.toLowerCase()}-${counter}`;
    
    existingItem = pages.items?.find(subItem => subItem.label === label);
  }

  // Push the new item under the "Pages" item
  pages.items.push({
    label: label,
    route: route,
    command: () => {
      console.log(`${label} clicked`);
      router.push(route);  // Add navigation command
    }
  });

  console.log(items.value);
  
  // Dynamically register the route for the new month
  router.addRoute({
    path: route,
    component: Template,
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