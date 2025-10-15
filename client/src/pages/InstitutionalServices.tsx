import InstitutionalDashboard from "@/components/advanced/InstitutionalDashboard";

export default function InstitutionalServices() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Institutional Services
          </h1>
          <p className="text-xl text-muted-foreground">
            Professional cryptocurrency trading and asset management for institutions
          </p>
        </div>

        <InstitutionalDashboard />
      </div>
    </div>
  );
}