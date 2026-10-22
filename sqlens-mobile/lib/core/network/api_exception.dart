class ApiException implements Exception {
  final int? statusCode;
  final String code;
  final String message;
  final Map<String, dynamic>? fieldErrors;

  ApiException({
    this.statusCode,
    required this.code,
    required this.message,
    this.fieldErrors,
  });

  @override
  String toString() => 'ApiException($statusCode, code: $code, message: $message)';
}
