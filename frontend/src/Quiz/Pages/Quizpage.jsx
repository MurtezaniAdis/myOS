import NAVBAR from "../../SharedComponents/NavbarComponent.jsx";
import { useQuiz } from "../HooksAndLogic/useQuiz.js";
import Footer from "../../SharedComponents/FooterComponent.jsx";
import {
  QuestionHeader,
  QuestionOptions,
  QuestionButtons,
} from "../Components/QuizComponents.jsx";

const questions = [
  {
    id: 1,
    genre: "popularity",
    question: "Do you prefer current and popular operating systems?",
    options: ["Absolutely", "Would be nice", "Not Important"],
  },
  {
    id: 2,
    genre: "price",
    question: "Does the operating system have to be free",
    options: ["Yes", "No"],
  },
  {
    id: 3,
    genre: "experience",
    question: "Which level of experience do you have?",
    options: ["Beginner", "Intermediate", "Advanced"],
  },
  {
    id: 4,
    genre: "gui",
    question: "Do you prefer a graphical user interface?",
    options: ["Yes", "No"],
  },
  {
    id: 5,
    genre: "hardware",
    question: "Which Hardware are you using?",
    options: ["Old", "Mid-Range", "High"],
  },
  {
    id: 6,
    genre: "use_case",
    question: "What do you want to use the operating system for?",
    options: ["Gaming", "Server", "Everyday Use", "Security", "Raspberry Py"],
  },
  {
    id: 7,
    genre: "weight",
    question: "Do you want the operating system to be light weight?",
    options: ["Yes", "No"],
  },
  {
    id: 8,
    genre: "livetest",
    question:
      "Should the operating system have the possibility to try it on a live medium (e.g. USB-Stick)?",
    options: ["Yes", "No"],
  },
  {
    id: 9,
    genre: "update_frequency",
    question: "How do you feel about system updates?",
    options: ["Rolling Release", "Stable Release", "A mix of both"],
  },
  {
    id: 10,
    genre: "design",
    question: "Which desktop layout do you prefer?",
    options: [
      "Classic (like Windows)",
      "Modern (like macOS/Gnome)",
      "Minimalist / I don't care",
    ],
  },
  {
    id: 11,
    genre: "philosophy",
    question:
      "Are you okay with using proprietary software (e.g. Nvidia drivers)?",
    options: ["Proprietary is fine", "Open Source only", "Only if necessary"],
  },
  {
    id: 12,
    genre: "system_base",
    question: "Do you have a preference for the underlying system base?",
    options: [
      "Debian / Ubuntu based",
      "Arch based",
      "Fedora based",
      "No preference",
    ],
  },
];

function Quizpage() {
  const quiz = useQuiz(questions);

  return (
    <div className="backgroundForHomepage">
      <NAVBAR />

      <div className="container d-flex align-items-center justify-content-center min-vh-100">
        <div className="w-100" style={{ maxWidth: "700px" }}>
          <QuestionHeader
            question={quiz.question}
            currentQuestion={quiz.currentQuestion}
            questions={questions}
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
            questions={questions}
            currentQuestion={quiz.currentQuestion}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
export default Quizpage;
