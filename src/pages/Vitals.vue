<template>
  <div class="card">
    <header class="card-header">
      <div>
        <h2 class="card-title">Vitals</h2>
        <p class="card-subtitle">Recent observations from the patient record</p>
      </div>
      <span class="pill pill-blue">FHIR • Observation</span>
    </header>

    <div v-if="error" class="alert">
      {{ error }}
    </div>

    <section v-else-if="entries.length" class="card-body list">
      <article v-for="(obs, i) in entries" :key="i" class="list-item">
        <div class="list-main">
          <div class="list-title">
            {{ displayName(obs) }}
          </div>
          <div class="list-meta">
            <span v-if="obs.effectiveDateTime">
              Observed: {{ formatDate(obs.effectiveDateTime) }}
            </span>
            <span v-else-if="obs.issued">
              Issued: {{ formatDate(obs.issued) }}
            </span>
          </div>
        </div>
        <div class="list-value" v-if="obs.valueQuantity">
          {{ obs.valueQuantity.value }} {{ obs.valueQuantity.unit }}
        </div>
      </article>
    </section>

    <div v-else class="card-body card-empty">
      No vitals found for this patient in the current dataset.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { fhir } from "../fhir";

const bundle = ref(null);
const error = ref("");

const entries = computed(() =>
  bundle.value?.entry?.map(e => e.resource).filter(Boolean) || []
);

function displayName(o) {
  return (
    o.code?.text ||
    o.code?.coding?.[0]?.display ||
    (o.code?.coding?.[0]?.code ? `Observation ${o.code.coding[0].code}` : "Observation")
  );
}

function formatDate(d) {
  if (!d) return "n/a";
  return new Date(d).toLocaleString();
}

onMounted(async () => {
  try {
    bundle.value = await fhir.getObservations();
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
  margin-top: 6px;
}

.card-empty {
  font-size: 13px;
  color: #64748b;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.list-item {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 8px;
  border-radius: 8px;
  border: 1px solid #edf2f7;
  background: #f8fafc;
}

.list-main {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.list-title {
  font-size: 14px;
  font-weight: 600;
  color: #1a365d;
}

.list-meta {
  font-size: 12px;
  color: #718096;
}

.list-value {
  font-size: 14px;
  font-weight: 600;
  color: #0d47a1;
  white-space: nowrap;
  align-self: center;
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
