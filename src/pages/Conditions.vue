<template>
    <div>
      <h2>Conditions</h2>
  
      <pre v-if="error">{{ error }}</pre>
  
      <ul v-else-if="conditions.length">
        <li v-for="(c, i) in conditions" :key="i">
          <strong>{{ conditionName(c) }}</strong>
          — {{ clinicalStatus(c) }}
          <span v-if="c.onsetDateTime">
            (Onset: {{ formatDate(c.onsetDateTime) }})
          </span>
          <span v-if="c.abatementDateTime">
            (Resolved: {{ formatDate(c.abatementDateTime) }})
          </span>
        </li>
      </ul>
  
      <div v-else>Loading…</div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { fhir } from "../fhir";
  
  const conditions = ref([]);
  const error = ref("");
  
  function conditionName(c) {
    const code = c.code;
    return code?.text || code?.coding?.[0]?.display || "Condition";
  }
  
  function clinicalStatus(c) {
    return c.clinicalStatus?.coding?.[0]?.display || c.clinicalStatus?.text || "unknown";
  }
  
  function formatDate(d) {
    if (!d) return "n/a";
    return new Date(d).toLocaleDateString();
  }
  
  onMounted(async () => {
    try {
      const bundle = await fhir.getConditions();
      conditions.value = bundle.entry?.map(e => e.resource) || [];
    } catch (e) {
      error.value = String(e);
    }
  });
  </script>
  