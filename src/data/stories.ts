import type { Story } from '../types';

export const STORIES: Story[] = [
  {
    id: 'story-1',
    title: 'Hiking The Canadian Rockies With My Camera',
    tag: 'TRAVEL',
    date: 'May 12, 2024',
    readTime: '6 min read',
    coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=85',
    location: 'Banff National Park, Canada',
    excerpt: 'Ascending sub-zero ridges with 14kg of camera gear taught me how patience and physical endurance transform landscape photography.',
    quote: 'The mountain rewards those who wait past the point where common sense tells you to turn back.',
    content: [
      'There is a quiet stillness that settles over the Canadian Rockies at 5:00 AM before the sun clears the serrated summits. The thermometer mounted to my pack read -8°C as my boots crunched into glacial shale.',
      'Carrying a heavy mirrorless rig with weather-sealed glass over 1,200 vertical meters is physically demanding, but the clarity of thin air at high altitude yields micro-contrast that no studio filter can replicate.',
      'Key takeaway: Always carry mechanical shutter backups, keep lithium-ion batteries inside your thermal inner jacket, and scout your vantage point during midday light before returning in pre-dawn gloom.'
    ]
  },
  {
    id: 'story-2',
    title: 'My Favorite Camera Settings For Sharp Photos',
    tag: 'GEAR',
    date: 'May 8, 2024',
    readTime: '5 min read',
    coverImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=85',
    location: 'Cape Town Studio, South Africa',
    excerpt: 'Debunking the myth of ultra-wide apertures and breaking down the precise auto-focus tracking calibrations I use on commercial assignments.',
    quote: 'Sharpness is not merely a technical parameter; it is the discipline of knowing where the viewer’s eye must rest.',
    content: [
      'Too many photographers blame their lenses for softness when the culprit is almost always micro-motion blur or miscalibrated depth-of-field expectations. Shooting wide open at f/1.2 might create pleasant bokeh, but on dynamic editorial sets, stopping down to f/2.2 or f/2.8 often triples your keeper rate.',
      'For handheld natural light work, adhere to the reciprocal rule multiplied by 1.5x on high-resolution sensors (50MP+). When using an 85mm prime, never drop below 1/250s unless you are stabilized with a solid carbon tripod.',
      'Configure back-button focus with instantaneous eye-tracking override. This gives you tactile separation between shutter release timing and autofocus lock.'
    ]
  },
  {
    id: 'story-3',
    title: '5 Tips For Natural Wedding Photography',
    tag: 'WEDDING',
    date: 'May 3, 2024',
    readTime: '7 min read',
    coverImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=85',
    location: 'Valensole, France',
    excerpt: 'How to move invisibly, cultivate genuine emotional rapport, and anticipate unscripted moments without intrusive posing.',
    quote: 'The most timeless wedding photographs are the ones the couple never realized you were taking.',
    content: [
      'Authentic emotion cannot be commanded. When you instruct a couple to "look happy and kiss," tension creeps into their jawlines and shoulders. Instead, create spatial freedom: give them a prompt to whisper to each other, and step back with a 70-200mm lens.',
      'Anticipate the reactions, not just the action. When vows are spoken, keep one eye trained on the parents in the second row or the grandfather wiping a discrete tear.',
      'Light is your co-author. Avoid harsh overhead midday sunlight by scouting shaded tree groves, or embrace backlit golden hour rim lighting by exposing for skin highlights.'
    ]
  },
  {
    id: 'story-4',
    title: 'A Week In Amalfi Coast, Italy',
    tag: 'TRAVEL',
    date: 'April 28, 2024',
    readTime: '4 min read',
    coverImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1000&q=85',
    location: 'Positano, Amalfi Coast, Italy',
    excerpt: 'Navigating narrow cliffside staircases, pastel terraces, and the timeless interplay between azure water and Mediterranean architecture.',
    quote: 'Positano bites deep. It is a dream place that isn’t quite real while you are there and becomes vividly real after you have left.',
    content: [
      'The vertical architecture of the Amalfi coast presents unique compositional challenges. Traditional horizontal landscape framing cuts off either the dramatic sea cliff or the tiered pastel villas stacked above.',
      'Using a 24-70mm lens allowed me to frame vertical slices that juxtapose fishermen mending nets on the pebbled shore against lemon orchards clinging to limestone crags high overhead.',
      'The blue hour here is legendary. As twilight falls, the warm tungsten streetlamps turn the cliffside into a glowing jewel box reflected across the Tyrrhenian Sea.'
    ]
  }
];
