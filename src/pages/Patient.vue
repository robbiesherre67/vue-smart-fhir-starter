<template>
    <div>
      <h2>Patient</h2>
      <pre v-if="error">{{ error }}</pre>
      <div v-else-if="!patient">Loading…</div>
      <div v-else>
        <p><strong>Name:</strong> {{ fullName }}</p>
        <p><strong>DOB:</strong> {{ patient.birthDate || "—" }}</p>
        <p><strong>ID:</strong> {{ patient.id }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from "vue";
  import { fhir } from "../fhir";
  
  const patient = ref(null);
  const error = ref("");
  
  const fullName = computed(() => {
    const name = patient.value?.name?.[0];
    return [name?.given?.join(" "), name?.family].filter(Boolean).join(" ") || "—";
  });
  
  onMounted(async () => {
    try { patient.value = await fhir.getPatient(); }
    catch (e) { error.value = String(e); }
  });
  </script>
  