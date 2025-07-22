import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);

export class SecurityTools {
  async scanPorts(target) {
    try {
      const { stdout } = await execAsync(`nmap -T4 -F ${target}`);
      return this.parseNmapOutput(stdout);
    } catch (error) {
      return { error: error.message };
    }
  }

  parseNmapOutput(output) {
    const result = { openPorts: [] };
    const lines = output.split('\n');
    
    lines.forEach(line => {
      if (line.match(/^\d+\/tcp\s+open/)) {
        const [port] = line.split('/');
        result.openPorts.push({
          port: parseInt(port),
          service: line.split(/\s+/)[2]
        });
      }
    });
    
    return result;
  }

  async checkVulnerabilities(service, version) {
    const response = await fetch(`https://vuln-api.example.com/check?service=${service}&version=${version}`);
    return response.json();
  }
}