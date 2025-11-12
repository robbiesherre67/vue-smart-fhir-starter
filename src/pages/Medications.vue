<template>
  <div>
    <h2>Medications</h2>

    <pre v-if="error">{{ error }}</pre>

    <ul v-else-if="meds.length">
      <li v-for="(m, i) in meds" :key="i">
        <strong>{{ displayName(m) }}</strong>
        — {{ m.status || "unknown" }}
        <span v-if="m.authoredOn">
          (Prescribed: {{ formatDate(m.authoredOn) }})
        </span>
      </li>
    </ul>

    <div v-else>Loading…</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { fhir } from "../fhir";

const meds = ref([]);
const error = ref("");

function displayName(med) {
  const code = med.medicationCodeableConcept;
  if (code?.text) return code.text;
  if (code?.coding?.[0]?.display) return code.coding[0].display;
  return "Medication";
}

function formatDate(d) {
  return new Date(d).toLocaleDateString();
}

onMounted(async () => {
  try {
    const bundle = await fhir.getMedications();
    meds.value = bundle.entry?.map(e => e.resource) || [];
  } catch (e) {
    error.value = String(e);
  }
});
</script>
