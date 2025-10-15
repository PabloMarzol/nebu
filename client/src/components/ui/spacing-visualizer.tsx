import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Ruler, Info } from "lucide-react";

interface SpacingInfo {
  element: HTMLElement;
  tagName: string;
  className: string;
  marginTop: string;
  paddingTop: string;
  top: number;
  height: number;
}

export default function SpacingVisualizer() {
  const [isActive, setIsActive] = useState(false);
  const [spacingData, setSpacingData] = useState<SpacingInfo[]>([]);
  const [hoveredElement, setHoveredElement] = useState<SpacingInfo | null>(null);

  const analyzeSpacing = () => {
    const elements = document.querySelectorAll('*') as NodeListOf<HTMLElement>;
    const topElements: SpacingInfo[] = [];

    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const computed = getComputedStyle(el);
      
      if (rect.top >= 0 && rect.top <= 200 && rect.height > 0) {
        topElements.push({
          element: el,
          tagName: el.tagName.toLowerCase(),
          className: el.className || 'no-class',
          marginTop: computed.marginTop,
          paddingTop: computed.paddingTop,
          top: rect.top,
          height: rect.height
        });
      }
    });

    setSpacingData(topElements.slice(0, 10)); // Limit to top 10 elements
  };

  const createOverlay = () => {
    // Remove existing overlay
    const existingOverlay = document.getElementById('spacing-overlay');
    if (existingOverlay) {
      existingOverlay.remove();
    }

    if (!isActive) return;

    const overlay = document.createElement('div');
    overlay.id = 'spacing-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 999998;
    `;

    spacingData.forEach((info, index) => {
      const indicator = document.createElement('div');
      indicator.style.cssText = `
        position: absolute;
        left: 10px;
        top: ${info.top}px;
        width: calc(100% - 20px);
        height: ${info.height}px;
        border: 2px solid ${index % 2 === 0 ? '#8b5cf6' : '#ec4899'};
        background: ${index % 2 === 0 ? 'rgba(139, 92, 246, 0.1)' : 'rgba(236, 72, 153, 0.1)'};
        pointer-events: none;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 4px 8px;
        font-size: 12px;
        color: white;
        font-family: monospace;
      `;

      const hasSpacing = parseFloat(info.marginTop) > 0 || parseFloat(info.paddingTop) > 0;
      
      indicator.innerHTML = `
        <span>${info.tagName}${info.className !== 'no-class' ? `.${info.className.split(' ')[0]}` : ''}</span>
        <span style="background: ${hasSpacing ? '#ef4444' : '#10b981'}; padding: 2px 6px; border-radius: 4px;">
          ${hasSpacing ? `⚠️ M:${info.marginTop} P:${info.paddingTop}` : '✅ No spacing'}
        </span>
      `;

      overlay.appendChild(indicator);
    });

    document.body.appendChild(overlay);
  };

  useEffect(() => {
    if (isActive) {
      analyzeSpacing();
      const interval = setInterval(analyzeSpacing, 1000);
      return () => clearInterval(interval);
    } else {
      const overlay = document.getElementById('spacing-overlay');
      if (overlay) overlay.remove();
    }
  }, [isActive]);

  useEffect(() => {
    createOverlay();
  }, [spacingData, isActive]);

  // Listen for custom event from hero section
  useEffect(() => {
    const handleOpenSpacingVisualizer = () => setIsActive(true);
    window.addEventListener('openSpacingVisualizer', handleOpenSpacingVisualizer);
    return () => window.removeEventListener('openSpacingVisualizer', handleOpenSpacingVisualizer);
  }, []);

  return (
    <>
      <div style={{ display: 'none' }}>
        <Button
          onClick={() => setIsActive(!isActive)}
          size="sm"
          variant="outline"
          className={`fixed bottom-32 right-6 z-50 transition-all ${
            isActive 
              ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white' 
              : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
          } border-0 hover:scale-110`}
        >
          {isActive ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
          {isActive ? 'Hide' : 'Visualize'}
        </Button>
      </div>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-20 right-4 w-80 z-50"
          >
            <Card className="glass-enhanced border-blue-500/30 max-h-96 overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-sm">
                  <Ruler className="w-4 h-4 mr-2" />
                  Contextual Spacing Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-64 overflow-y-auto space-y-2 px-4 pb-4">
                  {spacingData.map((info, index) => {
                    const hasSpacing = parseFloat(info.marginTop) > 0 || parseFloat(info.paddingTop) > 0;
                    
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-2 rounded border border-border/50 hover:bg-muted/50 cursor-pointer text-xs"
                        onMouseEnter={() => setHoveredElement(info)}
                        onMouseLeave={() => setHoveredElement(null)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-purple-400">
                            {info.tagName}
                            {info.className !== 'no-class' && (
                              <span className="text-pink-400">.{info.className.split(' ')[0]}</span>
                            )}
                          </span>
                          <Badge variant={hasSpacing ? "destructive" : "secondary"} className="text-xs">
                            {hasSpacing ? "Spacing!" : "Clean"}
                          </Badge>
                        </div>
                        
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>Top: {Math.round(info.top)}px | Height: {Math.round(info.height)}px</div>
                          {hasSpacing && (
                            <div className="text-red-400">
                              Margin: {info.marginTop} | Padding: {info.paddingTop}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                
                <div className="border-t border-border/50 p-3 bg-muted/20">
                  <div className="flex items-start space-x-2 text-xs text-muted-foreground">
                    <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span>
                      Elements with red badges have spacing that may cause layout issues. 
                      Purple/pink overlays show element boundaries in real-time.
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}