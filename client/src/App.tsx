import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LiveDataProvider } from "@/components/websocket/live-data-provider";
// Removed InteractiveTutorialBot import - has floating elements
import PlayfulLoading from "@/components/animations/playful-loading";
import { ThemeChangeEffect } from "@/components/theme/neo-theme-switcher";
import { DataStreamBackground } from "@/components/animations/data-micro-interactions";
import  Navbar   from "@/components/layout/navbar-simple";
import Footer from "@/components/layout/footer";
import DynamicBackground from "@/components/layout/dynamic-background";
import FuturisticBackground from "@/otc-components/futuristic-background";
import UniversalVideoBackground from "@/components/background/universal-video-background";
import Home from "@/pages/home";
import Trading from "@/pages/trading";
import Markets from "@/pages/markets";
import Platform from "@/pages/platform";
import About from "@/pages/about";
import CRMDashboard from "@/pages/crm-dashboard";
import Institutional from "@/pages/institutional";
import Launchpad from "@/pages/launchpad";
import Voting from "@/pages/voting";
import Rewards from "@/pages/rewards";
import DueDiligence from "@/pages/due-diligence";
import AIRiskAssessment from "@/pages/ai-risk-assessment";
import Recommendations from "@/pages/recommendations";
import Education from "@/pages/education";
import SocialLeaderboard from "@/pages/social-leaderboard";
import Portfolio from "@/pages/portfolio";
import SoundDesign from "@/pages/sound-design";
import SMSNotificationsPage from "@/pages/sms-notifications";
import PortfolioAnalytics from "@/pages/portfolio-analytics";
import PortfolioDiversification from "@/pages/PortfolioDiversification";
import VideoRecorderPage from "@/pages/video-recorder";
import AIPortfolioBalancer from "@/pages/AIPortfolioBalancer";
import PortfolioBackup from "@/pages/PortfolioBackup";
import RiskEvaluation from "@/pages/risk-evaluation";
import MarketSentiment from "@/pages/market-sentiment";
import KYCVerificationPage from "@/pages/kyc-verification";
import Wallet from "@/pages/wallet";
import Compliance from "@/pages/compliance";
import Onboarding from "@/pages/onboarding";
import ForgotPassword from "@/pages/auth/forgot-password";
import ResetPassword from "@/pages/auth/reset-password";
import Setup2FA from "@/pages/auth/setup-2fa";
import SecuritySettings from "@/pages/SecuritySettings";
import ApiKeys from "@/pages/ApiKeys";
import APIDocs from "@/pages/APIDocs";
import KYCUpload from "@/pages/auth/kyc-upload";
import VerifyEmail from "@/pages/auth/verify-email";
// import AuthDashboard from "@/pages/auth/dashboard";
import CommunicationCenter from "@/pages/CommunicationCenter";
import BusinessManagement from "@/pages/business-management";
import InstitutionalServices from "@/pages/InstitutionalServices";
import OperationsDashboard from "@/pages/operations-dashboard";
import ComprehensiveAdmin from "@/pages/comprehensive-admin";
import BusinessCRM from "@/pages/business-crm";
import AdminPanel from "@/pages/admin-panel";
import AdminComplianceDashboard from "@/pages/admin-compliance-dashboard";
import AdminTradingOperations from "@/pages/admin-trading-operations";
import AdminTreasuryPanel from "@/pages/admin-treasury-panel";
import AdvancedPortfolio from "@/pages/advanced-portfolio";
import AdvancedTradingPage from "@/pages/advanced-trading";
import AdvancedFeaturesPage from "@/pages/AdvancedFeatures";
import MobilePhase2 from "@/pages/MobilePhase2";
import AIPhase3 from "@/pages/AIPhase3";
import AdvancedIntegrationsPhase4 from "@/pages/AdvancedIntegrationsPhase4";
import IntegratedPhases567 from "@/pages/IntegratedPhases567";

import MobileApp from "@/components/mobile/MobileApp";
import PricingTiers from "@/components/premium/PricingTiers";
import AdvancedFeatures from "@/components/premium/AdvancedFeatures";
import StreamlinedSignup from "@/components/onboarding/streamlined-signup";
import MarketingLanding from "@/pages/marketing-landing";
import AcquisitionCampaigns from "@/components/marketing/acquisition-campaigns";
import EmailCampaigns from "@/components/marketing/email-campaigns";
import CryptoLearningPass from "@/components/gamification/crypto-learning-pass";
import MarketingDashboard from "@/components/analytics/marketing-dashboard";
import MicroAnimations from "@/components/animations/micro-animations";
import TradingRecommendations from "@/components/recommendations/trading-recommendations";
import SuccessStories from "@/components/social-proof/success-stories";
import EnhancedPortfolioDashboard from "@/components/trading/enhanced-portfolio-dashboard";
import SimpleAIChat from "@/components/trading/simple-ai-chat";
import CryptoPayments from "@/pages/crypto-payments";
import SecurityDashboard from "@/pages/security";
import { useWalletAuth } from "@/hooks/useWalletAuth";
import AdminAnalytics from "@/pages/admin-analytics";
import AIAssistant from "@/pages/ai-assistant";
import SMSSettingsPage from "@/pages/sms-settings";
import CryptoPaymentPage from "@/pages/crypto-payment";
import ProjectDetails from "@/pages/project-details";
import CopyTrading from "@/pages/copy-trading";
import P2PTrading from "@/pages/p2p-trading";
import OTCDesk from "@/pages/otc-desk";
import Staking from "@/pages/staking";
import TermsOfService from "@/pages/terms-of-service";
import PrivacyPolicy from "@/pages/privacy-policy";
import AMLPolicy from "@/pages/aml-policy";
import RiskDisclosure from "@/pages/risk-disclosure";
import NotFound from "@/pages/not-found";
import SocialEducationHub from "@/pages/SocialEducationHub";
import MarketingPage from "@/pages/marketing";
import Demo from "@/pages/demo";
import Contact from "@/pages/contact";
import ComplianceCenter from "@/pages/compliance-center";
import PricingPage from "@/pages/pricing";
import LearningPassPage from "@/pages/learning-pass";
import AIRecommendationsPage from "@/pages/ai-recommendations";
import SuccessStoriesPage from "@/pages/success-stories";
import AnimationsPage from "@/pages/animations";
import TestBlur from "@/pages/test-blur";
import HomeClean from "@/pages/home-clean";
import AdvancedAnalyticsPage from "@/pages/advanced-analytics";
import SystemStatus from "@/pages/system-status";
import SocialSharePage from "@/pages/social-share";
import WhiteLabelPage from "@/pages/white-label";
import NaturalLanguagePage from "@/pages/natural-language";
import TradingFees from "@/pages/trading-fees";
import InteractiveDemo from "@/pages/interactive-demo";
import Support from "@/pages/support";
import PaymentSuccess from "@/pages/payment-success";
import RecoveryDashboard from "@/components/RecoveryDashboard";

// Gamification Features
import CryptoLearningCarnival from "@/components/gamification/crypto-learning-carnival";
import EmojiMoodTracker from "@/components/gamification/emoji-mood-tracker";
import PortfolioScreenshot from "@/components/gamification/portfolio-screenshot";
import CryptoMascotAssistant from "@/components/gamification/crypto-mascot-assistant";
import AchievementStickers from "@/components/gamification/achievement-stickers";
import ExchangeOperationsDashboard from "@/pages/exchange-operations-dashboard";
import UnifiedCRMWorkspacesPage from "@/pages/unified-crm-workspaces";
import RoleBasedCRMPage from "@/pages/role-based-crm";
import Alt5PayIntegration from "@/pages/alt5pay-integration";
import PaymentSimulation from "@/pages/payment-simulation";
import AdminUserRolesPage from "@/pages/admin-user-roles";
import ClientPortalPage from "@/pages/client-portal";
import EnhancedPaymentGateway from "@/components/payment/enhanced-payment-gateway";
import CoinCapIntegration from "@/pages/CoinCapIntegration";
import AdvancedCRMSystems from "@/pages/advanced-crm-systems";
import HybridLiquidityDashboard from "@/components/advanced/HybridLiquidityDashboard";




// Removed floating components imports

import LayerResetQuiz from "@/components/ui/layer-reset-quiz";
import EnhancedFeatures from "@/pages/enhanced-features";
import Alt5ProIntegration from "@/pages/alt5pro-integration";

// Removed floating UI component imports
import { PageTransition, NavigationTransition } from "@/components/animations/smooth-page-transitions";
import IntelligentColorSchemeAdapter from "@/components/ui/intelligent-color-scheme-adapter";
import PlayfulMascotNebby from "@/components/onboarding/playful-mascot-nebby";
import PersonalizedWidgetRecommendations from "@/components/dashboard/personalized-widget-recommendations";

function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return null;
}

function Router() {
  return (
    <PageTransition>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/trading" component={Trading} />
        <Route path="/markets" component={Markets} />
        <Route path="/platform" component={Platform} />
        <Route path="/institutional" component={Institutional} />
        <Route path="/launchpad" component={Launchpad} />
        <Route path="/voting" component={Voting} />
        <Route path="/rewards" component={Rewards} />
        <Route path="/due-diligence" component={DueDiligence} />
        <Route path="/ai-risk-assessment" component={AIRiskAssessment} />
        <Route path="/recommendations" component={Recommendations} />
        <Route path="/education" component={Education} />
        <Route path="/social-leaderboard" component={SocialLeaderboard} />
        <Route path="/portfolio" component={Portfolio} />
        <Route path="/sound-design" component={SoundDesign} />
        <Route path="/portfolio-analytics" component={PortfolioAnalytics} />
        <Route path="/portfolio-diversification" component={PortfolioDiversification} />
        <Route path="/ai-portfolio-balancer" component={AIPortfolioBalancer} />
        <Route path="/portfolio-backup" component={PortfolioBackup} />
        <Route path="/risk-evaluation" component={RiskEvaluation} />
        <Route path="/market-sentiment" component={MarketSentiment} />
        <Route path="/advanced-portfolio" component={AdvancedPortfolio} />
        <Route path="/advanced-trading" component={AdvancedTradingPage} />
        <Route path="/advanced-features" component={AdvancedFeaturesPage} />
        <Route path="/kyc-verification" component={KYCVerificationPage} />
        <Route path="/wallet" component={Wallet} />
        <Route path="/security" component={SecurityDashboard} />
        <Route path="/compliance" component={Compliance} />
        <Route path="/onboarding" component={Onboarding} />
        {/* CLIENT-FACING CRM - Available on main domain */}
        <Route path="/client-portal" component={ClientPortalPage} />
        <Route path="/support" component={Support} />
        <Route path="/ai-assistant" component={AIAssistant} />
        
        {/* ADMIN/MANAGEMENT CRM ROUTES - These should be moved to subdomains in production */}
        {/* Access these routes for admin/management functions only */}
        <Route path="/admin/analytics" component={AdminAnalytics} />
        <Route path="/admin/crm-dashboard" component={CRMDashboard} />
        <Route path="/admin/business-management" component={BusinessManagement} />
        <Route path="/admin/operations-dashboard" component={OperationsDashboard} />
        <Route path="/admin/comprehensive-admin" component={ComprehensiveAdmin} />
        <Route path="/admin/business-crm" component={BusinessCRM} />
        <Route path="/admin/panel" component={AdminPanel} />
        <Route path="/admin/compliance-dashboard" component={AdminComplianceDashboard} />
        <Route path="/admin/trading-operations" component={AdminTradingOperations} />
        <Route path="/admin/treasury-panel" component={AdminTreasuryPanel} />
        <Route path="/admin/exchange-operations" component={ExchangeOperationsDashboard} />
        <Route path="/hybrid-liquidity" component={HybridLiquidityDashboard} />
        <Route path="/admin/unified-crm-workspaces" component={UnifiedCRMWorkspacesPage} />
        <Route path="/admin/role-based-crm" component={RoleBasedCRMPage} />
        <Route path="/admin/user-roles" component={AdminUserRolesPage} />
        <Route path="/advanced-crm-systems" component={AdvancedCRMSystems} />
        <Route path="/sms-settings" component={SMSSettingsPage} />
        <Route path="/api-keys" component={ApiKeys} />
        <Route path="/docs/api" component={APIDocs} />
        <Route path="/coincap-integration" component={CoinCapIntegration} />
        <Route path="/crypto-payment" component={CryptoPaymentPage} />
        <Route path="/project-details" component={ProjectDetails} />
        <Route path="/copy-trading" component={CopyTrading} />
        <Route path="/p2p-trading" component={P2PTrading} />
        <Route path="/otc-desk" component={OTCDesk} />
        <Route path="/staking" component={Staking} />
        <Route path="/about" component={About} />
        <Route path="/trading-fees" component={TradingFees} />
        <Route path="/system-status" component={SystemStatus} />
        <Route path="/terms" component={TermsOfService} />
        <Route path="/terms-of-service" component={TermsOfService} />
        <Route path="/privacy" component={PrivacyPolicy} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/aml-policy" component={AMLPolicy} />
        <Route path="/risk-disclosure" component={RiskDisclosure} />
        <Route path="/marketing" component={MarketingPage} />
        <Route path="/compliance-center" component={ComplianceCenter} />
        <Route path="/pricing" component={PricingPage} />
        <Route path="/learning-pass" component={LearningPassPage} />
        <Route path="/ai-recommendations" component={AIRecommendationsPage} />
        <Route path="/success-stories" component={SuccessStoriesPage} />
        <Route path="/animations" component={AnimationsPage} />
        
        {/* Authentication Routes */}
        {/* <Route path="/auth/login" component={Login} /> */}
        {/* <Route path="/auth/register" component={Register} /> */}
        <Route path="/auth/forgot-password" component={ForgotPassword} />
        <Route path="/auth/reset-password" component={ResetPassword} />
        <Route path="/auth/verify-email" component={VerifyEmail} />
        <Route path="/auth/setup-2fa" component={Setup2FA} />
        <Route path="/auth/kyc-upload" component={KYCUpload} />
        {/* <Route path="/auth/dashboard" component={AuthDashboard} /> */}
        <Route path="/communication" component={CommunicationCenter} />
        <Route path="/institutional-services" component={InstitutionalServices} />
        <Route path="/mobile" component={() => <MobileApp userTier="basic" />} />
        <Route path="/mobile-trading" component={() => <MobileApp userTier="pro" />} />
        <Route path="/mobile-phase-2" component={MobilePhase2} />
        <Route path="/ai-phase-3" component={AIPhase3} />
        <Route path="/advanced-integrations-phase-4" component={AdvancedIntegrationsPhase4} />
        <Route path="/integrated-phases-567" component={IntegratedPhases567} />
        <Route path="/pricing" component={PricingTiers} />
        <Route path="/features" component={AdvancedFeatures} />
        <Route path="/signup" component={StreamlinedSignup} />
        {/* <Route path="/wallet-test" component={WalletAuthTest} /> */}
        <Route path="/marketing" component={MarketingLanding} />
        <Route path="/campaigns" component={AcquisitionCampaigns} />
        <Route path="/email-marketing" component={EmailCampaigns} />
        <Route path="/learning-pass" component={CryptoLearningPass} />
        <Route path="/analytics-dashboard" component={MarketingDashboard} />
        <Route path="/animations" component={MicroAnimations} />
        <Route path="/trading-recommendations" component={Recommendations} />
        <Route path="/success-stories" component={SuccessStories} />
        <Route path="/test-blur" component={TestBlur} />
        <Route path="/advanced-analytics" component={AdvancedAnalyticsPage} />
        <Route path="/white-label" component={WhiteLabelPage} />
        <Route path="/natural-language" component={NaturalLanguagePage} />
        <Route path="/social-education" component={SocialEducationHub} />
        <Route path="/social-share" component={SocialSharePage} />
        <Route path="/demo" component={Demo} />
        <Route path="/interactive-demo" component={InteractiveDemo} />
        <Route path="/contact" component={Contact} />
        <Route path="/enhanced-features" component={() => <EnhancedFeatures />} />
        <Route path="/alt5pay-integration" component={Alt5PayIntegration} />
        <Route path="/payment-simulation" component={PaymentSimulation} />
        
        {/* Gamification Features */}
        <Route path="/learning-carnival" component={CryptoLearningCarnival} />
        <Route path="/mood-tracker" component={EmojiMoodTracker} />
        <Route path="/portfolio-screenshot" component={PortfolioScreenshot} />
        <Route path="/crypto-tutor" component={CryptoMascotAssistant} />
        <Route path="/achievements" component={AchievementStickers} />
        <Route path="/sms-notifications" component={SMSNotificationsPage} />
        <Route path="/security-settings" component={SecuritySettings} />
        <Route path="/video-recorder" component={VideoRecorderPage} />
        <Route path="/payment" component={() => <EnhancedPaymentGateway />} />
        <Route path="/payments" component={() => <EnhancedPaymentGateway />} />
        <Route path="/payment-success" component={PaymentSuccess} />

        
        <Route component={NotFound} />
      </Switch>
    </PageTransition>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Auto-hide loading after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LiveDataProvider>
          <>
            {/* Video background only on homepage hero section */}
            
            {/* Dynamic Creative Page Backgrounds */}
            <DynamicBackground />
            
            <Navbar />
            <div 
              className="bg-background text-foreground" 
              style={{ 
                margin: 0, 
                padding: 0, 
                width: '100%',
                paddingTop: '84px',
                position: 'static',
                height: 'auto',
                overflow: 'visible'
              }}
            >
              <div style={{ paddingTop: 0, marginTop: 0 }}>
                <Router />
              </div>
            </div>
            <Footer />
            {/* Removed InteractiveTutorialBot - has floating elements */}
            <NavigationTransition />
            <ThemeChangeEffect />
            <LayerResetQuiz />
            {/* Removed floating UI components: DynamicUIOptimizer, BreathingSpaceGenerator, FloatingAIAssistant */}
          </>
          <PlayfulLoading 
            isLoading={isLoading} 
            onComplete={() => setIsLoading(false)} 
          />
          <Toaster />
        </LiveDataProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
