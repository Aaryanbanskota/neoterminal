const { MakerSquirrel } = require('@electron-forge/maker-squirrel');
const { MakerZIP } = require('@electron-forge/maker-zip');
const { MakerDeb } = require('@electron-forge/maker-deb');
const { MakerRpm } = require('@electron-forge/maker-rpm');
const { MakerDMG } = require('@electron-forge/maker-dmg');
const { AutoUnpackNativesPlugin } = require('@electron-forge/plugin-auto-unpack-natives');
const { WebpackPlugin } = require('@electron-forge/plugin-webpack');
const path = require('path');

module.exports = {
  packagerConfig: {
    name: 'NeoTerminal',
    executableName: 'neo-terminal',
    icon: path.resolve(__dirname, '.electron/icons/icon'),
    appBundleId: 'com.quantum.neoterminal',
    asar: true,
    extraResource: [
      './assets/models',
      './assets/sounds',
      './assets/icons'
    ],
    protocols: [
      {
        name: 'NeoTerminal',
        schemes: ['terminal']
      }
    ],
    osxSign: {
      identity: 'Developer ID Application: Your Name (XXXXXXXXXX)',
      'hardened-runtime': true,
      entitlements: 'entitlements.plist',
      'entitlements-inherit': 'entitlements.plist',
      'signature-flags': 'library'
    },
    osxNotarize: {
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_ID_PASSWORD,
      teamId: process.env.APPLE_TEAM_ID
    }
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      name: 'neo_terminal',
      authors: 'Quantum Labs',
      exe: 'neo-terminal.exe',
      iconUrl: 'https://yourdomain.com/icon.ico',
      setupIcon: path.resolve(__dirname, '.electron/icons/icon.ico'),
      loadingGif: './assets/boot.gif',
      noMsi: true
    }),
    new MakerZIP({}, ['darwin']),
    new MakerDMG({
      background: './assets/dmg-background.png',
      format: 'ULFO',
      icon: path.resolve(__dirname, '.electron/icons/icon.icns'),
      name: 'NeoTerminal'
    }),
    new MakerDeb({
      options: {
        icon: path.resolve(__dirname, '.electron/icons/linux-icons/256x256.png'),
        categories: ['Utility', 'TerminalEmulator'],
        maintainer: 'Quantum Labs',
        homepage: 'https://neoterminal.quantum'
      }
    }),
    new MakerRpm({
      options: {
        icon: path.resolve(__dirname, '.electron/icons/linux-icons/256x256.png'),
        categories: ['Utility', 'TerminalEmulator'],
        vendor: 'Quantum Labs'
      }
    })
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      mainConfig: path.join(__dirname, '.electron/config/webpack.main.config.js'),
      renderer: {
        config: path.join(__dirname, '.electron/config/webpack.renderer.config.js'),
        entryPoints: [
          {
            html: './src/renderer/index.html',
            js: './src/renderer/main.tsx',
            name: 'main_window',
            preload: {
              js: './src/main/preload.ts'
            }
          },
          {
            html: './src/renderer/quantum/index.html',
            js: './src/renderer/quantum/visualizer.ts',
            name: 'quantum_window'
          }
        ]
      },
      devContentSecurityPolicy: "default-src 'self' 'unsafe-inline' data:; script-src 'self' 'unsafe-eval' 'unsafe-inline' data:"
    })
  ],
  hooks: {
    packageAfterPrune: async (forgeConfig, buildPath, electronVersion, platform, arch) => {
      // Custom pruning for quantum modules
      return [
        'rm -rf node_modules/@tensorflow/tfjs-backend-cpu',
        'rm -rf node_modules/glslify/node_modules'
      ];
    },
    postPackage: async (forgeConfig, packages) => {
      // Sign Windows executables
      if (process.env.WINDOWS_CERTIFICATE_FILE) {
        require('electron-windows-sign').sign({
          path: packages.find(p => p.endsWith('.exe')),
          cert: process.env.WINDOWS_CERTIFICATE_FILE,
          name: 'NeoTerminal',
          site: 'https://neoterminal.quantum'
        });
      }
    }
  },
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'your-github-username',
          name: 'neo-terminal'
        },
        prerelease: true,
        draft: true
      }
    }
  ]
};