<template>
  <div class="card">
    <header class="card-header">
      <div>
        <h2 class="card-title">Conditions</h2>
        <p class="card-subtitle">Active and historical diagnoses</p>
      </div>
      <span class="pill pill-blue">FHIR • Condition</span>
    </header>

    <div v-if="error" class="alert">
      {{ error }}
    </div>

    <section v-else-if="conditions.length" class="card-body list">
      <article v-for="(c, i) in conditions" :key="i" class="list-item">
        <div class="list-main">
          <div class="list-title">{{ conditionName(c) }}</div>
          <div class="list-meta">
            <span class="pill pill-soft">
              Status: {{ clinicalStatus(c) }}
            </span>
            <span v-if="verificationStatus(c)" class="pill pill-outline">
              Verification: {{ verificationStatus(c) }}
            </span>
          </div>
        </div>
        <div class="list-meta-right">
          <span class="meta-label">Timeline</span>
          <span class="meta-value">
            Onset: {{ formatDate(c.onsetDateTime) }}
            <span v-if="c.abatementDateTime">
              • Resolved: {{ formatDate(c.abatementDateTime) }}
            </span>
          </span>
        </div>
      </article>
    </section>

    <div v-else class="card-body card-empty">
      No conditions found for this patient in the current dataset.
    </div>
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
  return (
    c.clinicalStatus?.coding?.[0]?.display ||
    c.clinicalStatus?.text ||
    "unknown"
  );
}

function verificationStatus(c) {
  return (
    c.verificationStatus?.coding?.[0]?.display ||
    c.verificationStatus?.text ||
    ""
  );
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
  gap: 4px;
}

.list-title {
  font-size: 14px;
  font-weight: 600;
  color: #1a365d;
}

.list-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  font-size: 11px;
  color: #718096;
}

.list-meta-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  font-size: 12px;
  color: #64748b;
}

.meta-label {
  font-size: 11px;
  color: #94a3b8;
}

.meta-value {
  font-weight: 500;
  color: #1a365d;
}

.pill {
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 500;
}

.pill-blue {
  background: #e3f2fd;
  color: #0d47a1;
}

.pill-soft {
  background: #edf2f7;
  color: #1a365d;
}

.pill-outline {
  border: 1px solid #cbd5e1;
  color: #475569;
  background: #ffffff;
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
