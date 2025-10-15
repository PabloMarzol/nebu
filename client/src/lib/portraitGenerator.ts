// AI Portrait Generator for Success Stories
// Creates realistic human face portraits for testimonials

export interface PortraitConfig {
  gender: 'male' | 'female';
  ethnicity: 'asian' | 'caucasian' | 'hispanic' | 'african' | 'middle_eastern';
  age: number;
  professional: boolean;
}

// Generate realistic portrait based on configuration
export function generatePortrait(config: PortraitConfig): string {
  // Use AI-generated portrait service (placeholder for actual implementation)
  // In production, this would connect to services like Generated Photos, This Person Does Not Exist, etc.
  
  const baseUrl = "https://randomuser.me/api/portraits/";
  const genderPath = config.gender === 'male' ? 'men' : 'women';
  
  // Generate seed based on configuration for consistent results
  const seed = hashConfig(config);
  const imageId = (seed % 99) + 1; // 1-99 range
  
  return `${baseUrl}${genderPath}/${imageId}.jpg`;
}

// Create consistent hash from configuration
function hashConfig(config: PortraitConfig): number {
  const str = `${config.gender}_${config.ethnicity}_${config.age}_${config.professional}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Predefined realistic portraits for success stories
export const successStoryPortraits = {
  sarahChen: "https://images.unsplash.com/photo-1494790108755-2616b612b04c?w=400&h=400&fit=crop&crop=face",
  marcusRodriguez: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
  emilyWatson: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
  davidKim: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
  jessicaMartinez: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400&h=400&fit=crop&crop=face",
  ahmedHassan: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
  robertThompson: "https://images.unsplash.com/photo-1556474835-b0f3ac40d4d1?w=400&h=400&fit=crop&crop=face",
  priyaPatel: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
  carlosMendoza: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face",
  lindaChen: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face"
};