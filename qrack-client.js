export class QrackClient {
  constructor(endpoint = 'http://localhost:3001/quantum') {
    this.endpoint = endpoint;
  }

  async simulate(circuit) {
    const response = await fetch(`${this.endpoint}/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(circuit)
    });
    return response.json();
  }

  async allocateQubits(count) {
    const response = await fetch(`${this.endpoint}/allocate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qubits: count })
    });
    return response.json();
  }

  async applyGate(gateType, qubits, params = {}) {
    const response = await fetch(`${this.endpoint}/gate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gate: gateType, qubits, params })
    });
    return response.json();
  }
}