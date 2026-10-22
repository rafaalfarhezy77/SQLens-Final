class AiTutorResponseModel {
  final String explanation;
  final String hint;
  final String sqlConcept;
  final List<String> reasoning;

  AiTutorResponseModel({
    required this.explanation,
    required this.hint,
    required this.sqlConcept,
    required this.reasoning,
  });

  factory AiTutorResponseModel.fromJson(Map<String, dynamic> rawJson) {
    final json = (rawJson.containsKey('data') && rawJson['data'] is Map)
        ? rawJson['data'] as Map<String, dynamic>
        : rawJson;
    final rawReasoning = json['reasoning'] as List? ?? [];
    return AiTutorResponseModel(
      explanation: json['explanation']?.toString() ?? '',
      hint: json['hint']?.toString() ?? '',
      sqlConcept: json['sqlConcept']?.toString() ?? json['sql_concept']?.toString() ?? 'SQL Concept',
      reasoning: rawReasoning.map((r) => r.toString()).toList(),
    );
  }
}
