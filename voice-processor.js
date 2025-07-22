export class VoiceProcessor {
  constructor() {
    this.commands = {
      'clear terminal': () => Terminal.clear(),
      'open *tab': (tab) => Terminal.openTab(tab),
      'quantum mode': () => Quantum.enable(),
      'scan *target': (target) => Security.scan(target)
    };
    
    this.init();
  }

  init() {
    if (annyang) {
      annyang.addCommands(this.commands);
      annyang.addCallback('result', (phrases) => {
        Terminal.output(`Voice command detected: ${phrases[0]}`);
        UI.showPulseEffect();
      });
    }
  }

  start() {
    if (annyang) annyang.start({ autoRestart: true, continuous: true });
  }

  addCustomCommand(pattern, callback) {
    annyang.addCommands({ [pattern]: callback });
  }
}