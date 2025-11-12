import { MockFhirService } from "./mock";
import { SmartFhirService } from "./smart";

export function createFhirService() {
  const useMock = import.meta.env.VITE_USE_MOCK === "1";
  return useMock ? new MockFhirService() : new SmartFhirService();
}
