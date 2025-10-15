import InstantOnboarding from "@/components/onboarding/instant-onboarding";

export default function Onboarding() {
  return (
    <div className="min-h-screen page-content pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8 page-header">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Join Nebula X
          </h1>
          <p className="text-xl text-muted-foreground">Get started in seconds with our streamlined onboarding</p>
        </div>
        
        <InstantOnboarding />
      </div>
    </div>
  );
}