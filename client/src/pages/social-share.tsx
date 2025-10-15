import EnhancedSocialSharing from "@/components/trading/enhanced-social-sharing";

export default function SocialSharePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-6 pt-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🚀 One-Click Social Share</h1>
          <p className="text-gray-300">Share your trading insights across all social platforms instantly</p>
        </div>

        {/* Enhanced Social Sharing Component */}
        <EnhancedSocialSharing />
      </div>
    </div>
  );
}