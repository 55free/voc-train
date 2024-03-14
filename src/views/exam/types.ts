interface Exam {
  id: string;
  name: string;
  description: string;
  questions: Question[];
}

interface Question {
  id: number;
  text: string;
  type:
    | 'single-choice'
    | 'multiple-choice'
    | 'true-false'
    | 'short-answer'
    | 'fill-in-blank';
  options?: Option[]; // 对于简答题，这个字段可能不存在
  correctAnswer: string | string[]; // 对于多选题，正确答案可能有多个
}

interface Option {
  id: string;
  text: string;
}

interface UserAnswer {
  userId: string;
  examId: string;
  answers: {
    questionId: string;
    answer: string | string[]; // 对于多选题，用户的答案可能有多个
  }[];
}

export type { Exam, UserAnswer, Question, Option };
