export class MockFhirService {
    async getPatient(patientId = "example") {
      const res = await fetch("mock/patient.json");
      return res.json();
    }
    async getObservations(patientId = "example") {
      const res = await fetch("mock/observations.json");
      return res.json(); // bundle of Observations
    }
    async getMedications(patientId = "example") {
      const res = await fetch("mock/medications.json");
      return res.json();
    }
    async getConditions(patientId = "example") {
      const res = await fetch("mock/conditions.json");
      return res.json();
    }
    async getEncounters(patientId = "example") {
      const res = await fetch("mock/encounters.json");
      return res.json();
    }
  }
  