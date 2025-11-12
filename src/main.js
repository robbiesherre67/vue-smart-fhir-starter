import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import App from "./App.vue";
import Patient from "./pages/Patient.vue";
import Vitals from "./pages/Vitals.vue";
import Meds from "./pages/Medications.vue";
import Encounters from "./pages/Encounters.vue";
import Launch from "./pages/Launch.vue";
import Conditions from "./pages/Conditions.vue";

const router = createRouter({
  history: createWebHashHistory(), // <-- hash router = no server rewrites needed
  routes: [
    { path: "/", component: Patient },
    { path: "/vitals", component: Vitals },
    { path: "/meds", component: Meds },
    { path: "/encounters", component: Encounters },
    { path: "/conditions", component: Conditions },
    { path: "/launch", component: Launch }, // SMART launch endpoint
  ],
});

createApp(App).use(router).mount("#app");
