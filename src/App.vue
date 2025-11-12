<template>
  <div class="app-root">
    <!-- Top mode badge -->
    <div class="mode-indicator">
      Mode:
      <span v-if="isDemo">Demo SMART Launch</span>
      <span v-else-if="isMock">Mock</span>
      <span v-else>SMART OAuth</span>
    </div>

    <!-- Main content card -->
    <div class="app-shell">
      <header class="app-header">
        <div>
          <h1 class="app-title">Vue SMART on FHIR Demo</h1>
          <p class="app-subtitle">
            Patient-facing clinical view using SMART on FHIR & FHIR R4 resources
          </p>
        </div>
      </header>

      <nav class="app-nav">
        <router-link to="/" class="nav-link">
          Patient
        </router-link>
        <router-link to="/vitals" class="nav-link">
          Vitals
        </router-link>
        <router-link to="/conditions" class="nav-link">
          Conditions
        </router-link>
        <router-link to="/meds" class="nav-link">
          Medications
        </router-link>
        <router-link to="/encounters" class="nav-link">
          Encounters
        </router-link>
        <router-link to="/launch" class="nav-link nav-link-secondary">
          SMART Launch
        </router-link>
      </nav>

      <main class="app-main">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const isMock = computed(() => import.meta.env.VITE_USE_MOCK === "1");
const isDemo = computed(() => import.meta.env.VITE_DEMO_LAUNCH === "1");
</script>

<style scoped>
.app-root {
  min-height: 100vh;
  margin: 0;
  padding: 24px 12px;
  box-sizing: border-box;
  background: linear-gradient(135deg, #f3f7fb 0%, #e4edf7 100%);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

/* Main white card */
.app-shell {
  width: 100%;
  max-width: 980px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 12px 32px rgba(15, 35, 52, 0.12);
  padding: 20px 24px 24px;
  box-sizing: border-box;
}

/* Header */
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 12px;
  margin-bottom: 12px;
}

.app-title {
  margin: 0;
  font-size: 24px;
  color: #113a6b;
  letter-spacing: 0.02em;
}

.app-subtitle {
  margin: 4px 0 0;
  font-size: 13px;
  color: #718096;
}

/* Navigation as pills */
.app-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 10px 0 16px;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  border: 1px solid transparent;
  background: #1e88e5;        /* blue button */
  color: #ffffff;             /* white text */
  transition:
    background-color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.05s ease,
    border-color 0.15s ease,
    color 0.15s ease;
}

.nav-link:hover {
  background: #1565c0;
  box-shadow: 0 4px 10px rgba(21, 101, 192, 0.3);
  transform: translateY(-1px);
}

/* Secondary style for SMART Launch (outline variant) */
.nav-link-secondary {
  background: #ffffff;
  color: #1e88e5;
  border-color: #1e88e5;
}

.nav-link-secondary:hover {
  background: #e3f2fd;
  color: #0d47a1;
}

/* Active route styling */
.nav-link.router-link-active {
  background: #0d47a1;
  border-color: #0d47a1;
  color: #ffffff;
}

/* Main content area */
.app-main {
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px 14px;
  min-height: 260px;
  box-sizing: border-box;
  border: 1px solid #e2e8f0;
}

/* Mode indicator pill */
.mode-indicator {
  position: fixed;
  top: 10px;
  right: 14px;
  font-size: 12px;
  color: #1a365d;
  background: rgba(255, 255, 255, 0.96);
  padding: 5px 10px;
  border-radius: 999px;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
  border: 1px solid #cbd5e1;
  z-index: 50;
}

.mode-indicator span {
  font-weight: 600;
  margin-left: 4px;
}

/* Responsive tweaks */
@media (max-width: 768px) {
  .app-shell {
    padding: 16px 14px 18px;
  }

  .app-header {
    flex-direction: column;
    gap: 8px;
  }

  .app-title {
    font-size: 20px;
  }

  .app-main {
    padding: 12px 10px;
  }
}
</style>
