<template>
  <main>
    <div class="sidebar">
      <Button label="Toggle Dark Mode" @click="toggleDarkMode()" />

      <PanelMenu :model="items"/>

      <Button label="Add new page" @click="addItemToMenu()" />

      <Dialog v-model:visible="visibleDialogue" modal header="Edit Page Info" :style="{ width: '25rem' }">
        <span>Update your information.</span>
        <div >
          <label for="username">Username</label>
          <InputText id="username" class="flex-auto" autocomplete="off" />
        </div>
        <div>
          <label for="email">Email</label>
          <InputText id="email" class="flex-auto" autocomplete="off" />
        </div>
        <div>
          <Button type="button" label="Cancel" severity="secondary" @click="visibleDialogue = false"></Button>
          <Button type="button" label="Save" @click="visibleDialogue = false"></Button>
        </div>
      </Dialog>
    </div>
    <section>
      <RouterView @pageNameChanged="handlePageNameChange" />
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
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';

import Template from "./views/Template.vue"; // Import the Template.vue component

// Load dark mode state from localStorage
function loadData(){
  const isDarkMode = localStorage.getItem('darkMode');
  if (isDarkMode === 'enabled') {
    document.querySelector('html').classList.add('my-app-dark');
  }

  // Load items from localStorage if they exist
  let savedItems = localStorage.getItem('menuItems');
  let lastRoute = localStorage.getItem('lastRoute'); // Load the last saved route

  // Initialize default values if no saved items exist
  if (!savedItems) {
    console.log('No saved menu items found. Initializing default values.');
    const defaultMenuItems = [
      {
        label: 'Pages',
        items: [
          {
            label: 'January',
            route: '/1',
            command: () => {
              console.log('January clicked');
              router.push('/1');
            }
          },
        ]
      },
    ];

    // Assign the default items to items.value and save them to localStorage
    items.value = defaultMenuItems;
    localStorage.setItem('menuItems', JSON.stringify(defaultMenuItems));
    savedItems = localStorage.getItem('menuItems');
  }

  if (!lastRoute) {
    console.log('No last route found. Initializing default route.');
    lastRoute = '/'; // Set the default route to the homepage
    localStorage.setItem('lastRoute', lastRoute);
  }

  // Parse saved items and assign to items.value with added command
  const parsedItems = JSON.parse(savedItems);
  const pages = parsedItems.find(item => item.label === 'Pages'); // Find the "Pages" section

  if (pages && pages.items) {
    // Loop through each item under "Pages" and create routes based on the labels
    pages.items.forEach(page => {
      const routePath = page.route || `/${page.label.toLowerCase()}`; // Use route if it exists or construct one

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
  saveItemsToLocalStorage();

  // If there's a last route, navigate to it
  if (lastRoute) {
    router.push(lastRoute);
  } else {
    router.push('/'); // Default to root if no last route is saved
  }
}
onMounted(() => {
  loadData()
});

const visibleDialogue = ref(false);

// Initialize items with a ref, will load from localStorage later
const items = ref([
  {
    label: 'Pages',
    items: [
      {
        label: 'January',
        route: '/1',
        command: () => {
          console.log('January clicked');
          router.push('/1');
        },
      },
    ]
  },
]);

const handlePageNameChange = (newPageName, currentRoute) => {
  // console.log('Page Name:', newPageName, currentRoute);

  // Update the page name in the items array
  const pages = items.value.find(item => item.label === 'Pages');
  if (pages) {
    pages.items.forEach(page => {
      if (page.route === currentRoute) {
        page.label = newPageName;
      }
    });
  }

  saveItemsToLocalStorage();
}

// Function to save items and last route to localStorage
function saveItemsToLocalStorage() {
  // Save the menu items
  localStorage.setItem('menuItems', JSON.stringify(items.value));

  // Save the last route
  const lastRoute = router.currentRoute.value.path; // Assuming currentRoute is reactive and holds the current route path
  localStorage.setItem('lastRoute', lastRoute);
}

// Function to add a new item under the "Pages" section
function addItemToMenu() {
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  let baseLabel = currentMonth;
  let label = baseLabel;

  // Find the "Pages" section
  const pages = items.value.find(item => item.label === 'Pages');

  if (!pages) {
    console.error("Pages section not found!");
    return;
  }

  // Calculate the new route based on the number of existing items
  const newIndex = pages.items.length + 1; // Next route number
  const route = `/${newIndex}`; // Route will be based on the number of existing items

  // Check for duplicate labels and increment numbering if needed
  let counter = 1;
  let existingItem = pages.items?.find(subItem => subItem.label === label);

  while (existingItem) {
    // Increment the label if a duplicate is found
    counter++;
    label = `${baseLabel} (${counter})`;
    existingItem = pages.items?.find(subItem => subItem.label === label);
  }

  // Push the new item under the "Pages" section
  pages.items.push({
    label: label,
    route: route,
    command: () => {
      console.log(`${label} clicked`);
      router.push(route); // Add navigation command with the new route
    }
  });

  console.log(items.value);

  // Dynamically register the new route based on the number of items
  router.addRoute({
    path: route,
    component: Template,
  });

  // Save the updated items and route to localStorage
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
  width: 300px;
  height: 100vh;
  padding: 20px;
  gap: 5px;
  /* background-color: #f0f0f0; */
}
</style>