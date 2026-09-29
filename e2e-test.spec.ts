import { test, expect } from '@playwright/test';

test('E2E CRM Pipeline', async ({ page }) => {
  console.log('Testing: Enquiry -> Follow-up -> Client -> Project');
  // Navigate to Enquiries
  await page.goto('http://localhost:3000/crm/admin/enquiries');
  
  // Create New Enquiry
  await page.click('button:has-text("New Enquiry")');
  await page.fill('input[placeholder="e.g. Acme Corp or John Doe"]', 'Automated Test Client');
  await page.fill('input[placeholder="e.g. E-commerce Website"]', 'Automated Requirement');
  await page.fill('input[placeholder="e.g. 50000"]', '100000');
  await page.click('button:has-text("Create Enquiry & Track")');
  
  // Wait for it to appear and open drawer
  await page.waitForSelector('text=Automated Test Client');
  await page.click('text=Automated Test Client');
  
  // Schedule Follow-up
  await page.click('button:has-text("Schedule Follow-up")');
  await page.fill('textarea[placeholder="e.g. Discuss project scope and pricing..."]', 'Auto generated purpose');
  await page.click('button:has-text("Schedule & Move to Follow-ups")');
  
  // Navigate to Follow-ups
  await page.goto('http://localhost:3000/crm/admin/follow-ups');
  await page.waitForSelector('text=Automated Test Client');
  
  // Convert to Client
  await page.click('button[title="Move to Client"]');
  await page.click('button:has-text("Move to Client")');
  
  // Verify in Clients
  await page.goto('http://localhost:3000/crm/admin/clients');
  await page.waitForSelector('text=Automated Test Client');
  console.log('Success! Client created from pipeline.');
  
  // Create Project
  await page.goto('http://localhost:3000/crm/admin/projects');
  await page.click('button:has-text("New Project")');
  await page.locator('select').filter({ hasText: 'Automated Test Client' }).selectOption({ label: 'Automated Test Client' });
  await page.fill('input[placeholder="e.g. E-Commerce Redesign"]', 'Auto Project');
  await page.click('button:has-text("Create & Kickoff Project")');
  
  console.log('Success! End to End pipeline complete.');
});
