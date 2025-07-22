export class ModelLoader {
  static async loadTerminalModel() {
    const model = await tf.loadLayersModel('assets/models/terminal-model.json');
    const metadata = await fetch('assets/models/terminal-metadata.json').then(r => r.json());
    
    return {
      predict: (input) => {
        const tensor = tf.tensor2d([input]);
        return model.predict(tensor).arraySync()[0];
      },
      metadata
    };
  }

  static async setupRealTimePrediction(webcamElement) {
    const net = await tf.loadGraphModel('assets/models/object-detection/model.json');
    const webcam = await tf.data.webcam(webcamElement);
    
    return {
      detect: async () => {
        const img = await webcam.capture();
        const processedImg = tf.tidy(() => img.expandDims(0).toFloat().div(127).sub(1));
        const predictions = await net.executeAsync(processedImg);
        
        img.dispose();
        return predictions.arraySync();
      }
    };
  }
}