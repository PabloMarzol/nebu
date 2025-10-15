import { Atom, Mail } from "lucide-react";
import { FaTwitter, FaTelegram, FaDiscord, FaLinkedin } from "react-icons/fa";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[hsl(var(--accent-purple))] to-[hsl(var(--accent-pink))] rounded-lg flex items-center justify-center">
                <Atom className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[hsl(var(--accent-purple))] to-[hsl(var(--accent-pink))] bg-clip-text text-transparent">
                Nebula X
              </span>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Professional cryptocurrency platform for traders worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="https://t.me/+byrMgAT0Psg5Y2U8" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[hsl(var(--accent-purple))] transition-colors">
                <FaTwitter />
              </a>
              <a href="https://t.me/+byrMgAT0Psg5Y2U8" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[hsl(var(--accent-purple))] transition-colors">
                <FaTelegram />
              </a>
              <a href="https://t.me/+byrMgAT0Psg5Y2U8" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[hsl(var(--accent-purple))] transition-colors">
                <FaDiscord />
              </a>
              <a href="mailto:support@nebulaxexchange.io" className="text-muted-foreground hover:text-[hsl(var(--accent-purple))] transition-colors">
                <Mail />
              </a>
            </div>
          </div>
          
          {/* Trading */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Trading</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/trading" className="hover:text-foreground transition-colors">Spot Trading</Link></li>
              <li><Link href="/markets" className="hover:text-foreground transition-colors">Markets</Link></li>
              <li><Link href="/trading" className="hover:text-foreground transition-colors">Order Types</Link></li>
              <li><Link href="/trading-fees" className="hover:text-foreground transition-colors">Trading Fees</Link></li>
              <li><Link href="/about" className="hover:text-foreground transition-colors">API Documentation</Link></li>
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/otc-desk" className="hover:text-foreground transition-colors">OTC Desk</Link></li>
              <li><Link href="/copy-trading" className="hover:text-foreground transition-colors">Copy Trading</Link></li>
              <li><Link href="/institutional" className="hover:text-foreground transition-colors">Institutional</Link></li>
              <li><Link href="/mobile" className="hover:text-foreground transition-colors">Mobile Apps</Link></li>
              <li><Link href="/staking" className="hover:text-foreground transition-colors">Staking</Link></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact Us</Link></li>
              <li><Link href="/system-status" className="hover:text-foreground transition-colors">System Status</Link></li>
              <li><a href="https://t.me/+byrMgAT0Psg5Y2U8" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Community</a></li>
              <li><Link href="/security" className="hover:text-foreground transition-colors">Security</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Legal Footer */}
        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-muted-foreground text-sm mb-4 md:mb-0">
              <p>© 2024 Golden Michael s.r.o. | Company ID: 19536143 | VASP License: CZ-2024-001</p>
              <p>Registered in Czech Republic | Supervised by FAÚ (Financial Administration Office)</p>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
              <Link href="/aml-policy" className="text-muted-foreground hover:text-foreground transition-colors">AML Policy</Link>
              <Link href="/risk-disclosure" className="text-muted-foreground hover:text-foreground transition-colors">Risk Disclosure</Link>
              <Link href="/compliance" className="text-muted-foreground hover:text-foreground transition-colors">Compliance</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
