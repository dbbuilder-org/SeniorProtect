import { pool } from '../config/database.js';

const trustedSites = [
  // Banking & Finance
  { name: 'Chase Bank', domain: 'chase.com', category: 'banking', description: 'JPMorgan Chase banking services' },
  { name: 'Bank of America', domain: 'bankofamerica.com', category: 'banking', description: 'Bank of America financial services' },
  { name: 'Wells Fargo', domain: 'wellsfargo.com', category: 'banking', description: 'Wells Fargo banking and financial services' },
  { name: 'Capital One', domain: 'capitalone.com', category: 'banking', description: 'Capital One banking and credit cards' },
  { name: 'Fidelity', domain: 'fidelity.com', category: 'banking', description: 'Fidelity Investments retirement and brokerage' },
  { name: 'Charles Schwab', domain: 'schwab.com', category: 'banking', description: 'Charles Schwab investing and banking' },
  { name: 'Vanguard', domain: 'vanguard.com', category: 'banking', description: 'Vanguard investment management' },

  // Government
  { name: 'Social Security', domain: 'ssa.gov', category: 'government', description: 'Social Security Administration' },
  { name: 'Medicare', domain: 'medicare.gov', category: 'government', description: 'Official Medicare information' },
  { name: 'IRS', domain: 'irs.gov', category: 'government', description: 'Internal Revenue Service' },
  { name: 'USA.gov', domain: 'usa.gov', category: 'government', description: 'Official U.S. government portal' },
  { name: 'USPS', domain: 'usps.com', category: 'government', description: 'United States Postal Service' },
  { name: 'VA', domain: 'va.gov', category: 'government', description: 'Department of Veterans Affairs' },
  { name: 'FTC', domain: 'ftc.gov', category: 'government', description: 'Federal Trade Commission' },

  // Healthcare
  { name: 'Mayo Clinic', domain: 'mayoclinic.org', category: 'healthcare', description: 'Mayo Clinic health information' },
  { name: 'WebMD', domain: 'webmd.com', category: 'healthcare', description: 'Health information and resources' },
  { name: 'Cleveland Clinic', domain: 'clevelandclinic.org', category: 'healthcare', description: 'Cleveland Clinic health information' },
  { name: 'NIH', domain: 'nih.gov', category: 'healthcare', description: 'National Institutes of Health' },
  { name: 'CDC', domain: 'cdc.gov', category: 'healthcare', description: 'Centers for Disease Control and Prevention' },
  { name: 'AARP', domain: 'aarp.org', category: 'healthcare', description: 'American Association of Retired Persons' },
  { name: 'UnitedHealthcare', domain: 'uhc.com', category: 'healthcare', description: 'UnitedHealthcare insurance' },
  { name: 'CVS', domain: 'cvs.com', category: 'healthcare', description: 'CVS Pharmacy and health services' },
  { name: 'Walgreens', domain: 'walgreens.com', category: 'healthcare', description: 'Walgreens pharmacy and health' },
  { name: 'Rite Aid', domain: 'riteaid.com', category: 'healthcare', description: 'Rite Aid pharmacy' },

  // Shopping
  { name: 'Amazon', domain: 'amazon.com', category: 'shopping', description: 'Amazon online shopping' },
  { name: 'Walmart', domain: 'walmart.com', category: 'shopping', description: 'Walmart online shopping' },
  { name: 'Target', domain: 'target.com', category: 'shopping', description: 'Target online shopping' },
  { name: 'Costco', domain: 'costco.com', category: 'shopping', description: 'Costco wholesale shopping' },
  { name: 'Best Buy', domain: 'bestbuy.com', category: 'shopping', description: 'Best Buy electronics and appliances' },
  { name: 'Home Depot', domain: 'homedepot.com', category: 'shopping', description: 'Home Depot home improvement' },
  { name: "Lowe's", domain: 'lowes.com', category: 'shopping', description: "Lowe's home improvement" },
  { name: 'eBay', domain: 'ebay.com', category: 'shopping', description: 'eBay online marketplace' },

  // Social Media
  { name: 'Facebook', domain: 'facebook.com', category: 'social', description: 'Facebook social networking' },
  { name: 'YouTube', domain: 'youtube.com', category: 'social', description: 'YouTube video sharing' },
  { name: 'Instagram', domain: 'instagram.com', category: 'social', description: 'Instagram photo and video sharing' },
  { name: 'LinkedIn', domain: 'linkedin.com', category: 'social', description: 'LinkedIn professional networking' },
  { name: 'Pinterest', domain: 'pinterest.com', category: 'social', description: 'Pinterest visual discovery' },
  { name: 'NextDoor', domain: 'nextdoor.com', category: 'social', description: 'Nextdoor neighborhood network' },

  // Email & Communication
  { name: 'Gmail', domain: 'gmail.com', category: 'email', description: 'Google Gmail email service' },
  { name: 'Outlook', domain: 'outlook.com', category: 'email', description: 'Microsoft Outlook email service' },
  { name: 'Yahoo Mail', domain: 'mail.yahoo.com', category: 'email', description: 'Yahoo Mail email service' },
  { name: 'Zoom', domain: 'zoom.us', category: 'email', description: 'Zoom video conferencing' },
  { name: 'Skype', domain: 'skype.com', category: 'email', description: 'Skype communication platform' },
  { name: 'WhatsApp', domain: 'whatsapp.com', category: 'email', description: 'WhatsApp messaging service' },

  // Utilities & Services
  { name: 'Netflix', domain: 'netflix.com', category: 'utilities', description: 'Netflix streaming service' },
  { name: 'Xfinity', domain: 'xfinity.com', category: 'utilities', description: 'Xfinity internet and TV services' },
  { name: 'AT&T', domain: 'att.com', category: 'utilities', description: 'AT&T telecommunications' },
  { name: 'Verizon', domain: 'verizon.com', category: 'utilities', description: 'Verizon telecommunications' },
  { name: 'T-Mobile', domain: 't-mobile.com', category: 'utilities', description: 'T-Mobile wireless services' },
  { name: 'PayPal', domain: 'paypal.com', category: 'utilities', description: 'PayPal online payments' },
  { name: 'Apple', domain: 'apple.com', category: 'utilities', description: 'Apple products and services' },
  { name: 'Microsoft', domain: 'microsoft.com', category: 'utilities', description: 'Microsoft products and services' },

  // Transportation
  { name: 'AAA', domain: 'aaa.com', category: 'transportation', description: 'AAA roadside assistance and travel' },
  { name: 'Uber', domain: 'uber.com', category: 'transportation', description: 'Uber ride-sharing service' },
  { name: 'Lyft', domain: 'lyft.com', category: 'transportation', description: 'Lyft ride-sharing service' },
  { name: 'Amtrak', domain: 'amtrak.com', category: 'transportation', description: 'Amtrak passenger rail service' },
];

async function seed() {
  console.log('Seeding database...');

  try {
    // Seed trusted sites
    for (const site of trustedSites) {
      await pool.query(
        `INSERT INTO trusted_sites (name, domain, category, description)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (domain) DO NOTHING`,
        [site.name, site.domain, site.category, site.description]
      );
    }
    console.log(`Seeded ${trustedSites.length} trusted sites`);

    console.log('Seeding complete');
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
