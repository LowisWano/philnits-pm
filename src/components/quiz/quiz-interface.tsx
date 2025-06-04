import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"
import questionData from "@/data/questions.json"

interface Question {
  question: string;
  image1?: string;
  image2?: string;
  options: string[];
  correctAnswer: number;
}

const questions: Question[] = questionData as Question[];

export default function QuizInterface() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: number }>({})
  const [timeLeft, setTimeLeft] = useState(100 * 60) // 100 minutes in seconds
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      // Auto-submit when time runs out
      handleSubmit()
    }
  }, [timeLeft])

  // Format time display
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerChange = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: Number.parseInt(value),
    }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = () => {
    // Calculate score
    let correct = 0
    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correct++
      }
    })

    const score = Math.round((correct / questions.length) * 100)
    alert(`Quiz completed! Your score: ${score}% (${correct}/${questions.length} correct)`)

    // Reset quiz
    setCurrentQuestion(0)
    setAnswers({})
    setTimeLeft(100 * 60)
    setShowSubmitConfirm(false)
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const answeredQuestions = Object.keys(answers).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="mx-auto max-w-4xl">
        {/* Header with Timer and Progress */}
        <div className="mb-6">
          <Card>
            <CardContent className="">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    Question {currentQuestion + 1} of {questions.length}
                  </Badge>
                  <Badge variant="secondary" className="text-sm">
                    {answeredQuestions} answered
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setShowSubmitConfirm(true)}
                      className="py-3 mx-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                      Submit
                    </Button>
                  <Clock className={`h-5 w-5 ${timeLeft < 600 ? "text-red-500" : "text-blue-600"}`} />
                  <span
                    className={`text-lg ${timeLeft < 600 ? "text-red-500" : "text-slate-700"}`}
                  >
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <Progress value={progress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Alert className="mb-6 p-6">
          <AlertDescription>
            <strong>Instructions:</strong> Select the best answer for each question. You can navigate between questions
            using the Back and Next buttons. Click &quot;Submit Early&quot; to finish before time runs out, or the quiz will
            auto-submit when time expires.
          </AlertDescription>
        </Alert>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl leading-relaxed">{questions[currentQuestion].question}</CardTitle>
          </CardHeader>
          <CardContent>
            {
              questions[currentQuestion].image1 && (
                <div className="relative w-full aspect-[4/3]">
                  <Image
                    src={questions[currentQuestion].image1}
                    alt="Question diagram"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              )
            }
            {
              questions[currentQuestion].image2 && (
                <div className="relative w-full aspect-[4/3]">
                  <Image
                    src={questions[currentQuestion].image2}
                    alt="Question diagram"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              )
            }
            <RadioGroup
              value={answers[currentQuestion]?.toString() || ""}
              onValueChange={handleAnswerChange}
              className="mt-6"
            >
              {questions[currentQuestion].options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 h-12 p-3 rounded-lg hover:bg-slate-50 transition-colors border-1"
                >
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-base leading-relaxed">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
              <Button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                variant="outline"
                className="w-full sm:w-auto py-3 px-8"
              >
                <ChevronLeft className="h-5 w-5 mr-2" />
                Previous
              </Button>

              <Button 
                onClick={handleNext}
                variant="outline"
                disabled={currentQuestion === questions.length - 1} 
                className="w-full sm:w-auto py-3 !gap-5"
              >
                Next
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>


        {/* Submit Confirmation */}
        {showSubmitConfirm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Submit Quiz?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Are you sure you want to submit your quiz? You have answered {answeredQuestions} out of{" "}
                  {questions.length} questions.
                </p>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowSubmitConfirm(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit}>Submit Quiz</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
