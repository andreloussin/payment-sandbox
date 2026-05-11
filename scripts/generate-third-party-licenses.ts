import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import path from 'node:path';

function splitPackageKey(key: string): { name: string; version: string } {
  const at = key.lastIndexOf('@');

  if (at <= 0) {
    return { name: key, version: '' };
  }

  return {
    name: key.slice(0, at),
    version: key.slice(at + 1),
  };
}

type LicenseCheckerEntry = {
  licenses?: string;
  repository?: string;
  licenseFile?: string;
  url?: string;
};

type LicenseCheckerJson = Record<string, LicenseCheckerEntry>;

const workspaceArg = process.argv[2]; // ex: apps/api or apps/web

if (!workspaceArg) {
  throw new Error('Usage: pnpm licenses:report -- apps/api');
}

const rootDir = process.cwd();
const workspaceDir = path.join(rootDir, workspaceArg);

const outputName =
  workspaceArg === 'apps/api'
    ? 'THIRD_PARTY_LICENSES_API.txt'
    : workspaceArg === 'apps/web'
      ? 'THIRD_PARTY_LICENSES_WEB.txt'
      : `THIRD_PARTY_LICENSES_${workspaceArg.replaceAll('/', '_').toUpperCase()}.txt`;

const outputFile = path.join(rootDir, outputName);

const json = execFileSync(
  'npx',
  [
    'license-checker-rseidelsohn',
    '--production',
    '--excludePrivatePackages',
    '--json',
  ],
  {
    cwd: workspaceDir,
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'],
  },
);

const dependencies: LicenseCheckerJson = JSON.parse(json) as LicenseCheckerJson;

const entries = Object.entries(dependencies)
  .map(([key, info]) => {
    const { name, version } = splitPackageKey(key);
    return {
      name,
      version,
      licenses: info.licenses ?? 'UNKNOWN',
      repository: info.repository ?? '',
      //   licenseFile: info.licenseFile ?? '',
      url: info.url ?? '',
    };
  })
  .sort((a, b) => {
    const byName = a.name.localeCompare(b.name);
    return byName !== 0 ? byName : a.version.localeCompare(b.version);
  });

const lines: string[] = [];
lines.push('THIRD-PARTY LICENSES');
lines.push(`Workspace: ${workspaceArg}`);
lines.push('Generated from production dependencies only.');
// lines.push(`Generated at: ${new Date().toISOString()}`);
lines.push('');

for (const dep of entries) {
  lines.push(`Package: ${dep.name}${dep.version ? `@${dep.version}` : ''}`);
  lines.push(`License(s): ${dep.licenses}`);
  if (dep.repository) lines.push(`Repository: ${dep.repository}`);
  //   if (dep.licenseFile) lines.push(`License file: ${dep.licenseFile}`);
  if (dep.url) lines.push(`URL: ${dep.url}`);
  lines.push('');
}

writeFileSync(outputFile, lines.join('\n'), 'utf8');
console.log(`Wrote ${outputFile} with ${entries.length} package(s).`);
