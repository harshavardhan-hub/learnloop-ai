export const calculateTestScore = (answers, questions) => {
  let score = 0;
  let correctCount = 0;
  let wrongCount = 0;

  const evaluatedAnswers = [];

  questions.forEach((question) => {
    const studentAnswer = answers[question._id.toString()];
    const isCorrect = studentAnswer === question.correctAnswer;

    if (isCorrect) {
      score += question.marks;
      correctCount++;
    } else {
      wrongCount++;
    }

    evaluatedAnswers.push({
      questionId: question._id,
      selectedAnswer: studentAnswer || 'Not Answered',
      correctAnswer: question.correctAnswer,
      isCorrect,
      marksObtained: isCorrect ? question.marks : 0
    });
  });

  return {
    score,
    correctCount,
    wrongCount,
    evaluatedAnswers,
    accuracy: ((correctCount / questions.length) * 100).toFixed(2)
  };
};

export const generateMistakeBreakdown = (answers, questions) => {
  const mistakes = [];
  const weakTopics = {};

  answers.forEach((answer) => {
    if (!answer.isCorrect) {
      const question = questions.find(q => q._id.toString() === answer.questionId.toString());
      
      if (question) {
        mistakes.push({
          questionId: question._id,
          questionText: question.questionText,
          studentAnswer: answer.selectedAnswer,
          correctAnswer: question.correctAnswer,
          explanation: question.explanation,
          topic: question.topic,
          concept: question.concept
        });

        const topic = question.topic || 'General';
        weakTopics[topic] = (weakTopics[topic] || 0) + 1;
      }
    }
  });

  return {
    mistakes,
    weakTopics: Object.entries(weakTopics).map(([topic, count]) => ({
      topic,
      errorCount: count
    }))
  };
};
