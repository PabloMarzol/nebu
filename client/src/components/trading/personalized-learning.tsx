import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { BookOpen, Award, Target, Star, CheckCircle, Play, Trophy } from "lucide-react";

interface LearningModule {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  progress: number;
  completed: boolean;
  duration: string;
  points: number;
  category: string;
  prerequisites?: string[];
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  progress: number;
  requirement: number;
}

export default function PersonalizedLearning() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [userLevel, setUserLevel] = useState("beginner");
  const [totalPoints, setTotalPoints] = useState(750);

  const learningModules: LearningModule[] = [
    {
      id: "1",
      title: "Crypto Fundamentals",
      description: "Learn the basics of cryptocurrency and blockchain technology",
      difficulty: "beginner",
      progress: 100,
      completed: true,
      duration: "30 min",
      points: 100,
      category: "basics"
    },
    {
      id: "2",
      title: "Technical Analysis Basics",
      description: "Introduction to reading charts and identifying patterns",
      difficulty: "beginner",
      progress: 75,
      completed: false,
      duration: "45 min",
      points: 150,
      category: "analysis"
    },
    {
      id: "3",
      title: "DeFi Protocols",
      description: "Understanding decentralized finance and yield farming",
      difficulty: "intermediate",
      progress: 0,
      completed: false,
      duration: "60 min",
      points: 200,
      category: "defi",
      prerequisites: ["1"]
    },
    {
      id: "4",
      title: "Risk Management",
      description: "Portfolio management and risk assessment strategies",
      difficulty: "intermediate",
      progress: 30,
      completed: false,
      duration: "50 min",
      points: 180,
      category: "trading"
    },
    {
      id: "5",
      title: "Advanced Trading Strategies",
      description: "Complex trading techniques and market psychology",
      difficulty: "advanced",
      progress: 0,
      completed: false,
      duration: "90 min",
      points: 300,
      category: "trading",
      prerequisites: ["2", "4"]
    }
  ];

  const achievements: Achievement[] = [
    {
      id: "1",
      name: "First Steps",
      description: "Complete your first learning module",
      icon: "🎯",
      earned: true,
      progress: 1,
      requirement: 1
    },
    {
      id: "2",
      name: "Knowledge Seeker",
      description: "Complete 3 learning modules",
      icon: "📚",
      earned: false,
      progress: 1,
      requirement: 3
    },
    {
      id: "3",
      name: "Point Collector",
      description: "Earn 500 learning points",
      icon: "⭐",
      earned: true,
      progress: 750,
      requirement: 500
    },
    {
      id: "4",
      name: "Trading Master",
      description: "Complete all trading modules",
      icon: "🏆",
      earned: false,
      progress: 0,
      requirement: 2
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "text-green-400 border-green-400";
      case "intermediate": return "text-yellow-400 border-yellow-400";
      case "advanced": return "text-red-400 border-red-400";
      default: return "text-gray-400 border-gray-400";
    }
  };

  const filteredModules = learningModules.filter(module => {
    if (selectedCategory === "all") return true;
    return module.category === selectedCategory;
  });

  const completedModules = learningModules.filter(m => m.completed).length;
  const totalModules = learningModules.length;
  const overallProgress = (completedModules / totalModules) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="glass">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">{totalPoints}</div>
              <div className="text-sm text-muted-foreground">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">{completedModules}/{totalModules}</div>
              <div className="text-sm text-muted-foreground">Modules Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">{Math.round(overallProgress)}%</div>
              <div className="text-sm text-muted-foreground">Overall Progress</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{achievements.filter(a => a.earned).length}</div>
              <div className="text-sm text-muted-foreground">Achievements</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Path */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            <span>Personalized Learning Path</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Category Filters */}
          <div className="flex gap-2 mb-6">
            {["all", "basics", "analysis", "trading", "defi"].map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                size="sm"
                className="glass capitalize"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Learning Modules */}
          <div className="space-y-4">
            {filteredModules.map((module) => (
              <Card key={module.id} className="glass-strong border-purple-500/20 hover:border-purple-400/50 transition-all">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold">{module.title}</h3>
                        {module.completed && <CheckCircle className="w-4 h-4 text-green-400" />}
                        <Badge variant="outline" className={getDifficultyColor(module.difficulty)}>
                          {module.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{module.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>⏱️ {module.duration}</span>
                        <span>⭐ {module.points} points</span>
                        <span className="capitalize">📁 {module.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1 mr-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{module.progress}%</span>
                      </div>
                      <Progress value={module.progress} className="h-2" />
                    </div>
                    <Button 
                      size="sm" 
                      className={module.completed ? "bg-green-500" : "bg-purple-500"}
                      disabled={module.prerequisites && !module.prerequisites.every(prereq => 
                        learningModules.find(m => m.id === prereq)?.completed
                      )}
                    >
                      {module.completed ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Completed
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 mr-1" />
                          {module.progress > 0 ? "Continue" : "Start"}
                        </>
                      )}
                    </Button>
                  </div>

                  {module.prerequisites && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      Prerequisites: {module.prerequisites.map(prereq => 
                        learningModules.find(m => m.id === prereq)?.title
                      ).join(", ")}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievement Badges */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span>Achievement Badges</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className={`text-center p-4 ${achievement.earned ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-slate-800/30 border-slate-700'}`}>
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <h3 className="font-semibold mb-1">{achievement.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>
                {achievement.earned ? (
                  <Badge className="bg-yellow-500 text-black">Earned!</Badge>
                ) : (
                  <div className="space-y-1">
                    <Progress value={(achievement.progress / achievement.requirement) * 100} className="h-1" />
                    <div className="text-xs text-muted-foreground">
                      {achievement.progress}/{achievement.requirement}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gamified Learning Playground */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-cyan-400" />
            <span>Interactive Crypto Learning Playground</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="glass-strong p-4 text-center hover:border-purple-400/50 transition-all cursor-pointer">
              <div className="text-4xl mb-2">🎯</div>
              <h3 className="font-semibold mb-2">Trading Simulator</h3>
              <p className="text-sm text-muted-foreground mb-3">Practice trading with virtual money</p>
              <Button size="sm" className="w-full">Start Trading</Button>
            </Card>
            <Card className="glass-strong p-4 text-center hover:border-purple-400/50 transition-all cursor-pointer">
              <div className="text-4xl mb-2">🧩</div>
              <h3 className="font-semibold mb-2">Crypto Quizzes</h3>
              <p className="text-sm text-muted-foreground mb-3">Test your knowledge with fun quizzes</p>
              <Button size="sm" className="w-full">Take Quiz</Button>
            </Card>
            <Card className="glass-strong p-4 text-center hover:border-purple-400/50 transition-all cursor-pointer">
              <div className="text-4xl mb-2">📈</div>
              <h3 className="font-semibold mb-2">Chart Analysis</h3>
              <p className="text-sm text-muted-foreground mb-3">Learn to read charts interactively</p>
              <Button size="sm" className="w-full">Analyze Charts</Button>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}