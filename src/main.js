import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";

// Firebase for authentication 
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3bm1yrdO7g5i5m_AYx7rRUYeqL0zyUo0",
  authDomain: "vue---expense-tracker.firebaseapp.com",
  projectId: "vue---expense-tracker",
  storageBucket: "vue---expense-tracker.appspot.com",
  messagingSenderId: "1014776307252",
  appId: "1:1014776307252:web:c9487e4dd4e4aafbd2f461",
  measurementId: "G-LQG0ENVJGS"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Analytics
if (typeof window !== 'undefined') { // Analytics only works in a browser environment
  const analytics = getAnalytics(firebaseApp);
}

// Initialize Vue app
const app = createApp(App);

// Other libraries
app.use(router);
app.use(Toast);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: ".my-app-dark",
    },
  },
});

// Mount the Vue app
app.mount("#app");
