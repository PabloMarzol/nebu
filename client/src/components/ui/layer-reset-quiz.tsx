import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, RefreshCw, CheckCircle, AlertTriangle } from "lucide-react";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const questions: QuizQuestion[] = [
  {
    id: "spacing",
    question: "What causes unwanted spacing above the navbar?",
    options: [
      "Default browser margins on html/body",
      "Tailwind CSS utility classes",
      "CSS framework conflicts",
      "All of the above"
    ],
    correct: 3,
    explanation: "Multiple factors can cause spacing: browser defaults, utility classes, and framework conflicts."
  },
  {
    id: "zindex",
    question: "What z-index value ensures navbar stays on top?",
    options: ["50", "100", "999", "999999"],
    correct: 3,
    explanation: "Higher z-index values (999999) ensure the navbar appears above all other elements."
  },
  {
    id: "position",
    question: "Which position property fixes navbar to viewport top?",
    options: ["relative", "absolute", "fixed", "sticky"],
    correct: 2,
    explanation: "Position fixed anchors the navbar to the viewport, keeping it visible during scroll."
  }
];

export default function LayerResetQuiz() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    if (answerIndex === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setCompleted(false);
  };

  const triggerLayerReset = () => {
    // Apply immediate CSS fixes
    const style = document.createElement('style');
    style.textContent = `
      html, body, #root { margin: 0 !important; padding: 0 !important; }
      nav { position: fixed !important; top: 0 !important; z-index: 999999 !important; }
      * { margin-top: 0 !important; }
    `;
    document.head.appendChild(style);
    
    // Show success notification
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed; top: 20px; right: 20px; z-index: 1000000;
      background: linear-gradient(45deg, #10b981, #059669);
      color: white; padding: 12px 24px; border-radius: 8px;
      font-weight: 500; box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    `;
    notification.textContent = 'Layer Reset Applied!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  // Listen for custom event from hero section
  useEffect(() => {
    const handleOpenLayerQuiz = () => setIsOpen(true);
    window.addEventListener('openLayerQuiz', handleOpenLayerQuiz);
    return () => window.removeEventListener('openLayerQuiz', handleOpenLayerQuiz);
  }, []);

  return (
    <>
      <div style={{ display: 'none' }}>
        <Button
          onClick={() => setIsOpen(true)}
          size="sm"
          variant="outline"
          className="fixed bottom-20 right-6 z-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 hover:scale-110 transition-transform"
        >
          <Zap className="w-4 h-4 mr-2" />
          Layer Quiz
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <Card className="glass-enhanced border-purple-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>One-Click Layer Reset Quiz</span>
                    <Badge variant="outline">
                      {completed ? `${score}/${questions.length}` : `${currentQuestion + 1}/${questions.length}`}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!completed ? (
                    <>
                      <div className="space-y-4">
                        <h3 className="font-medium text-lg">
                          {questions[currentQuestion].question}
                        </h3>
                        
                        <div className="space-y-2">
                          {questions[currentQuestion].options.map((option, index) => (
                            <Button
                              key={index}
                              variant={
                                selectedAnswer === index
                                  ? index === questions[currentQuestion].correct
                                    ? "default"
                                    : "destructive"
                                  : "outline"
                              }
                              className="w-full justify-start text-left h-auto p-3"
                              onClick={() => handleAnswer(index)}
                              disabled={showExplanation}
                            >
                              {option}
                            </Button>
                          ))}
                        </div>

                        <AnimatePresence>
                          {showExplanation && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="bg-muted p-4 rounded-lg"
                            >
                              <div className="flex items-start space-x-2">
                                {selectedAnswer === questions[currentQuestion].correct ? (
                                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                                ) : (
                                  <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                                )}
                                <p className="text-sm">{questions[currentQuestion].explanation}</p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {showExplanation && (
                        <Button onClick={nextQuestion} className="w-full">
                          {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Quiz"}
                        </Button>
                      )}
                    </>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="text-6xl">
                        {score === questions.length ? "🎉" : score >= questions.length / 2 ? "👍" : "📚"}
                      </div>
                      <h3 className="text-xl font-bold">
                        Quiz Complete!
                      </h3>
                      <p className="text-muted-foreground">
                        You scored {score} out of {questions.length}
                      </p>
                      
                      <div className="space-y-2">
                        <Button
                          onClick={triggerLayerReset}
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-600"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Apply Layer Reset
                        </Button>
                        <Button onClick={resetQuiz} variant="outline" className="w-full">
                          Retake Quiz
                        </Button>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={() => setIsOpen(false)}
                    variant="ghost"
                    className="w-full"
                  >
                    Close
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}