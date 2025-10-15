import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { useLocation } from "wouter";
import SimpleAIChat from "@/components/trading/simple-ai-chat";

interface FloatingAIAssistantProps {
  isInline?: boolean;
}

export default function FloatingAIAssistant({ isInline = false }: FloatingAIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isPermanentlyDismissed, setIsPermanentlyDismissed] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    // On homepage, delay showing the AI assistant for 3 seconds
    if (location === '/' && !isInline) {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [location, isInline]);

  // Auto-dismiss AI assistant after 5 seconds when opened
  useEffect(() => {
    let dismissTimer: NodeJS.Timeout;
    
    if (isOpen && !isInline) {
      dismissTimer = setTimeout(() => {
        console.log("Auto-dismissing AI assistant after 5 seconds");
        setIsOpen(false);
      }, 5000);
    }
    
    return () => {
      if (dismissTimer) {
        clearTimeout(dismissTimer);
      }
    };
  }, [isOpen, isInline]);

  if (!isVisible || isPermanentlyDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsPermanentlyDismissed(true);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <div className={isInline ? "flex justify-center" : "fixed bottom-[180px] right-6 z-50"} data-ai-assistant>
        <Button
          onClick={() => setIsOpen(true)}
          size={isInline ? "default" : "lg"}
          className={isInline 
            ? "bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition-all duration-300"
            : "rounded-full w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300"
          }
        >
          <Bot className={isInline ? "h-4 w-4 mr-2" : "h-6 w-6 text-white"} />
          {isInline && "Open AI Assistant"}
        </Button>
      </div>
    );
  }

  return (
    <div className={isInline ? "relative" : "fixed bottom-6 right-6 z-[10000]"}>
      <SimpleAIChat
        isFloating={!isInline}
        onClose={handleDismiss}
      />
    </div>
  );
}