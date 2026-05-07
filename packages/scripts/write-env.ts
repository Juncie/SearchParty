#!/usr/bin/env tsx

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import {
  dirname,
  isAbsolute,
  join,
  relative,
  resolve,
} from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface EnvConfig {
  repoRoot: string;
  sourceEnvPath: string;
  /** Absolute paths of base directories whose direct children receive `.env` */
  targetBasePaths: string[];
  excludePatterns?: string[];
  dryRun?: boolean;
}

/**
 * Walk upward from `startDir` until `pnpm-workspace.yaml` is found.
 */
function findRepoRoot(startDir: string): string {
  let dir = resolve(startDir);
  while (true) {
    if (existsSync(join(dir, 'pnpm-workspace.yaml'))) {
      return dir;
    }
    const parent = dirname(dir);
    if (parent === dir) {
      return process.cwd();
    }
    dir = parent;
  }
}

/**
 * Direct subdirectories (one level) under each base path.
 */
function findDirectSubdirectories(
  basePaths: string[],
  repoRoot: string,
  excludePatterns: string[] = []
): string[] {
  const results: string[] = [];

  for (const basePath of basePaths) {
    if (!existsSync(basePath)) {
      console.warn(`Warning: Directory does not exist, skipping: ${basePath}`);
      continue;
    }

    try {
      const entries = readdirSync(basePath);

      for (const entry of entries) {
        const fullPath = join(basePath, entry);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
          if (excludePatterns.some((exclude) => entry.includes(exclude))) {
            continue;
          }
          results.push(fullPath);
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not read directory ${basePath}:`, error);
    }
  }

  return results.map((p) => resolve(p)).sort((a, b) => {
    const ra = relative(repoRoot, a);
    const rb = relative(repoRoot, b);
    return ra.localeCompare(rb);
  });
}

/**
 * Copy the root env file into each first-level app under `apps/`.
 */
async function syncEnvFiles(config: EnvConfig) {
  const {
    repoRoot,
    sourceEnvPath,
    targetBasePaths,
    excludePatterns = [],
    dryRun = false,
  } = config;

  const resolvedSource = isAbsolute(sourceEnvPath)
    ? sourceEnvPath
    : join(repoRoot, sourceEnvPath);

  if (!existsSync(resolvedSource)) {
    throw new Error(`Source environment file not found: ${resolvedSource}`);
  }

  const envContent = readFileSync(resolvedSource, 'utf-8');
  console.log(`📖 Reading environment file: ${relative(repoRoot, resolvedSource) || resolvedSource}`);

  const uniqueTargets = findDirectSubdirectories(
    targetBasePaths,
    repoRoot,
    excludePatterns
  );

  console.log(`🎯 Found ${uniqueTargets.length} app director${uniqueTargets.length === 1 ? 'y' : 'ies'}:`);
  uniqueTargets.forEach((target) =>
    console.log(`   - ${relative(repoRoot, target) || target}`)
  );

  if (dryRun) {
    console.log('\n🔍 DRY RUN — no files written');
    return;
  }

  let successCount = 0;
  let errorCount = 0;

  for (const targetDir of uniqueTargets) {
    try {
      const targetEnvPath = join(targetDir, '.env');

      const targetDirPath = dirname(targetEnvPath);
      if (!existsSync(targetDirPath)) {
        mkdirSync(targetDirPath, { recursive: true });
      }

      writeFileSync(targetEnvPath, envContent, 'utf-8');
      console.log(
        `✅ Written: ${relative(repoRoot, targetEnvPath) || targetEnvPath}`
      );
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to write under ${targetDir}:`, error);
      errorCount++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Written: ${successCount}`);
  console.log(`   ❌ Failed: ${errorCount}`);
  console.log(`   📁 Targets: ${uniqueTargets.length}`);
}

function parseArgs(argv: string[]) {
  const dryRun =
    argv.includes('--dry-run') || argv.includes('-d');
  const positional = argv.filter(
    (a) =>
      a !== '--dry-run' &&
      a !== '-d' &&
      !a.startsWith('-')
  );
  const sourceEnvPath = positional[0] ?? '.env';
  return { sourceEnvPath, dryRun };
}

async function main() {
  const argv = process.argv.slice(2);
  const { sourceEnvPath, dryRun } = parseArgs(argv);

  if (argv.includes('--help') || argv.includes('-h')) {
    console.log(`
🌍 Copy root .env into each app under apps/

Usage:
  pnpm write-env [source-env-file] [options]

Defaults:
  Source: .env at the repository root (next to pnpm-workspace.yaml)
  Targets: direct children of apps/ (e.g. apps/web, apps/extension)

Options:
  --dry-run, -d    List targets only; do not write files
  --help, -h       Show this message

Examples:
  pnpm write-env
  pnpm write-env .env.local
  pnpm write-env --dry-run
`);
    process.exit(0);
  }

  const repoRoot = findRepoRoot(__dirname);

  try {
    await syncEnvFiles({
      repoRoot,
      sourceEnvPath,
      targetBasePaths: [join(repoRoot, 'apps')],
      excludePatterns: ['node_modules', 'dist', 'build', '.git'],
      dryRun,
    });

    if (!dryRun) {
      console.log('\n🎉 Environment files synced successfully!');
    }
  } catch (error) {
    console.error('💥 Error syncing environment files:', error);
    process.exit(1);
  }
}

export { syncEnvFiles };

const entryScript = process.argv[1];
const isDirectRun =
  Boolean(entryScript) &&
  import.meta.url === pathToFileURL(resolve(entryScript)).href;

if (isDirectRun) {
  void main();
}
