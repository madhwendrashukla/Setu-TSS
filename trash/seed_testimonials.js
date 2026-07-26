const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding testimonials...');

  await prisma.testimonial.deleteMany();

  const testimonials = [
    {
      type: 'text',
      name: 'Priya Sharma',
      designation: 'Founder & CEO',
      city: 'Bangalore',
      quote: 'The Startup School gave us the exact framework we needed to pivot and find product-market fit. The mentorship is world-class.',
      event_tag: 'Cohort 1',
      display_order: 1
    },
    {
      type: 'text',
      name: 'Arjun Desai',
      designation: 'CTO',
      city: 'Mumbai',
      quote: 'I came in with just an idea and left with a working MVP and my first 10 paying customers. Absolutely incredible experience.',
      event_tag: 'AI Workshop',
      display_order: 2
    },
    {
      type: 'text',
      name: 'Rohan Gupta',
      designation: 'Co-Founder',
      city: 'Delhi',
      quote: 'The community you build here is your biggest asset. I met my co-founder and lead investor through TSS networking events.',
      event_tag: 'Cohort 2',
      display_order: 3
    },
    {
      type: 'video',
      name: 'Sneha Patel',
      video_heading: 'From Zero to Series A',
      youtube_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      video_description: 'Sneha shares how the intensive 12-week program helped her refine her pitch and secure her first institutional round.',
      event_tag: 'Demo Day',
      display_order: 4,
      show_description: true
    },
    {
      type: 'video',
      name: 'Vikram Singh',
      video_heading: 'Building a B2B SaaS',
      youtube_url: 'https://www.youtube.com/embed/jNQXAC9IVRw',
      video_description: 'Hear Vikram talk about the tactical sales advice he received from our expert mentors.',
      event_tag: 'Sales Bootcamp',
      display_order: 5,
      show_description: true
    }
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }

  console.log('Testimonials seeded successfully!');
}

seed()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
