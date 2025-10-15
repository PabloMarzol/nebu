=== account-settings.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\components\account\account-settings.tsx
Line 45:   loginAlerts: boolean;
Line 91:     loginAlerts: true,
Line 370:                     <Label>Login Alerts</Label>
Line 376:                     checked={security.loginAlerts}
Line 377:                     onCheckedChange={(checked) => setSecurity({...security, loginAlerts: checked})}

=== UserRoleManagement.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\components\admin\UserRoleManagement.tsx
Line 43:   lastLogin: Date;
Line 159:     lastLogin: new Date("2025-01-12T10:30:00"),
Line 170:     lastLogin: new Date("2025-01-12T15:45:00"),
Line 181:     lastLogin: new Date("2025-01-11T14:20:00"),
Line 192:     lastLogin: new Date("2025-01-12T09:15:00"),
Line 351:                       <TableHead className="text-gray-300">Last Login</TableHead>
Line 385:                             {user.lastLogin.toLocaleDateString()}

=== LiquidityManagement.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\components\advanced\LiquidityManagement.tsx
Line 340:                 <span>Registered Market Makers</span>

=== marketing-dashboard.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\components\analytics\marketing-dashboard.tsx
Line 35:     signupsToday: 423
Line 45:         signupsToday: prev.signupsToday + Math.floor(Math.random() * 5)
Line 167:       name: '30-Second Signup',
Line 205:     { stage: 'Signup Started', value: 48000, conversion: 15.9 },
Line 273:                   <p className="text-sm text-gray-400">Signups Today</p>
Line 274:                   <p className="text-2xl font-bold text-yellow-400">{realTimeMetrics.signupsToday}</p>

=== micro-animations.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\components\animations\micro-animations.tsx
Line 156:       title: '30-Second Signup',
Line 157:       description: 'Fastest crypto exchange signup in the world',

=== auth-error-handler.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\components\auth\auth-error-handler.tsx
Line 162:             <Link href="/auth/login">
Line 164:                 Login
Line 167:             <Link href="/auth/register">
Line 169:                 Sign Up

=== auth-status.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\components\auth\auth-status.tsx
Line 43:               <Link href="/auth/login">
Line 44:                 <Button size="sm" variant="outline">Login</Button>
Line 46:               <Link href="/auth/register">
Line 47:                 <Button size="sm">Register</Button>

=== SMSMessaging.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\components\communication\SMSMessaging.tsx
Line 44:       condition: 'login_alert',
Line 213:                     {alert.type === 'security' && 'Security and login notifications'}

=== ClientCRMInterface.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\components\crm\ClientCRMInterface.tsx
Line 234:               Sign In

=== CRMMainDashboard.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\components\crm\CRMMainDashboard.tsx
Line 187:                         <p className="text-gray-400 text-sm">Register a new customer account</p>
Line 267:                       <p className="text-white text-sm">New customer registered: Tech Corp Ltd</p>

=== RoleBasedCRMWorkspaces.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\components\crm\RoleBasedCRMWorkspaces.tsx
Line 276:               Sign In

=== learning-achievements.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\components\features\learning-achievements.tsx
Line 68:     description: 'Login for 7 consecutive days',

=== achievement-stickers.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\components\gamification\achievement-stickers.tsx
Line 187:       requirements: ['100 day login streak'],

=== crypto-glossary.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\components\launchpad\crypto-glossary.tsx
Line 79:       examples: ["Wallet access", "Transaction signing", "Fund recovery"],

=== footer.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\components\layout\footer.tsx
Line 80:               <p>Registered in Czech Republic | Supervised by FAÃš (Financial Administration Office)</p>

=== navbar-auth.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\components\layout\navbar-auth.tsx
Line 44:         <Link href="/auth/login">
Line 45:           <Button variant="ghost">Sign In</Button>
Line 47:         <Link href="/auth/register">

=== navbar-simple.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\components\layout\navbar-simple.tsx
Line 161:               /* Unauthenticated - Show Sign In/Up */
Line 163:                 <Link href="/auth/login">
Line 165:                     Sign In
Line 168:                 <Link href="/auth/register">
Line 170:                     Sign Up
Line 271:                         <Link href="/auth/login">
Line 273:                             Sign In
Line 276:                         <Link href="/auth/register">
Line 278:                             Sign Up

=== acquisition-campaigns.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\components\marketing\acquisition-campaigns.tsx
Line 94:       solution: '30-second signup, no KYC barriers',
Line 221:                       <span>Signups Started</span>
Line 225:                       <span>Completed Signups</span>

=== email-campaigns.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\components\marketing\email-campaigns.tsx
Line 94:           <li>30-second signup (vs 15+ minutes elsewhere)</li>
Line 101:       timing: 'Immediately after signup'
Line 123:       timing: 'Day 3 after signup'
Line 148:       timing: 'Day 5 after signup'
Line 189:       trigger: 'User Signup',

=== push-notification-system.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\components\mobile\push-notification-system.tsx
Line 745:                           message: 'New login detected from unknown device',

=== pwa-service-worker.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\components\mobile\pwa-service-worker.tsx
Line 121:     // Register service worker
Line 122:     registerServiceWorker();
Line 131:   const registerServiceWorker = async () => {
Line 188:         const registration = await navigator.serviceWorker.register(swUrl);

=== sms-settings.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\components\notifications\sms-settings.tsx
Line 300:                 <p className="text-sm text-gray-400">Login attempts and account changes</p>
Line 316:                 <p className="text-sm text-gray-400">SMS codes for secure login</p>

=== achievement-system.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\components\onboarding\achievement-system.tsx
Line 202:     requirements: ["Register within first month of launch"]

=== onboarding-analytics.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\components\onboarding\onboarding-analytics.tsx
Line 22:   dailySignups: number;
Line 41:     dailySignups: 247,
Line 56:         dailySignups: prev.dailySignups + Math.floor(Math.random() * 3),
Line 116:               <div className="text-2xl font-bold text-cyan-400">{metrics.dailySignups}</div>
Line 119:             <p className="text-sm text-muted-foreground">Daily Signups</p>

=== streamlined-signup.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\components\onboarding\streamlined-signup.tsx
Line 16: export default function StreamlinedSignup() {
Line 22:   const signupSteps = [
Line 72:           {/* Signup Form */}
Line 75:               <CardTitle className="text-2xl text-center">Quick Signup</CardTitle>

=== sms-settings.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\components\sms\sms-settings.tsx
Line 314:                   <p className="text-sm text-muted-foreground">Login attempts, password changes</p>

=== success-stories.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\components\social-proof\success-stories.tsx
Line 45:       quote: "NebulaX's 30-second signup got me trading instantly. The AI recommendations helped me turn $5,000 into $19,200 in just 6 months. The mobile app is incredible!",
Line 46:       story: "I was intimidated by crypto trading until I found NebulaX. The streamlined signup meant I was trading Bitcoin within 30 seconds of discovering the platform. What really impressed me was the AI trading assistant - it guided me through my first trades and helped me avoid common mistakes. The educational content was perfectly paced for a beginner like me.",       
Line 148:       quote: "Fastest signup I've ever experienced",

=== SupportTicketForm.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\components\support\SupportTicketForm.tsx
Line 172:                 You will receive an email confirmation at your registered email address.

=== personalized-welcome.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\components\trading\personalized-welcome.tsx
Line 133:               onClick={() => window.location.href = '/auth/register'}
Line 135:               Sign Up for Free Demo

=== portfolio-overview.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\components\trading\portfolio-overview.tsx
Line 48:           <p className="text-muted-foreground mb-4">Sign in to view your portfolio</p>
Line 49:           <Button onClick={() => window.location.href = "/api/login"}>
Line 50:             Sign In

=== security-health-dashboard.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\components\trading\security-health-dashboard.tsx
Line 41:   type: "phishing" | "malware" | "breach" | "suspicious_login" | "api_abuse";
Line 125:       type: "suspicious_login",
Line 127:       title: "Unusual Login Location",
Line 128:       description: "Login detected from Prague, Czech Republic - different from your usual location",

=== social-trading-network.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\components\trading\social-trading-network.tsx
Line 78:   type: "signup" | "first_trade" | "volume_milestone" | "friend_achievement";
Line 225:       type: "signup",
Line 226:       description: "Friend signup bonus",
Line 706:                       {reward.type === "signup" && <UserPlus className="w-5 h-5 text-blue-400" />}

=== trading-chart.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\components\trading\trading-chart.tsx
Line 21: // Register Chart.js components
Line 22: ChartJS.register(

=== accessibility-voice-description.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\components\ui\accessibility-voice-description.tsx
Line 48:     navbar: "Navigation bar with Nebula Xchange logo, platform dropdown menu with trading services, portfolio management, and institutional options. Authentication buttons for sign in and sign up on the right.",

=== dynamic-trading-achievements.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\components\ui\dynamic-trading-achievements.tsx
Line 113:       description: 'Login for 7 consecutive days',

=== forgot-password.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\pages\auth\forgot-password.tsx
Line 97:                 <Link href="/auth/login">
Line 100:                     Back to Login
Line 156:             <Link href="/auth/login" className="text-sm text-blue-600 hover:underline flex items-center justify-center gap-2">
Line 158:               Back to Login
Line 165:               <Link href="/auth/register" className="text-blue-600 hover:underline font-medium">
Line 166:                 Sign up

=== reset-password.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\pages\auth\reset-password.tsx
Line 76:         description: "Your password has been updated. You can now sign in with your new password.",
Line 110:                   You can now sign in to your account with your new password.
Line 113:               <Link href="/auth/login">
Line 115:                   Continue to Login
Line 214:             <Link href="/auth/login" className="text-sm text-blue-600 hover:underline">
Line 215:               Back to Login

=== verify-email.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\pages\auth\verify-email.tsx
Line 128:                   onClick={() => navigate("/auth/login")}
Line 132:                   Back to Login

=== about.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\pages\about.tsx
Line 396:                 <p className="text-muted-foreground text-sm mb-2">Registered in Czech Republic</p>
Line 677:                   <h3 className="text-xl font-semibold mb-4">Registered Address</h3>

=== admin-panel.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\pages\admin-panel.tsx
Line 92:     signups24h: 156,
Line 128:                   <p className="text-sm text-gray-400">24h Signups</p>
Line 129:                   <p className="text-2xl font-bold text-white">{stats.signups24h}</p>
Line 306:                           <p className="text-gray-400 text-sm">Multiple failed login attempts detected</p>

=== admin-support-crm.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\pages\admin-support-crm.tsx
Line 524:                           <span className="text-gray-400">Last Login:</span>

=== advanced-portfolio.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\pages\advanced-portfolio.tsx
Line 18:         window.location.href = "/api/login";

=== advanced-trading.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\pages\advanced-trading.tsx
Line 18:         window.location.href = "/api/login";

=== AdvancedFeatures.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\pages\AdvancedFeatures.tsx
Line 88:     setTimeout(() => showSecurityAlert('New login detected from Chrome on MacOS'), 2500);

=== alt5pro-integration.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\pages\alt5pro-integration.tsx
Line 57:   const [signupLoading, setSignupLoading] = useState(false);
Line 62:   const [signupForm, setSignupForm] = useState({
Line 80:   const handleSignup = async () => {
Line 81:     setSignupLoading(true);
Line 83:       const response = await apiRequest('POST', '/api/alt5pro/client/signup', signupForm);
Line 92:         setSignupForm({
Line 101:           title: "Signup Failed",
Line 107:       console.error('Signup error:', error);
Line 110:         description: "An error occurred during signup",
Line 114:       setSignupLoading(false);
Line 289:                         value={signupForm.email}
Line 290:                         onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
Line 300:                         value={signupForm.password}
Line 301:                         onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
Line 310:                         value={signupForm.firstName}
Line 311:                         onChange={(e) => setSignupForm({...signupForm, firstName: e.target.value})}
Line 322:                         value={signupForm.lastName}
Line 323:                         onChange={(e) => setSignupForm({...signupForm, lastName: e.target.value})}
Line 332:                         value={signupForm.phoneNumber}
Line 333:                         onChange={(e) => setSignupForm({...signupForm, phoneNumber: e.target.value})}
Line 339:                       onClick={handleSignup}
Line 340:                       disabled={signupLoading || !signupForm.email || !signupForm.password}
Line 343:                       {signupLoading ? "Creating Account..." : "Create Trading Account"}

=== ApiKeys.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\pages\ApiKeys.tsx
Line 2: import { Plus, Eye, EyeOff, Copy, Trash2, Key, LogIn } from 'lucide-react';
Line 217:   // Show login requirement for unauthenticated users
Line 226:                   <LogIn className="w-8 h-8 text-blue-600 dark:text-blue-400" />
Line 229:                   Login Required
Line 236:                     onClick={() => window.location.href = '/auth/login'}
Line 240:                     <LogIn className="w-5 h-5 mr-2" />
Line 246:                       href="/auth/register"
Line 249:                       Sign up here

=== business-management.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\pages\business-management.tsx
Line 211:                 <p className="text-xs text-gray-400">Active registered users</p>

=== comprehensive-admin.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\pages\comprehensive-admin.tsx
Line 56:     signups24h: 156,
Line 129:                   <p className="text-sm text-gray-400">24h Signups</p>
Line 130:                   <p className="text-2xl font-bold text-white">{stats.signups24h}</p>
Line 386:                       <span className="text-gray-400">Signup â†’ Email/Phone</span>

=== demo.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\pages\demo.tsx
Line 476:                   onClick={() => window.location.href = '/auth/register'}

=== home-backup.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\pages\home-backup.tsx
Line 1990:                   <p className="text-muted-foreground text-sm">Registered in Czech Republic</p>

=== home.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\pages\home.tsx
Line 1988:                   <p className="text-muted-foreground text-sm">Registered in Czech Republic</p>

=== learning-pass.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\pages\learning-pass.tsx
Line 112:       id: "daily_login",
Line 113:       title: "Daily Login",
Line 163:         description: "Please sign up or log in to access learning content and track your progress.",
Line 169:         window.location.href = "/auth/register";

=== marketing-landing.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\pages\marketing-landing.tsx
Line 26:       feature: 'Signup Time',
Line 276:     { label: 'User Signup Rate', value: '94%', description: 'Complete registration within 60 seconds' },
Line 291:               30-Second Signup

=== mobile-trading.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\pages\mobile-trading.tsx
Line 37:       'Biometric login',

=== otc-desk.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\pages\otc-desk.tsx
Line 60:       window.location.href = "/api/login";
Line 316:                         "Sign in to view your OTC deals"

=== p2p-trading.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\pages\p2p-trading.tsx
Line 57:       window.location.href = "/api/login";
Line 287:                       {isAuthenticated ? "You have no active P2P orders" : "Sign in to view your orders"}

=== privacy-policy.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\pages\privacy-policy.tsx
Line 134:                 <li>Email notifications to registered users</li>

=== SecuritySettings.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\pages\SecuritySettings.tsx
Line 57:   // Redirect to login if not authenticated
Line 66:         setLocation('/auth/login');
Line 99:               onClick={() => setLocation('/auth/login')}
Line 102:               Go to Login
Line 387:               Update your account password and manage login credentials.

=== staking.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\pages\staking.tsx
Line 109:         title: "Login Required",
Line 359:                 <h3 className="text-lg font-semibold mb-2">Sign In Required</h3>
Line 361:                 <Button className="mt-4" onClick={() => window.location.href = "/auth/login"}>
Line 362:                   Sign In

=== terms-of-service.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\pages\terms-of-service.tsx
Line 73:                 <li>Maintain the security of your login credentials</li>

=== auto-dismiss-manager.ts ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\utils\auto-dismiss-manager.ts
Line 18:    * Register a popup/widget for auto-dismiss
Line 20:   register(id: string, dismissCallback: () => void, delay: number = 5000): void {
Line 74:     autoDismissManager.register(id, onDismiss, delay);

=== App.tsx ===
Path: E:\Work_R\Work_Projects\NebulaX\NebulaX\client\src\App.tsx
Line 76: import StreamlinedSignup from "@/components/onboarding/streamlined-signup";
Line 253:         {/* <Route path="/auth/login" component={Login} /> */}
Line 254:         {/* <Route path="/auth/register" component={Register} /> */}
Line 271:         <Route path="/signup" component={StreamlinedSignup} />