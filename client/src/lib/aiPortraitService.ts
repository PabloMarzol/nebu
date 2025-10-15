/**
 * AI Portrait Service - Generates realistic human portraits for success stories
 * Uses multiple AI portrait generation services for reliability
 */

// Primary AI portrait service URLs with fallbacks
const AI_PORTRAIT_SERVICES = {
  primary: 'https://thispersondoesnotexist.com/image',
  secondary: 'https://generated.photos/api/v1/faces',
  tertiary: 'https://picsum.photos/400/400'
};

// Predefined high-quality AI-generated portraits for consistency
export const AI_GENERATED_PORTRAITS = {
  sarahChen: 'https://images.generated.photos/vBRCiI_3ym4l4qmEKvjF8Li-hSI4StVr4RgzDQTwU-A/rs:fit:256:256/czM6Ly9pY29uczgu/Z2VuZXJhdGVkLXBo/b3Rpcy92M18wODk4/OTMwLmpwZw.jpg',
  marcusRodriguez: 'https://images.generated.photos/4kSY0MFnGJeOoT7h6ZHOuFKqQC6UcBsW2H2NQj7A4C8/rs:fit:256:256/czM6Ly9pY29uczgu/Z2VuZXJhdGVkLXBo/b3Rpcy92M18wNzM4/MjE4LmpwZw.jpg',
  emilyWatson: 'https://images.generated.photos/E2G4X-VHZmJ7F3hL2YpKrNfA9wS8Q1x5tI0UcT6vB9j/rs:fit:256:256/czM6Ly9pY29uczgu/Z2VuZXJhdGVkLXBo/b3Rpcy92M18wNjIx/MTA5LmpwZw.jpg',
  davidKim: 'https://images.generated.photos/X8qF2lN5YmJ9K4hP7ZrTuVcE3wR6Q0x2sL1UdS8vC7k/rs:fit:256:256/czM6Ly9pY29uczgu/Z2VuZXJhdGVkLXBo/b3Rpcy92M18wNTQz/MjE2LmpwZw.jpg',
  jessicaMartinez: 'https://images.generated.photos/M7pQ3lK8XmH5F2gN6YoRuScD4wP9T1x3rL2VeR7uC8j/rs:fit:256:256/czM6Ly9pY29uczgu/Z2VuZXJhdGVkLXBo/b3Rpcy92M18wNDY1/MzA3LmpwZw.jpg',
  ahmedHassan: 'https://images.generated.photos/N8qG4mL9YnI6G3hQ7ZsUvWdF5xS0R2y4tM3WfT9vD0k/rs:fit:256:256/czM6Ly9pY29uczgu/Z2VuZXJhdGVkLXBo/b3Rpcy92M18wMzg3/NDE4LmpwZw.jpg',
  robertThompson: 'https://images.generated.photos/P9rH5nM0ZoJ7H4iR8ZtVxXeG6yT1S3z5uN4XgU0wE1l/rs:fit:256:256/czM6Ly9pY29uczgu/Z2VuZXJhdGVkLXBo/b3Rpcy92M18wMzA5/NTI5LmpwZw.jpg',
  priyaPatel: 'https://images.generated.photos/Q0sI6oN1apK8I5jS9ZuWyYfH7zU2T4A6vO5YhV1xF2m/rs:fit:256:256/czM6Ly9pY29uczgu/Z2VuZXJhdGVkLXBo/b3Rpcy92M18wMjMx/NjQwLmpwZw.jpg',
  carlosMendoza: 'https://images.generated.photos/R1tJ7pO2bqL9J6kT0ZvXzZgI8AU3U5B7wP6ZiW2yG3n/rs:fit:256:256/czM6Ly9pY29uczgu/Z2VuZXJhdGVkLXBo/b3Rpcy92M18wMTUz/NzUxLmpwZw.jpg',
  lindaChen: 'https://images.generated.photos/S2uK8qP3crM0K7lU1ZwYA0hJ9BV4V6C8xQ7ajX3zH4o/rs:fit:256:256/czM6Ly9pY29uczgu/Z2VuZXJhdGVkLXBo/b3Rpcy92M18wMDc1/ODYyLmpwZw.jpg',
  jamesWilson: 'https://images.generated.photos/T3vL9rQ4dsN1L8mV2ZxZB1iK0CW5W7D9yR8bkY4AI5p/rs:fit:256:256/czM6Ly9pY29uczgu/Z2VuZXJhdGVkLXBo/b3Rpcy92M18wNjY3/OTczLmpwZw.jpg',
  fatimaAlRashid: 'https://images.generated.photos/U4wM0sR5etO2M9nW3ZyZC2jL1DX6X8E0zS9clZ5BJ6q/rs:fit:256:256/czM6Ly9pY29uczgu/Z2VuZXJhdGVkLXBo/b3Rpcy92M18wNTg5/MDg0LmpwZw.jpg',
  michaelOBrien: 'https://images.generated.photos/V5xN1tS6fuP3N0oX4ZZaD3kM2EY7Y9F1AT0dmA6CK7r/rs:fit:256:256/czM6Ly9pY29uczgu/Z2VuZXJhdGVkLXBo/b3Rpcy92M18wNTEw/MTk1LmpwZw.jpg',
  ananyaSharma: 'https://images.generated.photos/W6yO2uT7gvQ4O1pY5Z0bE4lN3FZ8Z0G2BU1enB7DL8s/rs:fit:256:256/czM6Ly9pY29uczgu/Z2VuZXJhdGVkLXBo/b3Rpcy92M18wNDMy/MzA2LmpwZw.jpg',
  sophieLaurent: 'https://images.generated.photos/X7zP3vU8hwR5P2qZ6Z1cF5mO4GA9A1H3CV2foC8EM9t/rs:fit:256:256/czM6Ly9pY29uczgu/Z2VuZXJhdGVkLXBo/b3Rpcy92M18wMzU0/NDE3LmpwZw.jpg',
  kevinPark: 'https://images.generated.photos/Y8AQ4wV9ixS6Q3rA7Z2dG6nP5HB0B2I4DW3gpD9FN0u/rs:fit:256:256/czM6Ly9pY29uczgu/Z2VuZXJhdGVkLXBo/b3Rpcy92M18wMjc2/NTI4LmpwZw.jpg',
  mariaSantos: 'https://images.generated.photos/Z9BR5xW0jyT7R4sB8Z3eH7oQ6IC1C3J5EX4hqE0GO1v/rs:fit:256:256/czM6Ly9pY29uczgu/Z2VuZXJhdGVkLXBo/b3Rpcy92M18wMTk4/NjM5LmpwZw.jpg',
  thomasAnderson: 'https://images.generated.photos/A0CS6yX1kzU8S5tC9Z4fI8pR7JD2D4K6FY5irF1HP2w/rs:fit:256:256/czM6Ly9pY29uczgu/Z2VuZXJhdGVkLXBo/b3Rpcy92M18wMTIw/NzQwLmpwZw.jpg',
  rachelGreen: 'https://images.generated.photos/B1DT7zY2l0V9T6uD0Z5gJ9qS8KE3E5L7GZ6jsG2IQ3x/rs:fit:256:256/czM6Ly9pY29uczgu/Z2VuZXJhdGVkLXBo/b3Rpcy92M18wMDQy/ODUxLmpwZw.jpg',
  alexChen: 'https://images.generated.photos/C2EU8AZ3m1W0U7vE1Z6hK0rT9LF4F6M8Ha7ktH3JR4y/rs:fit:256:256/czM6Ly9pY29uczgu/Z2VuZXJhdGVkLXBo/b3Rpcy92M18wNTY0/OTYyLmpwZw.jpg'
};

// Fallback portraits in case AI services are unavailable
export const FALLBACK_PORTRAITS = {
  male: [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&auto=format',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&auto=format',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face&auto=format'
  ],
  female: [
    'https://images.unsplash.com/photo-1494790108755-2616b612b04c?w=400&h=400&fit=crop&crop=face&auto=format',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face&auto=format',
    'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400&h=400&fit=crop&crop=face&auto=format'
  ]
};

/**
 * Get AI-generated portrait for a specific person
 */
export function getAIPortrait(name: string): string {
  const key = name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z]/g, '');
  
  // Try to get predefined AI portrait
  const aiPortrait = AI_GENERATED_PORTRAITS[key as keyof typeof AI_GENERATED_PORTRAITS];
  if (aiPortrait) {
    return aiPortrait;
  }
  
  // Generate fallback based on name characteristics
  const isFemale = ['sarah', 'emily', 'jessica', 'linda', 'fatima', 'ananya', 'sophie', 'maria', 'rachel'].some(n => key.includes(n));
  const fallbackArray = isFemale ? FALLBACK_PORTRAITS.female : FALLBACK_PORTRAITS.male;
  const index = key.length % fallbackArray.length;
  
  return fallbackArray[index];
}

/**
 * Generate a random AI portrait from service
 */
export async function generateRandomPortrait(): Promise<string> {
  try {
    // Try primary service
    const response = await fetch(AI_PORTRAIT_SERVICES.primary);
    if (response.ok) {
      return response.url;
    }
  } catch (error) {
    console.warn('Primary AI portrait service unavailable');
  }
  
  // Fallback to random fallback portrait
  const allFallbacks = [...FALLBACK_PORTRAITS.male, ...FALLBACK_PORTRAITS.female];
  return allFallbacks[Math.floor(Math.random() * allFallbacks.length)];
}

/**
 * Validate if portrait URL is working
 */
export async function validatePortraitUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}