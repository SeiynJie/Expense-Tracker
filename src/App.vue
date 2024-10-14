<template>
  <main>
    <div class="sidebar">
      <div class="panelMenu" v-if="isLoggedIn == true">
        <PanelMenu :model="items" />

        <Button label="Add new page" @click="addItemToMenu()" />
      </div>

      <Dialog v-model:visible="visibleDialogue" modal header="Edit Page Info" :style="{ width: '25rem' }">
        <span>Update your information.</span>
        <div>
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

      <Button label="Toggle Dark Mode" @click="toggleDarkMode()" />
      <Button label="Save to database" @click="saveItemsToLocalStorage(null, forced = true)" />

      <Button label="Register" @click="router.push('/register')" v-if="isLoggedIn == false" />
      <Button label="Sign in" @click="router.push('/signin')" v-if="isLoggedIn == false" />
      <Button label="Sign out" @click="handleSignOut" v-if="isLoggedIn == true" />
    </div>
    <section>
      <RouterView @pageNameChanged="handlePageNameChange" @deletePage="handleDeletePage" />
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

import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
const isLoggedIn = ref(false);

// Firebase database
import { getDatabase, ref as firebaseRef, set, get, child, onValue } from "firebase/database";

import { useToast } from "vue-toastification";

const toast = useToast() // Notifications

let auth
let currentUser
onMounted(() => {
  // For dark mode since the actual loading of dark mode is embedded in loadData(), I'm just lazy xD so I copied the logic
  const isDarkMode = localStorage.getItem('darkMode');
  if (isDarkMode === 'enabled') {
    document.querySelector('html').classList.add('my-app-dark');
  }

  // Define an async function to handle authentication
  const initializeAuth = async () => {
    auth = await getAuth(); // Now you can await here
    console.log(auth)
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        isLoggedIn.value = true;
        currentUser = auth.currentUser;
        console.log(currentUser.uid)
        await loadData();
      } else {
        isLoggedIn.value = false;
        currentUser = null;
      }
    });
  };

  // Call the async function
  initializeAuth();
});

const handleSignOut = async () => {
  try {
    // Await writeUserData to ensure it completes before signing out
    await writeUserData();
    
    // Remove 'menuItems' and 'transactions' from localStorage ONLY AFTER writeUserData completes
    localStorage.removeItem('menuItems');
    localStorage.removeItem('transactions');
    localStorage.removeItem('lastRoute');

    // Sign out the user
    await signOut(auth);

    // Redirect to the home page
    await router.push('/');
    console.log('Successfully signed out and redirected to home');
  } catch (error) {
    console.error('Error during sign out:', error);
    toast.error('Failed to sign out. Please try again.');
  }
};


// Load dark mode state from localStorage
async function loadData() {
  const isDarkMode = localStorage.getItem('darkMode');
  if (isDarkMode === 'enabled') {
    document.querySelector('html').classList.add('my-app-dark');
  }

  // Load items from localStorage if they exist
  let savedItems;
  let lastRoute;

  try {
    savedItems = localStorage.getItem('menuItems');
    lastRoute = localStorage.getItem('lastRoute'); // Load the last saved route
  } catch (error) {
    console.error("Error accessing localStorage:", error);
    toast.error('Failed to access localStorage. Please try again later.');
    return; // Exit the function if an error occurs
  }

  // Initialize default values if no saved items exist
  if (!savedItems) {
    console.log('No saved menu items found in localStorage. Fetching from database.');

    // Fetch menu items from the database if localStorage is empty
    const database = getDatabase();
    const reference = firebaseRef(database, `users/${currentUser.uid}/menuItems`); // Reference to the current user's data
    console.log(reference)

    // onValue(reference, (snapshot) => {
    //   const data = snapshot.val();
    //   console.log(data)
    //   return
    // })
    // return
    // Use onValue to listen for real-time updates
    onValue(reference, (snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        localStorage.setItem('menuItems', userData); // Save fetched items to localStorage

        // Parse saved items and assign to items.value with added command
        try {
          const parsedItems = JSON.parse(localStorage.getItem('menuItems'))

          console.log(parsedItems)

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
              try {
                router.addRoute({
                  path: routePath,
                  component: Template, // Dynamically recreate each route with the Template component
                });
              } catch (error) {
                console.error(`Error adding route for ${page.label}:`, error);
                toast.error(`Failed to add route for ${page.label}.`);
              }
            });
          }

          // Update items.value with the modified pages that now include commands
          items.value = parsedItems;
          console.log(items.value);
        } catch (error) {
          console.error("Error parsing menu items:", error);
          toast.error('Failed to parse menu items. Please check your data.');
          return; // Exit the function if an error occurs
        }
      } else {
        console.log('No data available in the database. Initializing default values.');
        savedItems = JSON.stringify([{
          label: 'Pages',
          items: [{
            label: 'January',
            route: '/1',
            command: () => {
              console.log('January clicked');
              router.push('/1');
            },
          }],
        }]);
        localStorage.setItem('menuItems', savedItems); // Save default items to localStorage
      }
    }
    )

    const transactionsReference = firebaseRef(database, `users/${currentUser.uid}/transactions`);

    console.log(transactionsReference);

    try {
      // Fetch and initialize transactions from the database
      const data = get(transactionsReference)
        .then((snapshot) => {
          console.log(snapshot)
          if (snapshot.exists()) {
            const userData = snapshot.val()
            console.log(userData)
            localStorage.setItem('transactions', userData); // Save fetched items to localStorage
            console.log("----------------------------")
            console.log(localStorage.getItem('transactions'))
          }
          // Will only save when transactions from database have been initialized

          try {
            saveItemsToLocalStorage(); // Save items to localStorage
          } catch (error) {
            console.error("Error saving items to localStorage:", error);
            toast.error('Failed to save items to localStorage. Please try again later.');
          }

          // Navigate to the last route with retries
          if (lastRoute) {
            let success = false;
            let retries = 3; // Maximum number of retries

            while (!success && retries > 0) {
              try {
                router.push(lastRoute);
                success = true; // Navigation successful
              } catch (error) {
                retries--;
                console.error(`Failed to navigate to ${lastRoute}, retries left: ${retries}. Error: ${error.message}`);
                if (retries === 0) {
                  toast.error('Failed to navigate to the last route. Redirecting to homepage.');
                }
              }
            }

            if (!success) {
              try {
                router.push('/'); // Default to root if all retries failed
              } catch (error) {
                console.error("Error navigating to the homepage:", error);
              }
            }
          } else {
            try {
              router.push('/'); // Default to root if no last route is saved
            } catch (error) {
              console.error("Error navigating to the homepage:", error);
            }
          }
        })
    } catch (error) {
      console.error('Error in try block:', error);
    }

    // Check if transactions was set properly
    console.log(localStorage.getItem('transactions'))
  } else {
    items.value = JSON.parse(savedItems);
    console.log(items.value);
    const pages = items.value.find(item => item.label === 'Pages'); // Find the "Pages" section

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
        try {
          router.addRoute({
            path: routePath,
            component: Template, // Dynamically recreate each route with the Template component
          });
        } catch (error) {
          console.error(`Error adding route for ${page.label}:`, error);
          toast.error(`Failed to add route for ${page.label}.`);
        }
      });
    }
  }

  // Handle last route
  if (!lastRoute) {
    console.log('No last route found. Initializing default route.');
    lastRoute = '/1'; // Set the default route to the homepage
    try {
      localStorage.setItem('lastRoute', lastRoute);
    } catch (error) {
      console.error("Error saving last route to localStorage:", error);
      toast.error('Failed to save the last route. Please try again later.');
      return; // Exit the function if an error occurs
    }
  }
}

// For the deletion of pages confirmation
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

const handlePageNameChange = async (newPageName, currentRoute) => {
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

  await saveItemsToLocalStorage();
}

const handleDeletePage = async (currentRoute) => {
  // alert(currentRoute);
  // Get the transactions for the current route
  let savedTransactions = JSON.parse(localStorage.getItem('transactions')) || {};
  try {

    // Check matching route
    if (savedTransactions[currentRoute]) {
      // Remove the transactions for the current route
      delete savedTransactions[currentRoute];

      // Update the localStorage with the modified transactions
      localStorage.setItem('transactions', JSON.stringify(savedTransactions));

      console.log(`Transactions for route: ${currentRoute} have been deleted.`);
    } else {
      console.log(`No transactions found for route: ${currentRoute}`);
    }
  } catch (error) {
    console.error('Error deleting transactions for page:', error);
  }

  try {
    // Find the "Pages" section in the reactive items ref
    const pages = items.value.find(item => item.label === 'Pages');

    if (!pages || !pages.items) {
      console.error('Pages section not found or has no items');
      return;
    }

    // Find the item with the matching route
    const itemIndex = pages.items.findIndex(subItem => subItem.route === currentRoute);

    if (itemIndex === -1) {
      console.log(`No item found with route: ${currentRoute}`);
      return;
    }

    // Delete the item with the matching route
    pages.items.splice(itemIndex, 1);

    // Update the route and command for all items after the deleted one
    for (let i = itemIndex; i < pages.items.length; i++) {
      const oldRoute = pages.items[i].route;
      const newRoute = `/${i + 1}`;

      // Update the item's route
      pages.items[i].route = newRoute;

      // Update the item's command to reflect the new route
      pages.items[i].command = () => {
        console.log(`${pages.items[i].label} clicked`);
        router.push(newRoute);
      };

      // Update corresponding transactions for the new route
      if (savedTransactions[oldRoute]) {
        savedTransactions[newRoute] = savedTransactions[oldRoute];
        delete savedTransactions[oldRoute];
      }
    }

    localStorage.setItem('transactions', JSON.stringify(savedTransactions));

    const nextRoute = pages.items.length > 0 ? pages.items[0].route : '/'; // Default to '/' if no items are left
    router.push(nextRoute);

    // Update the localStorage with the modified items and transactions
    await saveItemsToLocalStorage();
    console.log(`Item with route: ${currentRoute} has been deleted, routes and commands updated.`);
  } catch (error) {
    console.error('An error occurred while deleting the page:', error);
  }
};

// Function for saving in the database
async function writeUserData(transactions, menuItems) {
  // Check if transactions or menuItems are empty and assign default values if needed
  if (!transactions || transactions === 'null' || transactions === 'undefined') {
    transactions = localStorage.getItem('transactions'); // Default to an empty array
  }

  if (!menuItems || menuItems === 'null' || menuItems === 'undefined') {
    menuItems = JSON.stringify(items.value) || JSON.stringify([]); // Default to an empty array
  }

  // console.log(transactions);
  // console.log(menuItems);
  toast.info('Saving data...', { timeout: 1500 });

  const database = getDatabase();
  const reference = firebaseRef(database, `users/${currentUser.uid}`);

  // Set the user dat
  set(reference, {
    transactions: transactions,
    menuItems: menuItems
  })
    .then(() => {
      console.log("Data saved successfully!");
      toast.success('Data saved to database!', { timeout: 1500 });
    })
    .catch((error) => {
      console.error("Error saving data:", error);
      toast.error('Error saving data to database!', { timeout: 1500 });
    });
}

let lastWriteTime = 0; // Initialize last write time
// Function to save items and last route to localStorage
async function saveItemsToLocalStorage(providedLastRoute = null, forced = false) {
  // Save the menu items
  localStorage.setItem('menuItems', JSON.stringify(items.value));

  localStorage.setItem('userID', currentUser.uid);

  // Save the last route, use the provided route or fallback to the current route
  const lastRoute = providedLastRoute || router.currentRoute.value.path; // Use providedLastRoute if given, else use current route
  localStorage.setItem('lastRoute', lastRoute);

  // Stringify the transactions and menuItems to pass into database saving function
  const transactions = localStorage.getItem('transactions')
  console.log(transactions);
  const menuItems = JSON.stringify(items.value)
  const currentTime = Date.now(); // Get the current time in milliseconds
  const timeSinceLastWrite = currentTime - lastWriteTime; // Calculate the time since the last write

  // Check if 5 minutes (300,000 milliseconds) have passed since the last write
  // Can also be ran forcefully with the forced parameter
  if (forced || timeSinceLastWrite >= 120000) { // 5 minutes in milliseconds
    await writeUserData(transactions, menuItems); // Call writeUserData
    lastWriteTime = currentTime; // Update the last write time
  }
}

// Function to add a new item under the "Pages" section
async function addItemToMenu() {
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
  await saveItemsToLocalStorage();

  console.log(items.value);
}

async function toggleDarkMode() {
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
  margin-right: 15px;
  overflow-y: auto;
  overflow-x: auto;
  width: 100%;
}

section {
  margin-left: 15px;
}

.sidebar,
.panelMenu {
  display: flex;
  flex-direction: column;
  width: 300px;
  height: auto;
  /* padding: 20px; */
  gap: 5px;
  /* background-color: #f0f0f0; */
}
</style>