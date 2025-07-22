const { Qrack } = require('qrack')

class QuantumEngine {
  constructor() {
    this.qpu = new Qrack()
    this.circuits = new Map()
  }

  simulate(circuitConfig) {
    const qubits = this.qpu.allocate(circuitConfig.qubits)
    
    circuitConfig.gates.forEach(gate => {
      this.qpu[gate.type](...gate.params)
    })
    
    const result = this.qpu.sample(qubits, 1000)
    this.qpu.release(qubits)
    return result
  }
}

module.exports = QuantumEngine