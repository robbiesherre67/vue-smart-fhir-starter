import FHIR from "fhirclient";

export class SmartFhirService {
  #client;
  async ready() {
    if (!this.#client) {
      this.#client = await FHIR.oauth2.ready();
    }
    return this.#client;
  }
  async getPatient() {
    const client = await this.ready();
    return client.request(`Patient/${client.patient.id}`);
  }
  async getObservations() {
    const client = await this.ready();
    return client.request(`Observation?patient=${client.patient.id}&_count=50`);
  }
  async getMedications() {
    const client = await this.ready();
    return client.request(`MedicationRequest?patient=${client.patient.id}&_count=50`);
  }
  async getEncounters() {
    const client = await this.ready();
    return client.request(`Encounter?patient=${client.patient.id}&_count=50`);
  }
  async getConditions() {
    const client = await this.ready();
    return client.request(`Condition?patient=${client.patient.id}&_count=50`);
  }  
}
