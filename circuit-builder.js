export class QuantumCircuitBuilder {
  constructor() {
    this.gates = [];
    this.qubits = 4;
  }

  addGate(type, targets, params = {}) {
    this.gates.push({ type, targets, params });
    return this;
  }

  async simulate() {
    const response = await fetch('http://localhost:3001/quantum/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        qubits: this.qubits,
        gates: this.gates
      })
    });
    
    return response.json();
  }

  visualize(canvasElement) {
    const qvis = new QuantumVisualizer(canvasElement);
    qvis.drawCircuit(this.gates);
    return qvis;
  }
}