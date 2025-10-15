import OnboardingAnalytics from "@/components/onboarding/onboarding-analytics";

export default function AdminAnalytics() {
  return (
    <div className="min-h-screen page-content">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="text-center mb-8 page-header">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Platform Analytics
          </h1>
          <p className="text-xl text-muted-foreground">Comprehensive insights into user onboarding and platform performance</p>
        </div>
        
        <OnboardingAnalytics />
      </div>
    </div>
  );
}