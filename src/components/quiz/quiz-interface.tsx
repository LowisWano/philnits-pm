import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Clock, ChevronLeft, ChevronRight, CheckCircle, XCircle, RotateCcw, Plus } from "lucide-react"
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

interface QuizResults {
  score: number
  correctAnswers: number
  timeTaken: number
  answers: { [key: number]: number }
  passed: boolean
}

const questions: Question[] = questionData as Question[];

export default function QuizInterface() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: number }>({})
  const [timeLeft, setTimeLeft] = useState(100 * 60) // 100 minutes in seconds
  const [startTime, setStartTime] = useState<number>(Date.now())
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [results, setResults] = useState<QuizResults | null>(null)

  // Timer effect
  useEffect(() => {
    if (!quizCompleted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (!quizCompleted && timeLeft === 0) {
      // Auto-submit when time runs out
      handleSubmit()
    }
  }, [timeLeft, quizCompleted])

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

    const timeTaken = Math.floor((Date.now() - startTime) / 1000)
    const passed = correct >= 15 // Passing score is 15

    const quizResults: QuizResults = {
      score: correct,
      correctAnswers: correct,
      timeTaken,
      answers,
      passed,
    }

    setResults(quizResults)
    setQuizCompleted(true)
    setShowSubmitConfirm(false)
  }

  const handleRetakeQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setTimeLeft(100 * 60)
    setStartTime(Date.now())
    setQuizCompleted(false)
    setResults(null)
    setShowSubmitConfirm(false)
  }

  const handleNewQuiz = () => {
    // In a real app, this would load different questions
    handleRetakeQuiz()
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const answeredQuestions = Object.keys(answers).length

  // Results Interface
  if (quizCompleted && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="mx-auto max-w-4xl">
          {/* Results Header */}
          <div className="text-center mb-8 pt-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Quiz Results</h1>
            <p className="text-slate-600 text-lg">Here&apos;s how you performed</p>
          </div>

          {/* Score Card */}
          <Card className="mb-8">
            <CardContent className="p-5">
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  {results.passed ? (
                    <CheckCircle className="h-16 w-16 text-green-500" />
                  ) : (
                    <XCircle className="h-16 w-16 text-red-500" />
                  )}
                </div>

                <div>
                  <h2 className="text-6xl font-bold text-slate-900 mb-2">
                    {results.score}/{questions.length}
                  </h2>
                  <p className="text-xl text-slate-600">
                    {Math.round((results.score / questions.length) * 100)}% Score
                  </p>
                </div>

                <div className="flex justify-center items-center gap-8 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Time Taken: {formatTime(results.timeTaken)}</span>
                  </div>
                  <div>
                    <span>Passing Score: 15/20 (75%)</span>
                  </div>
                </div>

                <div className="py-4">
                  {results.passed ? (
                    <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
                      🎉 Congratulations! You Passed!
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="text-lg px-4 py-2">
                      You did not pass this time. Keep studying!
                    </Badge>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={handleRetakeQuiz} className="flex items-center gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Retake Quiz
                  </Button>
                  <Button variant="outline" onClick={handleNewQuiz} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    New Quiz
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Results */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-900 text-center mb-6">Review Answers</h3>

            {questions.map((question, index) => {
              const userAnswer = results.answers[index]
              const isCorrect = userAnswer === question.correctAnswer
              const wasAnswered = userAnswer !== undefined

              return (
                <Card key={question.image1} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-4">
                      <CardTitle className="text-lg leading-relaxed flex-1">
                        <span className="text-slate-500 font-normal">Q{index + 1}.</span> {question.question}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {isCorrect ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Correct
                          </Badge>
                        ) : wasAnswered ? (
                          <Badge variant="destructive">
                            <XCircle className="h-3 w-3 mr-1" />
                            Incorrect
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Not Answered</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {
                      question.image1 && (
                        <div className="relative w-full aspect-[4/3]">
                          <Image
                            src={question.image1}
                            alt="Question diagram"
                            fill
                            className="object-contain"
                            priority
                          />
                        </div>
                      )
                    }
                    {
                      question.image2 && (
                        <div className="relative w-full aspect-[4/3]">
                          <Image
                            src={question.image2}
                            alt="Question diagram"
                            fill
                            className="object-contain"
                            priority
                          />
                        </div>
                      )
                    }
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => {
                        const isUserAnswer = userAnswer === optionIndex
                        const isCorrectAnswer = question.correctAnswer === optionIndex

                        let className = "p-3 rounded-lg border transition-colors "

                        if (isCorrectAnswer) {
                          className += "bg-green-50 border-green-200 text-green-800"
                        } else if (isUserAnswer && !isCorrect) {
                          className += "bg-red-50 border-red-200 text-red-800"
                        } else {
                          className += "bg-slate-50 border-slate-200 text-slate-700"
                        }

                        return (
                          <div key={optionIndex} className={className}>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                {isCorrectAnswer && <CheckCircle className="h-4 w-4 text-green-600" />}
                                {isUserAnswer && !isCorrect && <XCircle className="h-4 w-4 text-red-600" />}
                              </div>
                              <span className="flex-1">{option}</span>
                              <div className="flex gap-2">
                                {isCorrectAnswer && (
                                  <Badge variant="outline" className="bg-green-100 text-green-700 text-xs">
                                    Correct Answer
                                  </Badge>
                                )}
                                {isUserAnswer && (
                                  <Badge
                                    variant="outline"
                                    className={isCorrect ? "bg-green-100 text-green-700 text-xs" : "bg-red-100 text-red-700 text-xs"}
                                  >
                                    Your Answer
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Footer */}
          <div className="text-center mt-12 pb-8">
            <p className="text-slate-500 text-sm">
              {results.passed
                ? "Great job! You're ready for the real certification exam."
                : "Don't give up! Review the questions above and try again."}
            </p>
          </div>
        </div>
      </div>
    )
  }

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
            using the &quot;Back&quot; and &quot;Next&quot; buttons. Click &quot;Submit&quot; to finish before time runs out, or the quiz will
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
              className="mt-6">
              {questions[currentQuestion].options.map((option, index) => (
                <Label
                  key={index}
                  htmlFor={`option-${index}`}
                  className="flex items-center space-x-3 h-12 p-3 rounded-lg hover:bg-slate-50 transition-colors border-1 cursor-pointer"
                >
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <span className="flex-1 text-base leading-relaxed">
                    {option}
                  </span>
                </Label>
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
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold" onClick={handleSubmit}>Submit Quiz</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
