# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e-test.spec.ts >> E2E CRM Pipeline
- Location: e2e-test.spec.ts:3:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[placeholder="e.g. Acme Corp or John Doe"]')

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - region "Cookie and Privacy Consent Banner" [ref=e3]:
      - generic [ref=e4]:
        - heading "Privacy & Cookie Consent" [level=3] [ref=e8]
        - button "Close cookie consent banner" [ref=e9] [cursor=pointer]
      - paragraph [ref=e13]:
        - text: TS DEV CRM uses essential cookies & local session storage to maintain secure user authentication, role-based access control, and Firestore real-time synchronization in compliance with the
        - strong [ref=e14]: DPDP Act (India)
        - text: .
      - generic [ref=e15]:
        - button "Accept all cookies and session tracking" [ref=e16] [cursor=pointer]:
          - generic [ref=e19]: Accept All
        - button "Accept essential cookies only" [ref=e20] [cursor=pointer]:
          - generic [ref=e24]: Essential Only
    - complementary [ref=e25]:
      - generic [ref=e26]:
        - generic [ref=e27]:
          - img "TS DEV Logo" [ref=e29]
          - generic [ref=e30]:
            - generic [ref=e31]: TS DEV CRM
            - generic [ref=e33]: Operations & Management
        - generic [ref=e34]:
          - generic [ref=e35]:
            - generic [ref=e36]: OVERVIEW
            - link "Dashboard" [ref=e37] [cursor=pointer]:
              - /url: /crm/admin
          - generic [ref=e45]:
            - generic [ref=e46]: CRM MANAGEMENT
            - link "Enquiries / Leads" [ref=e47] [cursor=pointer]:
              - /url: /crm/admin/enquiries
            - link "Follow-ups" [ref=e52] [cursor=pointer]:
              - /url: /crm/admin/follow-ups
            - link "Clients" [ref=e58] [cursor=pointer]:
              - /url: /crm/admin/clients
            - link "Quotations & Agreements" [ref=e65] [cursor=pointer]:
              - /url: /crm/admin/projects/documents
          - generic [ref=e71]:
            - generic [ref=e72]: PROJECT MANAGEMENT
            - link "Projects" [ref=e73] [cursor=pointer]:
              - /url: /crm/admin/projects
            - link "Tasks" [ref=e78] [cursor=pointer]:
              - /url: /crm/admin/tasks
            - link "Project Dashboard" [ref=e84] [cursor=pointer]:
              - /url: /crm/admin/projects/dashboard
          - generic [ref=e92]:
            - generic [ref=e93]: TEAM MANAGEMENT
            - link "Team Dashboard" [ref=e94] [cursor=pointer]:
              - /url: /crm/admin/team/dashboard
            - link "Team Members" [ref=e102] [cursor=pointer]:
              - /url: /crm/admin/team/members
            - link "Teams & Roles" [ref=e110] [cursor=pointer]:
              - /url: /crm/admin/team/teams
            - link "Daily Reports" [ref=e115] [cursor=pointer]:
              - /url: /crm/admin/team/daily-reports
          - generic [ref=e121]:
            - generic [ref=e122]: FINANCE
            - link "Finance Dashboard" [ref=e123] [cursor=pointer]:
              - /url: /crm/admin/finance
            - link "Invoices" [ref=e129] [cursor=pointer]:
              - /url: /crm/admin/finance/invoices
            - link "Expenses & Payments" [ref=e135] [cursor=pointer]:
              - /url: /crm/admin/finance/expenses
          - generic [ref=e140]:
            - generic [ref=e141]: WORKSPACE
            - link "Notes" [ref=e142] [cursor=pointer]:
              - /url: /crm/admin/workspace/notes
            - link "Notice Board" [ref=e148] [cursor=pointer]:
              - /url: /crm/admin/workspace/notices
        - generic [ref=e154]:
          - link "Settings" [ref=e155] [cursor=pointer]:
            - /url: /crm/admin/settings
          - button "Logout" [ref=e160] [cursor=pointer]
    - generic [ref=e165]:
      - banner [ref=e166]:
        - generic [ref=e167]:
          - button "Toggle Sidebar" [ref=e168] [cursor=pointer]
          - navigation [ref=e170]:
            - link "Home" [ref=e172] [cursor=pointer]:
              - /url: /crm/admin
            - link "CRM" [ref=e176] [cursor=pointer]:
              - /url: /crm/admin/enquiries
            - generic [ref=e177]: Leads & Enquiries
        - generic [ref=e181]:
          - button "Quick search... ⌘K" [ref=e182] [cursor=pointer]:
            - generic [ref=e186]: Quick search...
            - generic [ref=e187]: ⌘K
          - button "New" [ref=e189] [cursor=pointer]
          - button "Notifications" [ref=e192] [cursor=pointer]
          - generic [ref=e196]:
            - img "Tamil Selvan R" [ref=e197]
            - generic [ref=e198]:
              - generic [ref=e199]: Tamil Selvan R
              - generic [ref=e200]: Admin
            - button "Log out" [ref=e201] [cursor=pointer]
      - main [ref=e205]:
        - generic [ref=e207]:
          - generic [ref=e208]:
            - generic [ref=e209]:
              - heading "Enquiries" [level=1] [ref=e210]
              - paragraph [ref=e211]: Manage incoming client leads, team assignments, pipeline status & notes.
            - button "New Enquiry" [active] [ref=e212] [cursor=pointer]
          - generic [ref=e215]:
            - generic [ref=e216]:
              - text: New Leads
              - generic [ref=e217]: "0"
            - generic [ref=e218]:
              - text: Contacted / In Progress
              - generic [ref=e219]: "1"
            - generic [ref=e220]:
              - text: Proposal / Negotiation
              - generic [ref=e221]: "0"
            - generic [ref=e222]:
              - text: Won Deals
              - generic [ref=e223]: "0"
            - generic [ref=e224]:
              - text: Lost
              - generic [ref=e225]: "0"
          - generic [ref=e226]:
            - textbox "Search client, company or requirement..." [ref=e231]
            - generic [ref=e232]:
              - combobox [ref=e233]:
                - option "All Statuses" [selected]
                - option "New"
                - option "Contacted"
                - option "Qualified"
                - option "Proposal"
                - option "Negotiation"
                - option "Won"
                - option "Lost"
              - combobox [ref=e234]:
                - option "All Priorities" [selected]
                - option "Low"
                - option "Medium"
                - option "High"
                - option "Urgent"
              - combobox [ref=e235]:
                - option "All Team Members" [selected]
                - option "Tamil Selvan R"
                - option "Jeevanandham"
                - option "Bharath Vishal"
          - table [ref=e238]:
            - rowgroup [ref=e239]:
              - row [ref=e240]:
                - columnheader "Client" [ref=e241]
                - columnheader "Company" [ref=e242]
                - columnheader "Requirement" [ref=e243]
                - columnheader "Budget" [ref=e244]
                - columnheader "Source" [ref=e245]
                - columnheader "Assigned To" [ref=e246]
                - columnheader "Priority" [ref=e247]
                - columnheader "Status (Quick Update)" [ref=e248]
                - columnheader "Created" [ref=e249]
                - columnheader "Actions" [ref=e250]
            - rowgroup [ref=e251]:
              - row [ref=e252] [cursor=pointer]:
                - cell "Muthupandi" [ref=e253]
                - cell "Muthupandi Matrimony" [ref=e254]
                - cell "Matrimony Web & Android App with Payment Gateway" [ref=e255]
                - cell "₹3,50,000" [ref=e256]
                - cell "Instagram" [ref=e257]
                - cell "Tamil Selvan R Tamil Selvan R" [ref=e258]:
                  - generic [ref=e259]:
                    - img "Tamil Selvan R" [ref=e260]
                    - generic [ref=e261]: Tamil Selvan R
                - cell "High" [ref=e262]
                - cell [ref=e264]:
                  - button "Contacted" [ref=e266]
                - cell "2026-09-29" [ref=e271]
                - cell [ref=e272]:
                  - generic [ref=e273]:
                    - button "Schedule Follow-up" [ref=e274]
                    - button "Edit Lead" [ref=e278]
                    - button "Delete Lead" [ref=e281]
          - generic [ref=e286]:
            - generic [ref=e287]:
              - generic [ref=e293]:
                - heading "Create New Lead / Enquiry" [level=3] [ref=e294]
                - paragraph [ref=e295]: Add prospective client details, scope, budget and team assignment.
              - button [ref=e296] [cursor=pointer]
            - generic [ref=e300]:
              - generic [ref=e301]:
                - generic [ref=e302]: Client & Contact Information
                - generic [ref=e308]:
                  - generic [ref=e309]:
                    - generic [ref=e310]: Client Contact Name *
                    - textbox "e.g. Ramesh Kumar" [ref=e312]
                  - generic [ref=e313]:
                    - generic [ref=e314]: Company / Brand Name
                    - textbox "e.g. Apex Matrimony Pvt Ltd" [ref=e315]
                - generic [ref=e316]:
                  - generic [ref=e317]:
                    - generic [ref=e318]: Phone / Mobile
                    - textbox "+91 98765 43210" [ref=e322]: +91 98765
                  - generic [ref=e323]:
                    - generic [ref=e324]: Email Address
                    - textbox "client@domain.com" [ref=e329]
                  - generic [ref=e330]:
                    - generic [ref=e331]: Location / City
                    - textbox "Chennai, India" [ref=e336]: Chennai, Tamil Nadu
              - generic [ref=e337]:
                - generic [ref=e338]: Project Scope & Commercials
                - generic [ref=e343]:
                  - generic [ref=e344]: Requirement Summary *
                  - textbox "e.g. Custom ERP with Flutter Mobile App & Payment Gateway" [ref=e345]
                - generic [ref=e346]:
                  - generic [ref=e347]:
                    - generic [ref=e348]: Project Type
                    - textbox "e.g. Website + Mobile App" [ref=e349]: Website + Android App
                    - generic [ref=e350]:
                      - button "Web App" [ref=e351] [cursor=pointer]
                      - button "Mobile App" [ref=e352] [cursor=pointer]
                      - button "UI/UX" [ref=e353] [cursor=pointer]
                      - button "Custom ERP" [ref=e354] [cursor=pointer]
                      - button "E-Commerce" [ref=e355] [cursor=pointer]
                  - generic [ref=e356]:
                    - generic [ref=e357]: Estimated Budget (₹)
                    - spinbutton "150000" [ref=e362]
                    - generic [ref=e363]:
                      - button "₹50k" [ref=e364] [cursor=pointer]
                      - button "₹1.5L" [ref=e365] [cursor=pointer]
                      - button "₹3L" [ref=e366] [cursor=pointer]
                      - button "₹5L+" [ref=e367] [cursor=pointer]
                - generic [ref=e368]:
                  - generic [ref=e369]:
                    - generic [ref=e370]: Lead Source
                    - combobox [ref=e371] [cursor=pointer]:
                      - option "Instagram (Social Ad / DM)" [selected]
                      - option "Client Referral / Network"
                      - option "Official Website Lead Form"
                      - option "LinkedIn Outreach"
                      - option "Direct Phone Call / Walk-in"
                      - option "Upwork / Freelance Platform"
                  - generic [ref=e372]:
                    - generic [ref=e373]: Expected Timeline
                    - textbox "e.g. 4 Weeks" [ref=e374]: 4 Weeks
              - generic [ref=e375]:
                - generic [ref=e376]: Assignment & Pipeline Status
                - generic [ref=e382]:
                  - generic [ref=e383]:
                    - generic [ref=e384]: Assigned Team Member
                    - combobox [ref=e385] [cursor=pointer]:
                      - option "Tamil Selvan R (Admin)" [selected]
                      - option "Jeevanandham (Admin)"
                      - option "Bharath Vishal (Admin)"
                  - generic [ref=e386]:
                    - generic [ref=e387]: Lead Priority
                    - combobox [ref=e388] [cursor=pointer]:
                      - option "Low Priority"
                      - option "Medium Priority"
                      - option "High Priority" [selected]
                      - option "Urgent / Hot Lead"
                  - generic [ref=e389]:
                    - generic [ref=e390]: Initial Status
                    - combobox [ref=e391] [cursor=pointer]:
                      - option "New Lead" [selected]
                      - option "Contacted"
                      - option "Qualified"
                      - option "Proposal"
                      - option "Negotiation"
                - generic [ref=e392]:
                  - generic [ref=e393]: Client Requirements / Notes (Optional)
                  - textbox "Enter any specific customer remarks, technology preferences, or initial discussion points..." [ref=e394]
              - generic [ref=e395]:
                - button "Cancel" [ref=e396] [cursor=pointer]
                - button "Create & Track Enquiry" [ref=e398] [cursor=pointer]
  - alert [ref=e401]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('E2E CRM Pipeline', async ({ page }) => {
  4  |   console.log('Testing: Enquiry -> Follow-up -> Client -> Project');
  5  |   // Navigate to Enquiries
  6  |   await page.goto('http://localhost:3000/crm/admin/enquiries');
  7  |   
  8  |   // Create New Enquiry
  9  |   await page.click('button:has-text("New Enquiry")');
> 10 |   await page.fill('input[placeholder="e.g. Acme Corp or John Doe"]', 'Automated Test Client');
     |              ^ Error: page.fill: Test timeout of 30000ms exceeded.
  11 |   await page.fill('input[placeholder="e.g. E-commerce Website"]', 'Automated Requirement');
  12 |   await page.fill('input[placeholder="e.g. 50000"]', '100000');
  13 |   await page.click('button:has-text("Create Enquiry & Track")');
  14 |   
  15 |   // Wait for it to appear and open drawer
  16 |   await page.waitForSelector('text=Automated Test Client');
  17 |   await page.click('text=Automated Test Client');
  18 |   
  19 |   // Schedule Follow-up
  20 |   await page.click('button:has-text("Schedule Follow-up")');
  21 |   await page.fill('textarea[placeholder="e.g. Discuss project scope and pricing..."]', 'Auto generated purpose');
  22 |   await page.click('button:has-text("Schedule & Move to Follow-ups")');
  23 |   
  24 |   // Navigate to Follow-ups
  25 |   await page.goto('http://localhost:3000/crm/admin/follow-ups');
  26 |   await page.waitForSelector('text=Automated Test Client');
  27 |   
  28 |   // Convert to Client
  29 |   await page.click('button[title="Move to Client"]');
  30 |   await page.click('button:has-text("Move to Client")');
  31 |   
  32 |   // Verify in Clients
  33 |   await page.goto('http://localhost:3000/crm/admin/clients');
  34 |   await page.waitForSelector('text=Automated Test Client');
  35 |   console.log('Success! Client created from pipeline.');
  36 |   
  37 |   // Create Project
  38 |   await page.goto('http://localhost:3000/crm/admin/projects');
  39 |   await page.click('button:has-text("New Project")');
  40 |   await page.locator('select').filter({ hasText: 'Automated Test Client' }).selectOption({ label: 'Automated Test Client' });
  41 |   await page.fill('input[placeholder="e.g. E-Commerce Redesign"]', 'Auto Project');
  42 |   await page.click('button:has-text("Create & Kickoff Project")');
  43 |   
  44 |   console.log('Success! End to End pipeline complete.');
  45 | });
  46 | 
```