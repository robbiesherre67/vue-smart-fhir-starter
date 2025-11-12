<template>
  <div class="card">
    <header class="card-header">
      <div>
        <h2 class="card-title">SMART Launch</h2>
        <p class="card-subtitle">
          Launch workflow for SMART on FHIR–enabled EHR integrations
        </p>
      </div>
      <span class="pill pill-blue">SMART on FHIR</span>
    </header>

    <!-- DEMO MODE -->
    <section v-if="isDemo" class="card-body">
      <p class="body-text">
        Demo mode is enabled. This simulates the SMART on FHIR launch sequence
        so you can walk through the flow without connecting to a real EHR.
      </p>

      <ol class="stepper">
        <li class="step">
          <span class="step-index">1</span>
          <div class="step-content">
            <div class="step-title">EHR initiates launch</div>
            <div class="step-desc">
              The clinician selects this app from the patient chart in Epic or Cerner.
            </div>
          </div>
        </li>
        <li class="step">
          <span class="step-index">2</span>
          <div class="step-content">
            <div class="step-title">App requests authorization</div>
            <div class="step-desc">
              The app sends a SMART OAuth2 request with client ID, scopes, and redirect URI.
            </div>
          </div>
        </li>
        <li class="step">
          <span class="step-index">3</span>
          <div class="step-content">
            <div class="step-title">EHR returns token & context</div>
            <div class="step-desc">
              On success, the EHR redirects back with an access token and patient context.
            </div>
          </div>
        </li>
      </ol>

      <div class="cta-row">
        <button class="btn-primary" @click="simulateLaunch" :disabled="launched">
          {{ launched ? "Completing launch…" : "Simulate OAuth Success" }}
        </button>
        <div class="cta-meta">
          <div><strong>Redirect URI:</strong> <code>{{ redirectUri }}</code></div>
          <div><strong>Client ID:</strong> <code>{{ clientId }}</code></div>
          <div><strong>Scopes:</strong> <code>{{ scopes }}</code></div>
        </div>
      </div>

      <p v-if="launched" class="info-text">
        ✅ OAuth completed (simulated). Redirecting back to the clinical view…
      </p>
    </section>

    <!-- MOCK MODE (no demo) -->
    <section v-else-if="isMock" class="card-body">
      <p class="body-text">
        SMART OAuth is disabled because the application is running in
        <strong>Mock Mode</strong>. Patient data is loaded from local FHIR-style JSON
        bundles instead of an EHR.
      </p>
      <p class="body-text">
        To demonstrate the launch flow visually without live connectivity, enable:
      </p>
      <pre class="code-block">
VITE_USE_MOCK=1
VITE_DEMO_LAUNCH=1
      </pre>
      <p class="body-text">
        To connect to a real SMART on FHIR environment, set
        <code>VITE_USE_MOCK=0</code> and launch this app via the SMART Launcher.
      </p>
    </section>

    <!-- REAL SMART OAUTH MODE -->
    <section v-else class="card-body">
      <div v-if="hasLaunchParams">
        <p class="body-text">
          Connecting to the EHR using SMART on FHIR…
        </p>
        <ul class="meta-list">
          <li><strong>iss:</strong> <code>{{ iss }}</code></li>
          <li><strong>launch:</strong> <code>{{ launch }}</code></li>
          <li><strong>redirect:</strong> <code>{{ redirectUri }}</code></li>
        </ul>
        <p class="body-text">
          You should be redirected back to the main clinical view after authorization.
        </p>
      </div>

      <div v-else>
        <p class="body-text">
          No EHR launch parameters were detected in the query string.
          This page should normally be opened by the EHR or SMART Launcher with
          <code>?iss=…&amp;launch=…</code>.
        </p>
        <p class="body-text">
          To test a full SMART launch, use the SMART Health IT Launcher and configure:
        </p>
        <ul class="meta-list">
          <li>
            <strong>Launch URL:</strong>
            <code>[app-base]/#/launch</code>
          </li>
          <li>
            <strong>Redirect URL:</strong>
            <code>[app-base]/#/</code>
          </li>
          <li>
            <strong>Client ID:</strong>
            <code>{{ clientId }}</code>
          </li>
          <li>
            <strong>Scopes:</strong>
            <code>{{ scopes }}</code>
          </li>
        </ul>
      </div>

      <div v-if="error" class="alert">
        {{ error }}
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import FHIR from "fhirclient";

const isMock = computed(() => import.meta.env.VITE_USE_MOCK === "1");
const isDemo = computed(() => import.meta.env.VITE_DEMO_LAUNCH === "1");

const clientId = import.meta.env.VITE_CLIENT_ID || "not-set";
const scopes =
  import.meta.env.VITE_SCOPES ||
  "launch/patient patient/*.read openid fhirUser online_access";
const redirectUri = import.meta.env.VITE_REDIRECT_PATH || "#/";

// Query params from SMART / EHR launch
const params = new URLSearchParams(window.location.search);
const iss = params.get("iss") || "";
const launch = params.get("launch") || "";
const hasLaunchParams = !!(iss && launch);

const launched = ref(false);
const error = ref("");

// Demo mode: simulate success and navigate back to root after a short delay
function simulateLaunch() {
  launched.value = true;
  setTimeout(() => {
    window.location.hash = "/";
  }, 1200);
}

// Real SMART OAuth: only when not mock and not demo, and we have launch params
if (!isMock.value && !isDemo.value && hasLaunchParams) {
  FHIR.oauth2
    .authorize({
      clientId,
      scope: scopes,
      redirectUri,
      iss,
      launch
    })
    .catch(e => {
      error.value = String(e);
    });
}
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
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.body-text {
  font-size: 13px;
  color: #1f2933;
  margin: 0;
}

.stepper {
  list-style: none;
  padding: 0;
  margin: 4px 0 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.step {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 8px 8px;
  border-radius: 10px;
  border: 1px solid #edf2f7;
  background: #f8fafc;
}

.step-index {
  width: 22px;
  height: 22px;
  border-radius: 999px;
  background: #1e88e5;
  color: #ffffff;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
}

.step-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.step-title {
  font-size: 13px;
  font-weight: 600;
  color: #1a365d;
}

.step-desc {
  font-size: 12px;
  color: #64748b;
}

.cta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-start;
  margin-top: 4px;
}

.btn-primary {
  border: none;
  border-radius: 999px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  background: #1e88e5;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(21, 101, 192, 0.35);
  transition:
    background-color 0.15s ease,
    transform 0.05s ease,
    box-shadow 0.15s ease;
}

.btn-primary:hover:not(:disabled) {
  background: #1565c0;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: default;
  box-shadow: none;
}

.cta-meta {
  font-size: 11px;
  color: #64748b;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.code-block {
  background: #0f172a;
  color: #e5e7eb;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 12px;
  overflow-x: auto;
}

.meta-list {
  list-style: none;
  padding: 0;
  margin: 4px 0 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: #334155;
}

.meta-list code {
  font-size: 11px;
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
  margin-top: 6px;
  padding: 8px 10px;
  border-radius: 8px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  font-size: 13px;
}

.info-text {
  font-size: 12px;
  color: #166534;
  margin-top: 2px;
}
</style>
