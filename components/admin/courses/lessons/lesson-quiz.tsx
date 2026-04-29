import { Plus, Trash2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Quiz } from "@/hooks/use-lesson-detail"

interface Props {
    quizzes: Quiz[]
    onAddQuestion: () => void
    onDeleteQuestion: (quizId: string, questionId: string) => void
}

export function LessonQuiz({ quizzes, onAddQuestion, onDeleteQuestion }: Props) {
    const quiz = quizzes[0]
    const questions = quiz?.questions || []

    return (
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-foreground font-medium text-sm">Quiz</h3>
                <Button size="sm" variant="outline" onClick={onAddQuestion} className="gap-2 text-xs">
                    <Plus className="w-3.5 h-3.5" />
                    Savol qo'shish
                </Button>
            </div>

            {questions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">Savollar yo'q</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {questions.map((question, qi) => (
                        <div key={question.id} className="bg-secondary/50 rounded-xl p-4 space-y-3">
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-foreground text-sm font-medium">
                                    {qi + 1}. {question.text}
                                </p>
                                <Button
                                    size="icon" variant="ghost"
                                    className="text-destructive hover:bg-destructive/10 w-7 h-7 shrink-0"
                                    onClick={() => onDeleteQuestion(quiz.id, question.id)}
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                            <div className="space-y-1.5">
                                {question.options.map(opt => (
                                    <div key={opt.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${opt.isCorrect
                                        ? "bg-emerald-500/10 text-emerald-400"
                                        : "text-muted-foreground"
                                        }`}>
                                        {opt.isCorrect && <CheckCircle className="w-3.5 h-3.5 shrink-0" />}
                                        {opt.text}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}