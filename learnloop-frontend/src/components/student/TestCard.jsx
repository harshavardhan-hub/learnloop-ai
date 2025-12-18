import React from 'react';
import { Clock, BookOpen, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import { DIFFICULTY_COLORS } from '../../utils/constants';
import { formatDuration } from '../../utils/helpers';

const TestCard = ({ test }) => {
  const navigate = useNavigate();

  return (
    <Card hover onClick={() => navigate(`/test/${test._id}`)}>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{test.title}</h3>
            {test.description && (
              <p className="text-gray-600 text-sm mb-3">{test.description}</p>
            )}
          </div>
          <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${DIFFICULTY_COLORS[test.difficulty]}`}>
            {test.difficulty}
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(test.duration)}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{test.questions?.length || 0} Questions</span>
          </div>
          <div className="flex items-center gap-1">
            <Award className="w-4 h-4" />
            <span>{test.totalMarks} Marks</span>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">{test.domain}</span>
            <Button size="sm" onClick={(e) => {
              e.stopPropagation();
              navigate(`/test/${test._id}`);
            }}>
              Start Test
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TestCard;
