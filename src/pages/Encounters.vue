<template>
    <div>
      <h2>Encounters</h2>
  
      <pre v-if="error">{{ error }}</pre>
  
      <ul v-else-if="encounters.length">
        <li v-for="(e, i) in encounters" :key="i">
          <strong>{{ encounterType(e) }}</strong>
          — {{ e.status || "unknown" }}
          <span v-if="e.period">
            ({{ formatDate(e.period.start) }} → {{ formatDate(e.period.end) }})
          </span>
        </li>
      </ul>
  
      <div v-else>Loading…</div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { fhir } from "../fhir";
  
  const encounters = ref([]);
  const error = ref("");
  
  function encounterType(enc) {
    const type = enc.type?.[0]?.coding?.[0]?.display || enc.class?.display;
    return type || "Encounter";
  }
  
  function formatDate(d) {
    if (!d) return "n/a";
    return new Date(d).toLocaleDateString();
  }
  
  onMounted(async () => {
    try {
      const bundle = await fhir.getEncounters();
      encounters.value = bundle.entry?.map(e => e.resource) || [];
    } catch (e) {
      error.value = String(e);
    }
  });
  </script>  