<template>
  <div>
    <h2>SMART Launch</h2>

    <div v-if="isDemoLaunch">
      <p><strong>Demo Mode:</strong> Showing simulated SMART on FHIR launch sequence.</p>
      <ol>
        <li>App registered with <code>SMART Launcher</code></li>
        <li>Launch initiated from EHR context (<code>?iss=...</code> & <code>launch=...</code>)</li>
        <li>OAuth2 authorization request created</li>
        <li>Redirect to <code>{{ redirectUri }}</code> with access token</li>
      </ol>
      <p>
        This mock launch simulates the real SMART OAuth handshake without contacting a FHIR server.
      </p>
      <button @click="simulateLaunch" style="padding:6px 10px;">Simulate OAuth Success</button>
      <p v-if="launched" style="color:green; margin-top:8px;">✅ OAuth completed — redirecting to app...</p>
    </div>

    <div v-else-if="useMock">
      <p><strong>Mock Mode:</strong> SMART OAuth is disabled.</p>
      <p>Enable <code>VITE_DEMO_LAUNCH=1</code> to show the demo sequence visually.</p>
    </div>

    <div v-else>
      <p>Starting SMART OAuth…</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import FHIR from "fhirclient";

const useMock = import.meta.env.VITE_USE_MOCK === "1";
const isDemoLaunch = import.meta.env.VITE_DEMO_LAUNCH === "1";

const redirectUri = import.meta.env.VITE_REDIRECT_PATH || "#/";
const launched = ref(false);

function simulateLaunch() {
  launched.value = true;
  setTimeout(() => {
    // In a real SMART launch, OAuth redirect would bring us back to "/"
    window.location.hash = "/";
  }, 1500);
}

// Real OAuth only if not mock/demo
if (!useMock && !isDemoLaunch) {
  const params = new URLSearchParams(window.location.search);
  const iss = params.get("iss");
  const launch = params.get("launch");

  if (iss && launch) {
    FHIR.oauth2.authorize({
      clientId: import.meta.env.VITE_CLIENT_ID,
      scope: import.meta.env.VITE_SCOPES,
      redirectUri,
      iss,
      launch
    });
  }
}
</script>
