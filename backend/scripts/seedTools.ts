import { PrismaClient } from '@prisma/client';
import { pitchDecksData as pitchDecks } from '../../web/lib/data/pitchDecks';
import { grantsData } from '../../web/lib/data/grants';
import { investorsData } from '../../web/lib/data/Investors/investors';
import { incubatorsData } from '../../web/lib/data/Incubators and Accelerators/incubators';
import { eventsData } from '../../web/lib/data/events';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing Tools & Resources data...');
  await prisma.pitchDeck.deleteMany({});
  await prisma.grant.deleteMany({});
  await prisma.investor.deleteMany({});
  await prisma.incubator.deleteMany({});
  await prisma.founderEvent.deleteMany({});

  console.log('Seeding Pitch Decks...');
  const pitchDecksPayload = pitchDecks.map((p: any) => ({
    company: p.company || '',
    tagline: p.tagline || '',
    sector: p.sector || '',
    round: p.round || '',
    year: p.year || null,
    raisedThisRound: p.raisedThisRound || '',
    totalRaised: p.totalRaised || '',
    investors: p.investors || [],
    outcome: p.outcome || '',
    keyLesson: p.keyLesson || '',
    sourceUrl: p.sourceUrl || '',
    deckUrl: p.deckUrl || '',
    tags: p.tags || [],
    is_active: true
  }));
  await prisma.pitchDeck.createMany({ data: pitchDecksPayload });

  console.log('Seeding Grants...');
  const grantsPayload = grantsData.map((g: any) => ({
    title: g.name || '',
    description: g.type || '',
    amount: g.fundingSupport || '',
    deadline: g.deadline || '',
    eligibility: g.criteria || '',
    link: g.website || '',
    is_active: true
  }));
  await prisma.grant.createMany({ data: grantsPayload });

  console.log('Seeding Investors...');
  const investorsPayload = investorsData.map((i: any) => ({
    name: i.name || '',
    firm: i.title || '',
    type: i.type || '',
    stages: i.stages || [],
    sectors: i.industries || [],
    ticketSize: '', // Not strictly mapped in old interface
    about: i.about || '',
    linkedin: i.socials?.linkedin || '',
    is_active: true
  }));
  await prisma.investor.createMany({ data: investorsPayload });

  console.log('Seeding Incubators...');
  const incubatorsPayload = incubatorsData.map((i: any) => ({
    name: i.name || '',
    location: i.location || i.address || '',
    focus: i.focusSector ? [i.focusSector] : [],
    programLength: i.programDuration || '',
    equityTaken: i.equityTaken || '',
    website: i.website || '',
    is_active: true
  }));
  await prisma.incubator.createMany({ data: incubatorsPayload });

  console.log('Seeding Founder Events...');
  const founderEventsPayload = eventsData.map((e: any) => ({
    tag: e.tag || '',
    eventName: e.eventName || '',
    exhibitionCentre: e.exhibitionCentre || '',
    location: e.location || '',
    startDate: e.startDate || '',
    month: e.month || '',
    weblink: e.weblink || '',
    priority: e.priority || '',
    description: e.description || '',
    is_active: true
  }));
  await prisma.founderEvent.createMany({ data: founderEventsPayload });

  console.log('Seeding complete!');
}

main()
  .catch((e: any) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
