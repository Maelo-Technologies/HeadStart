const { exec } = require("child_process");

// config
const config = {
  install: {
    vscode: true,
    git: true,
    python: true,
    terminal: true,
    zip: true,
    wsl: true
  },

  security: true,
  debloat: true,
  folders: true,
};

// command wrapper
function run(cmd, label) {
  console.log(`\n[HeadStart] ${label}`);
  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.log(`[-] Error: ${label}`);
      console.log(err.message);
      return;
    }
    if (stdout) console.log(stdout);
  });
}

// install section
function installApps() {
  console.log("\n=== INSTALLING DEV TOOLS ===");

  const apps = [];

  if (config.install.vscode)
    apps.push(["Microsoft.VisualStudioCode", "VS Code"]);

  if (config.install.git)
    apps.push(["Git.Git", "Git"]);

  if (config.install.python)
    apps.push(["Python.Python.3.12", "Python"]);

  if (config.install.terminal)
    apps.push(["Microsoft.WindowsTerminal", "Windows Terminal"]);

  if (config.install.zip)
    apps.push(["7zip.7zip", "7-Zip"]);

  apps.forEach(([id, name]) => {
    run(`winget install --id=${id} -e --silent`, `Installing ${name}`);
  });
}

// wsl install
function installWSL() {
  if (!config.install.wsl) return;
  run("wsl --install -d Ubuntu", "Installing WSL + Ubuntu");
}

// security hardening
function securitySetup() {
  if (!config.security) return;

  console.log("\n=== SECURITY SETUP ===");

  run(
    "powershell -Command \"Set-MpPreference -DisableRealtimeMonitoring $false\"",
    "Enable Windows Defender realtime protection"
  );

  run(
    "powershell -Command \"Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled True\"",
    "Enable Windows Firewall"
  );

  run(
    "powershell -Command \"Set-MpPreference -MAPSReporting Advanced\"",
    "Enable cloud protection"
  );
}

// light debloat
function debloat() {
  if (!config.debloat) return;

  console.log("\n=== LIGHT DEBLOAT ===");

  const cmds = [
    "Get-AppxPackage *Xbox* | Remove-AppxPackage",
    "Get-AppxPackage *Solitaire* | Remove-AppxPackage",
    "Get-AppxPackage *Teams* | Remove-AppxPackage"
  ];

  run(
    `powershell -Command "${cmds.join(';')}"`,
    "Removing selected preinstalled apps"
  );
}

// folder setup
function setupFolders() {
  if (!config.folders) return;

  console.log("\n=== CREATING DEV FOLDERS ===");

  run(
    `powershell -Command "
      New-Item -ItemType Directory -Force C:\\Dev;
      New-Item -ItemType Directory -Force C:\\Projects;
      New-Item -ItemType Directory -Force C:\\Tools
    "`,
    "Creating workspace folders"
  );
}

// system check
function systemCheck() {
  console.log("\n=== SYSTEM CHECK (basic) ===");
  run("winget --version", "Checking winget");
}

// main execution flow
async function main() {
  console.log("\n==============================");
  console.log("HeadStart");
  console.log("==============================");

  systemCheck();
  installApps();
  installWSL();
  securitySetup();
  debloat();
  setupFolders();
  focusMode();

  console.log("\n[HeadStart] Setup complete.");
}

main();
