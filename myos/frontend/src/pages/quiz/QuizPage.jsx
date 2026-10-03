import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import { useQuiz } from "./hooks/useQuiz.js";
import { quizQuestions } from "./quizQuestions.js";
import {
  QuestionHeader,
  QuestionOptions,
  QuestionButtons,
} from "./components/QuizComponents.jsx";

function QuizPage() {
  const quiz = useQuiz(quizQuestions);

  return (
    <div className="backgroundForHomepage">
      <Navbar />

      <div className="container d-flex align-items-center justify-content-center min-vh-100">
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
      </div>
      <Footer />
    </div>
  );
}

export default QuizPage;
