export const calculateStudentAnalytics = (attempts) => {
  if (!attempts || attempts.length === 0) {
    return {
      totalAttempts: 0,
      averageScore: 0,
      averageAccuracy: 0,
      improvementRate: 0,
      weakAreas: []
    };
  }

  const totalAttempts = attempts.length;
  const totalScore = attempts.reduce((sum, att) => sum + att.score, 0);
  const totalAccuracy = attempts.reduce((sum, att) => sum + parseFloat(att.accuracy), 0);

  const averageScore = (totalScore / totalAttempts).toFixed(2);
  const averageAccuracy = (totalAccuracy / totalAttempts).toFixed(2);

  // Calculate improvement rate
  const firstAttempt = attempts[attempts.length - 1];
  const lastAttempt = attempts[0];
  const improvementRate = ((lastAttempt.accuracy - firstAttempt.accuracy) / firstAttempt.accuracy * 100).toFixed(2);

  return {
    totalAttempts,
    averageScore: parseFloat(averageScore),
    averageAccuracy: parseFloat(averageAccuracy),
    improvementRate: parseFloat(improvementRate)
  };
};

export const identifyWeakAreas = (attempts, questions) => {
  const topicErrors = {};

  attempts.forEach(attempt => {
    attempt.answers.forEach((answer, idx) => {
      if (!answer.isCorrect) {
        const question = questions[idx];
        if (question && question.topic) {
          topicErrors[question.topic] = (topicErrors[question.topic] || 0) + 1;
        }
      }
    });
  });

  return Object.entries(topicErrors)
    .map(([topic, count]) => ({ topic, errorCount: count }))
    .sort((a, b) => b.errorCount - a.errorCount)
    .slice(0, 5);
};
