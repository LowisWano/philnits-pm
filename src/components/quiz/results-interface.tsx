
export default function ResultsInterface() {
  // Results Interface  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="mx-auto max-w-4xl">
        {/* Results Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Quiz Results</h1>
          <p className="text-slate-600 text-lg">Here's how you performed</p>
        </div>

        {/* Score Card */}
        <Card className="mb-8">
          <CardContent className="pt-8">
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
          <h3 className="text-2xl font-bold text-slate-900 text-center mb-6">Detailed Review</h3>

          {questions.map((question, index) => {
            const userAnswer = results.answers[index]
            const isCorrect = userAnswer === question.correctAnswer
            const wasAnswered = userAnswer !== undefined

            return (
              <Card key={question.id} className="overflow-hidden">
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
                                  className={isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
                                  className="text-xs"
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