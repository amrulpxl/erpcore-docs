const { db, initializeDatabase } = require('../config/database');
const bcrypt = require('bcryptjs');

const seedData = async () => {
  console.log('Starting database seeding...');
  
  initializeDatabase();
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    const adminPassword = await bcrypt.hash('admin123', 12);
    
    db.run(
      'INSERT OR IGNORE INTO admin_users (username, password_hash) VALUES (?, ?)',
      ['admin', adminPassword],
      function(err) {
        if (err) {
          console.error('Error seeding admin user:', err);
        } else {
          console.log('Admin user seeded successfully');
        }
      }
    );

    const rules = [
      {
        title: 'General Server Rules',
        content: `# General Server Rules

## 1. Respect and Conduct
- Treat all players with respect and courtesy
- No harassment, discrimination, or toxic behavior
- Use appropriate language in all communications
- Follow staff instructions at all times

## 2. Character Guidelines
- Create realistic character names (no celebrity names, numbers, or symbols)
- Maintain character consistency and development
- No metagaming or powergaming
- Stay in character at all times in IC areas

## 3. Communication Rules
- Use /ooc sparingly and only when necessary
- No advertising other servers
- English only in global chats
- Report rule violations through proper channels

## 4. Fair Play
- No cheating, hacking, or exploiting bugs
- No alt accounts for unfair advantages
- Play fairly and maintain server integrity`,
        category: 'General Rules',
        version: '2.1.0'
      },
      {
        title: 'Faction Management Rules',
        content: `# Faction Management Rules

## Leadership Requirements
- Faction leaders must be active (minimum 20 hours per week)
- Leaders are responsible for member conduct
- Regular faction meetings and activities required
- Maintain faction roleplay standards

## Member Guidelines
- Follow faction hierarchy and chain of command
- Participate in faction activities
- Represent faction positively
- No faction hopping (30-day cooldown between factions)

## Faction Wars
- Must have valid IC reasons for conflicts
- Follow war declaration procedures
- Respect ceasefire agreements
- No targeting of uninvolved players`,
        category: 'Faction Rules',
        version: '1.8.0'
      },
      {
        title: 'Gang Territory Rules',
        content: `# Gang Territory Rules

## Territory Control
- Gangs can control maximum 3 territories
- Territory wars must be scheduled with admins
- 48-hour notice required for territory attacks
- Defend territories within 72 hours or lose control

## Gang Activities
- Illegal activities must be realistic
- No random violence or drive-bys
- Respect neutral zones and safe areas
- Follow drug dealing and weapon trafficking rules

## Recruitment
- No recruiting in OOC channels
- New members need 1-week probation period
- Background checks required for sensitive positions`,
        category: 'Gang Rules',
        version: '1.5.2'
      }
    ];

    rules.forEach((rule, index) => {
      db.run(
        'INSERT INTO rules (title, content, category, version) VALUES (?, ?, ?, ?)',
        [rule.title, rule.content, rule.category, rule.version],
        function(err) {
          if (err) {
            console.error(`Error seeding rule ${index + 1}:`, err);
          } else {
            console.log(`Rule "${rule.title}" seeded successfully`);
          }
        }
      );
    });

    const changelogs = [
      {
        title: 'Major Economy Update',
        content: `# Version 2.5.0 - Major Economy Update

## New Features
- **Dynamic Market System**: Prices now fluctuate based on supply and demand
- **Business Partnerships**: Players can now form business alliances
- **Investment System**: Invest in stocks and properties for passive income
- **Cryptocurrency Trading**: New digital currency system implemented

## Improvements
- Optimized server performance by 35%
- Enhanced anti-cheat detection systems
- Improved faction management interface
- Better mobile device compatibility

## Bug Fixes
- Fixed vehicle spawning issues in certain areas
- Resolved property ownership transfer bugs
- Fixed faction rank display problems
- Corrected salary calculation errors

## Balance Changes
- Reduced weapon prices by 15%
- Increased property maintenance costs
- Adjusted faction payouts for better balance
- Modified drug dealing profit margins`,
        version: '2.5.0',
        release_date: '2024-01-15'
      },
      {
        title: 'Holiday Event & Security Updates',
        content: `# Version 2.4.8 - Holiday Event & Security Updates

## Holiday Event
- **Winter Festival**: Special holiday decorations across the city
- **Gift System**: Daily login rewards throughout December
- **Snow Weather**: Realistic winter weather effects
- **Holiday Vehicles**: Special themed vehicles available

## Security Enhancements
- Implemented advanced DDoS protection
- Enhanced player data encryption
- Improved ban evasion detection
- Strengthened account security measures

## Quality of Life
- Added quick travel system for VIP members
- Improved chat system with better filtering
- Enhanced character creation interface
- Added more customization options

## Bug Fixes
- Fixed rare server crash issues
- Resolved login queue problems
- Fixed vehicle modification glitches
- Corrected time synchronization issues`,
        version: '2.4.8',
        release_date: '2023-12-01'
      },
      {
        title: 'Faction System Overhaul',
        content: `# Version 2.4.0 - Faction System Overhaul

## Major Changes
- **New Faction Types**: Added Medical, Legal, and Media factions
- **Faction Headquarters**: Customizable faction bases with unique features
- **Rank System**: Redesigned promotion and demotion mechanics
- **Faction Wars**: Structured conflict system with objectives

## New Features
- Faction-specific vehicles and equipment
- Internal faction communication systems
- Faction treasury and budget management
- Achievement system for faction activities

## Improvements
- Better faction member tracking
- Enhanced faction statistics
- Improved faction application process
- Streamlined faction management tools

## Bug Fixes
- Fixed faction invite system bugs
- Resolved faction chat display issues
- Corrected faction vehicle access problems
- Fixed faction rank permission glitches`,
        version: '2.4.0',
        release_date: '2023-10-20'
      }
    ];

    changelogs.forEach((changelog, index) => {
      db.run(
        'INSERT INTO changelog (title, content, version, release_date) VALUES (?, ?, ?, ?)',
        [changelog.title, changelog.content, changelog.version, changelog.release_date],
        function(err) {
          if (err) {
            console.error(`Error seeding changelog ${index + 1}:`, err);
          } else {
            console.log(`Changelog "${changelog.title}" seeded successfully`);
          }
        }
      );
    });

    console.log('Database seeding completed!');
    
  } catch (error) {
    console.error('Error during seeding:', error);
  }
};

if (require.main === module) {
  seedData().then(() => {
    console.log('Seeding process finished');
    process.exit(0);
  }).catch(err => {
    console.error('Seeding failed:', err);
    process.exit(1);
  });
}

module.exports = { seedData };
