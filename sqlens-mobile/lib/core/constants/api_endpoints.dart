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

  // Study Cases (Multi-case real world datasets)
  static String get studyCases => '$baseUrl/study-cases';
  static String studyCaseDetail(String caseId) => '$baseUrl/study-cases/$caseId';

  // Shared Datasets (Lecturer shared class datasets)
  static String get sharedDatasets => '$baseUrl/shared-datasets';
  static String sharedDatasetDetail(String id) => '$baseUrl/shared-datasets/$id';
  static String get lecturerSharedUploadCsv => '$baseUrl/lecturer/shared-datasets/upload-csv';
  static String get lecturerSharedUploadSql => '$baseUrl/lecturer/shared-datasets/upload-sql';
  static String lecturerSharedDelete(String id) => '$baseUrl/lecturer/shared-datasets/$id';

  // Custom User Dataset
  static String get customDataset => '$baseUrl/datasets/custom';
  static String get customDatasetUploadCsv => '$baseUrl/datasets/custom/upload-csv';
  static String get customDatasetUploadSql => '$baseUrl/datasets/custom/upload-sql';
  static String get customDatasetReset => '$baseUrl/datasets/custom/reset';

  // Educational Data & Materials
  static String get educationalDatasets => '$baseUrl/datasets/educational';
  static String get materials => '$baseUrl/materials';
  static String get iotReadings => '$baseUrl/iot/readings';
}
