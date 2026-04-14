#!/usr/bin/env npx tsx
/**
 * Apify Setup Script
 *
 * Uses Playwright to automatically configure:
 * 1. SofaScore scraper actor
 * 2. Daily scheduled run
 * 3. Webhook to push data to your site
 *
 * Usage:
 *   npx tsx scripts/setup-apify.ts
 */

import { chromium, Browser, Page } from 'playwright';
import * as readline from 'readline';

// Configuration
const SOFASCORE_TEAM_URL = 'https://www.sofascore.com/team/football/cwmbran-celtic/37942';
const ACTOR_URL = 'https://apify.com/azzouzana/sofascore-scraper-pro';

// Generate a webhook secret
const WEBHOOK_SECRET = generateSecret();

function generateSecret(): string {
  const chars = 'abcdef0123456789';
  let result = '';
  for (let i = 0; i < 64; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

async function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function waitForUser(message: string): Promise<void> {
  await prompt(`\n${message}\nPress Enter to continue...`);
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║         Cwmbran Celtic - Apify Setup Script                ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('This script will help you set up automatic SofaScore data updates.');
  console.log('');

  // Get the website URL
  const siteUrl = await prompt('Enter your website URL (e.g., https://cwmbranceltic.com): ');

  if (!siteUrl) {
    console.error('Website URL is required');
    process.exit(1);
  }

  const webhookUrl = `${siteUrl.replace(/\/$/, '')}/api/sofascore?secret=${WEBHOOK_SECRET}`;

  console.log('\n📋 Configuration:');
  console.log(`   Team URL: ${SOFASCORE_TEAM_URL}`);
  console.log(`   Webhook URL: ${webhookUrl}`);
  console.log(`   Webhook Secret: ${WEBHOOK_SECRET}`);
  console.log('');

  // Launch browser
  console.log('🚀 Launching browser...\n');

  let browser: Browser | null = null;

  try {
    browser = await chromium.launch({
      headless: false,
      slowMo: 100 // Slow down so user can see what's happening
    });

    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 }
    });

    const page = await context.newPage();

    // Step 1: Go to Apify and login
    console.log('Step 1: Login to Apify');
    console.log('─'.repeat(50));

    await page.goto('https://console.apify.com/sign-in');

    await waitForUser('Please log in to your Apify account in the browser window.\nIf you don\'t have an account, click "Sign up" to create one (it\'s free).');

    // Check if logged in by looking for dashboard elements
    try {
      await page.waitForURL('**/console.apify.com/**', { timeout: 5000 });
      console.log('✅ Logged in successfully!\n');
    } catch {
      console.log('Waiting for login...');
      await page.waitForURL('**/console.apify.com/**', { timeout: 120000 });
      console.log('✅ Logged in successfully!\n');
    }

    // Step 2: Go to the SofaScore actor
    console.log('Step 2: Setting up SofaScore Scraper');
    console.log('─'.repeat(50));

    await page.goto(ACTOR_URL);
    await page.waitForLoadState('networkidle');

    // Click "Try for free" or "Start" button
    const tryButton = page.locator('button:has-text("Try for free"), button:has-text("Start"), a:has-text("Try for free")').first();

    if (await tryButton.isVisible()) {
      await tryButton.click();
      await page.waitForLoadState('networkidle');
      console.log('✅ Opened actor configuration\n');
    }

    // Step 3: Configure the input
    console.log('Step 3: Configuring scraper input');
    console.log('─'.repeat(50));

    // Wait for the input editor to load
    await page.waitForTimeout(2000);

    // Look for JSON editor or input fields
    const jsonEditor = page.locator('[data-testid="json-editor"], .monaco-editor, textarea[name*="input"]').first();

    if (await jsonEditor.isVisible()) {
      // Try to set the input JSON
      const inputJson = JSON.stringify({
        startUrls: [{ url: SOFASCORE_TEAM_URL }]
      }, null, 2);

      console.log(`   Setting start URL to: ${SOFASCORE_TEAM_URL}`);

      // Click on JSON tab if available
      const jsonTab = page.locator('button:has-text("JSON"), [role="tab"]:has-text("JSON")').first();
      if (await jsonTab.isVisible()) {
        await jsonTab.click();
        await page.waitForTimeout(500);
      }
    }

    await waitForUser(`Please configure the actor input:\n\n1. Find the "Start URLs" or input field\n2. Add this URL: ${SOFASCORE_TEAM_URL}\n\nThe input JSON should look like:\n{\n  "startUrls": [\n    { "url": "${SOFASCORE_TEAM_URL}" }\n  ]\n}`);

    console.log('✅ Input configured\n');

    // Step 4: Save as a Task (for scheduling)
    console.log('Step 4: Saving as a Task');
    console.log('─'.repeat(50));

    // Look for "Save" or "Save as task" button
    const saveButton = page.locator('button:has-text("Save"), button:has-text("Save as task")').first();

    if (await saveButton.isVisible()) {
      console.log('   Click "Save" or "Save as task" to create a reusable task');
    }

    await waitForUser('Please save this configuration as a Task:\n\n1. Click "Save" or "Save as task"\n2. Give it a name like "Cwmbran Celtic SofaScore"\n3. Click Save');

    console.log('✅ Task saved\n');

    // Step 5: Set up Schedule
    console.log('Step 5: Setting up Daily Schedule');
    console.log('─'.repeat(50));

    // Navigate to schedules
    const schedulesLink = page.locator('a:has-text("Schedules"), button:has-text("Schedule")').first();

    if (await schedulesLink.isVisible()) {
      await schedulesLink.click();
      await page.waitForLoadState('networkidle');
    } else {
      // Try going to schedules directly
      await page.goto('https://console.apify.com/schedules');
      await page.waitForLoadState('networkidle');
    }

    await waitForUser(`Please create a schedule:\n\n1. Click "Create schedule" or "New schedule"\n2. Name: "Cwmbran Celtic Daily Update"\n3. Set to run daily at 06:00 UTC\n4. Select the task you just created\n5. Save the schedule`);

    console.log('✅ Schedule created\n');

    // Step 6: Set up Webhook
    console.log('Step 6: Setting up Webhook');
    console.log('─'.repeat(50));

    // Navigate to the task's integrations/webhooks
    await page.goto('https://console.apify.com/actors');
    await page.waitForLoadState('networkidle');

    console.log('\n📌 IMPORTANT - Webhook Configuration:');
    console.log('─'.repeat(50));
    console.log(`\nWebhook URL (copy this):\n${webhookUrl}\n`);
    console.log('Event types to select: ACTOR.RUN.SUCCEEDED\n');

    await waitForUser(`Please set up the webhook:\n\n1. Go to your Task → "Integrations" tab → "Webhooks"\n2. Click "Create webhook"\n3. Event type: ACTOR.RUN.SUCCEEDED\n4. Request URL: ${webhookUrl}\n5. Save the webhook`);

    console.log('✅ Webhook configured\n');

    // Step 7: Get API Token
    console.log('Step 7: Getting API Token');
    console.log('─'.repeat(50));

    await page.goto('https://console.apify.com/account/integrations');
    await page.waitForLoadState('networkidle');

    await waitForUser('Please copy your API token from this page.\nYou\'ll need it for your environment variables.');

    const apiToken = await prompt('\nPaste your Apify API token here: ');

    // Done!
    console.log('\n');
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║                    🎉 Setup Complete!                      ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('');
    console.log('Add these to your .env.local file:');
    console.log('─'.repeat(50));
    console.log(`APIFY_API_TOKEN=${apiToken}`);
    console.log(`APIFY_WEBHOOK_SECRET=${WEBHOOK_SECRET}`);
    console.log('─'.repeat(50));
    console.log('');
    console.log('Also add these same variables to your Vercel dashboard:');
    console.log('  Settings → Environment Variables');
    console.log('');
    console.log('Your SofaScore data will now update automatically every day at 6am UTC!');
    console.log('');

    await waitForUser('Setup complete! Press Enter to close the browser.');

  } catch (error) {
    console.error('\n❌ Error:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

main().catch(console.error);
