class ApiEndpoints {
  // Default base URL (Render Cloud backend)
  // For local development: 'http://10.0.2.2:8000/v1' or 'http://127.0.0.1:8000/v1'
  static String baseUrl = 'https://sqlens-final.onrender.com/v1';

  // Auth endpoints
  static String get login => '$baseUrl/auth/login';
  static String get register => '$baseUrl/auth/register';
  static String get profile => '$baseUrl/auth/profile';

  // Query Execution & History
  static String get queryExecutions => '$baseUrl/query-executions';
  static String get queryHistory => '$baseUrl/query-history';

  // AI Tutor
  static String get aiTutorAsk => '$baseUrl/ai-tutor/ask';

  // Educational Data & Materials
  static String get educationalDatasets => '$baseUrl/datasets/educational';
  static String get materials => '$baseUrl/materials';
  static String get iotReadings => '$baseUrl/iot/readings';
}
