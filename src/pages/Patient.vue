<template>
  <div class="card">
    <header class="card-header">
      <div>
        <h2 class="card-title">Patient Summary</h2>
        <p class="card-subtitle">Core demographics and identifiers</p>
      </div>
      <span class="pill pill-blue">FHIR • Patient</span>
    </header>

    <div v-if="error" class="alert">
      {{ error }}
    </div>

    <section v-else-if="patient" class="card-body">
      <div class="field-row">
        <span class="field-label">Name</span>
        <span class="field-value">{{ fullName }}</span>
      </div>
      <div class="field-row">
        <span class="field-label">Date of Birth</span>
        <span class="field-value">{{ patient.birthDate || "—" }}</span>
      </div>
      <div class="field-row">
        <span class="field-label">Gender</span>
        <span class="field-value text-capitalize">{{ patient.gender || "—" }}</span>
      </div>
      <div class="field-row">
        <span class="field-label">Patient ID</span>
        <span class="field-value mono">{{ patient.id }}</span>
      </div>
    </section>

    <div v-else class="card-body card-empty">
      Loading patient record…
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
  try {
    patient.value = await fhir.getPatient();
  } catch (e) {
    error.value = String(e);
  }
});
</script>

<style scoped>
.card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 16px 14px;
  box-sizing: border-box;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 10px;
}

.card-title {
  margin: 0;
  font-size: 18px;
  color: #12355b;
}

.card-subtitle {
  margin: 4px 0 0;
  font-size: 12px;
  color: #718096;
}

.card-body {
  display: grid;
  gap: 8px;
  margin-top: 6px;
}

.card-empty {
  font-size: 13px;
  color: #64748b;
}

.field-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 6px 4px;
  border-bottom: 1px dashed #edf2f7;
}

.field-row:last-child {
  border-bottom: none;
}

.field-label {
  font-size: 12px;
  color: #718096;
}

.field-value {
  font-size: 14px;
  color: #1a365d;
  font-weight: 500;
}

.text-capitalize {
  text-transform: capitalize;
}

.mono {
  font-family: "SF Mono", ui-monospace, Menlo, Monaco, Consolas, "Liberation Mono",
    "Courier New", monospace;
  font-size: 12px;
}

.pill {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 500;
}

.pill-blue {
  background: #e3f2fd;
  color: #0d47a1;
}

.alert {
  margin-top: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  font-size: 13px;
}
</style>
