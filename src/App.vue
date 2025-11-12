<template>
  <div style="padding:16px; max-width:900px; margin:auto;">
    <h1>Vue SMART on FHIR Demo</h1>

    <nav style="display:flex; flex-wrap:wrap; gap:12px; margin:12px 0;">
      <router-link to="/">Patient</router-link>
      <router-link to="/vitals">Vitals</router-link>
      <router-link to="/conditions">Conditions</router-link>
      <router-link to="/meds">Medications</router-link>
      <router-link to="/encounters">Encounters</router-link>
      <router-link to="/launch">SMART Launch</router-link>
    </nav>

    <router-view />
  </div>

  <!-- Mode Indicator (top-right) -->
  <div
    style="position:fixed; top:8px; right:12px; font-size:13px; color:#666; background:#fff; padding:4px 8px; border-radius:6px; box-shadow:0 0 4px rgba(0,0,0,0.1);"
  >
    Mode:
    <span v-if="isDemo">Demo SMART Launch</span>
    <span v-else-if="isMock">Mock</span>
    <span v-else>SMART OAuth</span>
  </div>
</template>

<script setup>
import { computed } from "vue";

const isMock = computed(() => import.meta.env.VITE_USE_MOCK === "1");
const isDemo = computed(() => import.meta.env.VITE_DEMO_LAUNCH === "1");
</script>
