import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { adminService } from '../../services/adminService';
import Card from '../common/Card';
import Button from '../common/Button';
import ErrorMessage from '../common/ErrorMessage';

const TestUpload = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const exampleJSON = {
    title: "JavaScript Fundamentals Test",
    description: "Test your knowledge of JavaScript basics",
    domain: "Frontend Developer",
    difficulty: "Medium",
    duration: 30,
    totalMarks: 10,
    passingMarks: 6,
    instructions: [
      "Read each question carefully",
      "All questions are mandatory",
      "No negative marking"
    ],
    questions: [
      {
        questionText: "What is the output of typeof null?",
        options: [
          { text: "null", isCorrect: false },
          { text: "object", isCorrect: true },
          { text: "undefined", isCorrect: false },
          { text: "number", isCorrect: false }
        ],
        correctAnswer: "object",
        explanation: "typeof null returns 'object' due to a historical bug in JavaScript",
        marks: 1,
        topic: "JavaScript Basics",
        concept: "Data Types",
        difficulty: "Easy"
      }
    ]
  };

  const handleUpload = async () => {
    setError('');
    setSuccess('');

    try {
      const testData = JSON.parse(jsonInput);
      setLoading(true);
      
      await adminService.uploadTest(testData);
      setSuccess('Test uploaded successfully!');
      setJsonInput('');
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError('Invalid JSON format. Please check your syntax.');
      } else {
        setError(err.message || 'Failed to upload test');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadExample = () => {
    setJsonInput(JSON.stringify(exampleJSON, null, 2));
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Upload Test (JSON)</h2>
            <Button variant="outline" size="sm" onClick={loadExample}>
              Load Example
            </Button>
          </div>

          {error && <ErrorMessage message={error} onClose={() => setError('')} />}
          
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-green-800 text-sm">{success}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test JSON
            </label>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Paste your test JSON here..."
              className="w-full h-96 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
            />
          </div>

          <Button 
            onClick={handleUpload}
            loading={loading}
            disabled={!jsonInput.trim()}
            className="w-full"
          >
            <Upload className="w-4 h-4" />
            Upload Test
          </Button>
        </div>
      </Card>

      {/* Format Guide */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">JSON Format Guide</h3>
        <div className="space-y-3 text-sm">
          <div>
            <span className="font-semibold text-gray-900">Required Fields:</span>
            <ul className="list-disc list-inside text-gray-600 mt-1 space-y-1">
              <li>title, domain, difficulty, duration, questions</li>
              <li>Each question needs: questionText, options, correctAnswer</li>
            </ul>
          </div>
          <div>
            <span className="font-semibold text-gray-900">Domain Options:</span>
            <p className="text-gray-600 mt-1">
              Frontend Developer, Backend Developer, Full Stack Developer, DevOps Engineer, Other
            </p>
          </div>
          <div>
            <span className="font-semibold text-gray-900">Difficulty Levels:</span>
            <p className="text-gray-600 mt-1">Easy, Medium, Hard</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TestUpload;
