"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, FileText, CheckCircle } from "lucide-react"
import Link from "next/link"
import QuizInterface from "@/components/quiz/quiz-interface"

export default function Home() {
  const [showQuiz, setShowQuiz] = useState(false)

  const startQuizHandler = () => {
    setShowQuiz(true)
  }

  if (showQuiz) {
    return <QuizInterface />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">PhilNITS FE Certification PM Mock Exam</h1>
          <p className="text-slate-600 text-lg">Test your knowledge and prepare for the PhilNITS Certification Exam</p>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Description Card */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  About This Exam
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-700 leading-relaxed">
                  This comprehensive mock exam is designed to simulate the afternoon (PM) section of the PhilNITS exam. You are given 100 minutes and 20 questions (all multiple choice) to cover Technology, Strategy and Management.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  This quiz contains randomly selected questions from a range of topics covered in previous years&apos; exams.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                  <p className="text-blue-800 font-medium">
                    💡 Tip: Take your time to read each question carefully and consider all options before selecting
                    your answer.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Exam Details Card */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Exam Details</CardTitle>
                <CardDescription className="text-center">Everything you need to know</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Time Limit */}
                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-orange-600" />
                    <span className="font-medium text-slate-700">Time Limit</span>
                  </div>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    100 minutes
                  </Badge>
                </div>

                {/* Number of Questions */}
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-slate-700">Questions</span>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    20 questions
                  </Badge>
                </div>

                {/* Additional Info */}
                <div className="space-y-2 text-sm text-slate-600">
                  <p>• Multiple choice format</p>
                  <p>• Questions include images</p>
                  <p>• See results immediately</p>
                  <p>• Review answers</p>
                </div>

                {/* Start Button */}
                <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3" onClick={startQuizHandler}>
                  Start Quiz
                </Button>

                <p className="text-xs text-slate-500 text-center">Make sure you have a stable internet connection</p>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <p className="text-2xl font-bold text-slate-900">5 min</p>
                  <p className="text-sm text-slate-600">Average per question</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pb-8">
          <p className="text-slate-500 text-sm">Inspired by <Link className="underline" href="https://philnits.dcism.org/">Philnits FE AM Mock Exam</Link> for AM questions</p>
          <p className="text-slate-500 text-sm">Good luck with your exam! If you notice any errors, please message <Link className="underline" href="#">Luis Andrei Ouano</Link></p>
        </div>
      </div>
    </div>
  )
}
