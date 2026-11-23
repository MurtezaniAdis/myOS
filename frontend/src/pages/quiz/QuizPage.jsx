import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import { useQuiz } from "../../features/quiz/hooks/useQuiz.js";
import { quizQuestions } from "./quizQuestions.js";
import {
  QuestionHeader,
  QuestionOptions,
  QuestionButtons,
} from "../../features/quiz/components/QuizComponents.jsx";

function QuizPage() {
  const quiz = useQuiz(quizQuestions);

  return (
    <div className="backgroundForHomepage">
      <Navbar />

      <main className="container d-flex flex-grow-1 align-items-center justify-content-center py-5">
        <div className="w-100" style={{ maxWidth: "700px" }}>
          <QuestionHeader
            question={quiz.question}
            currentQuestion={quiz.currentQuestion}
            questions={quizQuestions}
          />

          <QuestionOptions
            question={quiz.question}
            answers={quiz.answers}
            onToggleOption={quiz.toggleOption}
          />

          <QuestionButtons
            hasAnswer={quiz.hasAnswer}
            isLastQuestion={quiz.isLastQuestion}
            onNext={quiz.nextQuestion}
            onBack={quiz.prevQuestion}
            onFinish={quiz.handleSubmit}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default QuizPage;
