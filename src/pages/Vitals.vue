<template>
    <div>
      <h2>Vitals</h2>
      <pre v-if="error">{{ error }}</pre>
      <ul v-else-if="bundle">
        <li v-for="(e,i) in entries" :key="i">
          {{ e.code?.text || e.code?.coding?.[0]?.display || "Observation" }}
          — {{ e.valueQuantity?.value }} {{ e.valueQuantity?.unit }}
          ({{ e.effectiveDateTime || e.issued || "n/a" }})
        </li>
      </ul>
      <div v-else>Loading…</div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from "vue";
  import { fhir } from "../fhir";
  const bundle = ref(null); const error = ref("");
  
  const entries = computed(() => bundle.value?.entry?.map(e => e.resource).filter(Boolean) || []);
  
  onMounted(async () => {
    try { bundle.value = await fhir.getObservations(); }
    catch (e) { error.value = String(e); }
  });
  </script>
  