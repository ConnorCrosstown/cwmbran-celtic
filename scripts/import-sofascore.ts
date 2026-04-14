#!/usr/bin/env npx tsx
/**
 * Import SofaScore data from a downloaded Apify JSON file
 *
 * Usage:
 *   npx tsx scripts/import-sofascore.ts /path/to/downloaded-file.json
 *
 * This script imports the JSON data exported from Apify's SofaScore scraper
 * and saves it to the local cache for the website to use.
 */

import { promises as fs } from 'fs';
import path from 'path';

interface SofaScoreTeamData {
  id: number;
  sport: string;
  teamDetails: {
    name: string;
    slug: string;
    venue?: {
      name: string;
      city?: { name: string };
    };
  };
  teamUniqueTournaments?: {
    uniqueTournaments: Array<{
      name: string;
      slug: string;
      id: number;
    }>;
  };
  teamTransfers?: {
    transfersIn: Array<{
      player: { name: string; position: string };
      transferFrom: { name: string };
    }>;
    transfersOut: Array<{
      player: { name: string; position: string };
      transferTo: { name: string };
    }>;
  };
  seoContent?: {
    about: string;
  };
}

interface ApifyDatasetItem {
  url: string;
  data: SofaScoreTeamData;
}

interface CachedSofaScoreData {
  lastUpdated: number;
  teamData: SofaScoreTeamData | null;
  fixtures: unknown[];
  results: unknown[];
  standings: unknown[];
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: npx tsx scripts/import-sofascore.ts /path/to/file.json');
    process.exit(1);
  }

  const inputPath = args[0];

  // Resolve the path
  const absolutePath = path.isAbsolute(inputPath)
    ? inputPath
    : path.resolve(process.cwd(), inputPath);

  console.log(`Reading file: ${absolutePath}`);

  try {
    // Read the input file
    const fileContent = await fs.readFile(absolutePath, 'utf-8');
    const jsonData: ApifyDatasetItem[] = JSON.parse(fileContent);

    if (!Array.isArray(jsonData) || jsonData.length === 0) {
      console.error('Invalid file format: expected an array of Apify results');
      process.exit(1);
    }

    // Extract team data
    const teamData = jsonData[0]?.data;

    if (!teamData) {
      console.error('No team data found in file');
      process.exit(1);
    }

    console.log(`Found team: ${teamData.teamDetails?.name || 'Unknown'}`);

    // Log some details about the data
    if (teamData.teamUniqueTournaments?.uniqueTournaments) {
      console.log('Competitions:');
      teamData.teamUniqueTournaments.uniqueTournaments.forEach(t => {
        console.log(`  - ${t.name}`);
      });
    }

    if (teamData.teamTransfers) {
      const { transfersIn, transfersOut } = teamData.teamTransfers;
      console.log(`Transfers In: ${transfersIn?.length || 0}`);
      console.log(`Transfers Out: ${transfersOut?.length || 0}`);
    }

    // Prepare cache data
    const cacheData: CachedSofaScoreData = {
      lastUpdated: Date.now(),
      teamData: teamData,
      fixtures: [],
      results: [],
      standings: [],
    };

    // Ensure cache directory exists
    const cacheDir = path.join(process.cwd(), '.cache');
    await fs.mkdir(cacheDir, { recursive: true });

    // Write cache file
    const cacheFile = path.join(cacheDir, 'sofascore-data.json');
    await fs.writeFile(cacheFile, JSON.stringify(cacheData, null, 2));

    console.log(`\n✅ Data imported successfully!`);
    console.log(`Cache file: ${cacheFile}`);
    console.log(`Last updated: ${new Date(cacheData.lastUpdated).toISOString()}`);

    // Also add .cache to .gitignore if not already there
    const gitignorePath = path.join(process.cwd(), '.gitignore');
    try {
      const gitignore = await fs.readFile(gitignorePath, 'utf-8');
      if (!gitignore.includes('.cache')) {
        await fs.appendFile(gitignorePath, '\n# SofaScore cache\n.cache/\n');
        console.log('Added .cache/ to .gitignore');
      }
    } catch {
      // .gitignore doesn't exist or can't be read
    }

  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error('Unknown error occurred');
    }
    process.exit(1);
  }
}

main();
