class SampleQueryModel {
  final String title;
  final String query;
  final String explanation;

  SampleQueryModel({
    required this.title,
    required this.query,
    required this.explanation,
  });

  factory SampleQueryModel.fromJson(Map<String, dynamic> json) {
    return SampleQueryModel(
      title: json['title'] as String? ?? '',
      query: json['query'] as String? ?? '',
      explanation: json['explanation'] as String? ?? '',
    );
  }
}

class StudyCaseChallengeModel {
  final String id;
  final String title;
  final String description;
  final String difficulty;
  final String hint;
  final String starterQuery;

  StudyCaseChallengeModel({
    required this.id,
    required this.title,
    required this.description,
    required this.difficulty,
    required this.hint,
    required this.starterQuery,
  });

  factory StudyCaseChallengeModel.fromJson(Map<String, dynamic> json) {
    return StudyCaseChallengeModel(
      id: json['id'] as String? ?? '',
      title: json['title'] as String? ?? '',
      description: json['description'] as String? ?? '',
      difficulty: json['difficulty'] as String? ?? 'Dasar',
      hint: json['hint'] as String? ?? '',
      starterQuery: json['starterQuery'] as String? ?? '',
    );
  }
}

class StudyCaseTableModel {
  final String name;
  final String description;
  final List<String> columns;
  final List<Map<String, dynamic>> sampleRows;

  StudyCaseTableModel({
    required this.name,
    required this.description,
    required this.columns,
    required this.sampleRows,
  });

  factory StudyCaseTableModel.fromJson(Map<String, dynamic> json) {
    final rawCols = json['columns'] as List<dynamic>? ?? [];
    final rawRows = json['sampleRows'] as List<dynamic>? ?? [];

    return StudyCaseTableModel(
      name: json['name'] as String? ?? '',
      description: json['description'] as String? ?? '',
      columns: rawCols.map((c) => c.toString()).toList(),
      sampleRows: rawRows.map((r) => Map<String, dynamic>.from(r as Map)).toList(),
    );
  }
}

class StudyCaseSummaryModel {
  final String id;
  final String title;
  final String category;
  final String difficulty;
  final String description;
  final List<String> tableNames;
  final List<SampleQueryModel> sampleQueries;
  final int challengesCount;

  StudyCaseSummaryModel({
    required this.id,
    required this.title,
    required this.category,
    required this.difficulty,
    required this.description,
    required this.tableNames,
    required this.sampleQueries,
    required this.challengesCount,
  });

  factory StudyCaseSummaryModel.fromJson(Map<String, dynamic> json) {
    final rawTables = json['tableNames'] as List<dynamic>? ?? [];
    final rawQueries = json['sampleQueries'] as List<dynamic>? ?? [];

    return StudyCaseSummaryModel(
      id: json['id'] as String? ?? '',
      title: json['title'] as String? ?? '',
      category: json['category'] as String? ?? '',
      difficulty: json['difficulty'] as String? ?? 'Dasar',
      description: json['description'] as String? ?? '',
      tableNames: rawTables.map((t) => t.toString()).toList(),
      sampleQueries: rawQueries
          .map((q) => SampleQueryModel.fromJson(Map<String, dynamic>.from(q as Map)))
          .toList(),
      challengesCount: json['challengesCount'] as int? ?? 0,
    );
  }
}

class StudyCaseDetailModel {
  final String id;
  final String title;
  final String category;
  final String difficulty;
  final String description;
  final List<String> tableNames;
  final List<SampleQueryModel> sampleQueries;
  final int challengesCount;
  final List<StudyCaseTableModel> tables;
  final List<StudyCaseChallengeModel> challenges;

  StudyCaseDetailModel({
    required this.id,
    required this.title,
    required this.category,
    required this.difficulty,
    required this.description,
    required this.tableNames,
    required this.sampleQueries,
    required this.challengesCount,
    required this.tables,
    required this.challenges,
  });

  factory StudyCaseDetailModel.fromJson(Map<String, dynamic> json) {
    final rawTables = json['tableNames'] as List<dynamic>? ?? [];
    final rawQueries = json['sampleQueries'] as List<dynamic>? ?? [];
    final rawTableDetails = json['tables'] as List<dynamic>? ?? [];
    final rawChallenges = json['challenges'] as List<dynamic>? ?? [];

    return StudyCaseDetailModel(
      id: json['id'] as String? ?? '',
      title: json['title'] as String? ?? '',
      category: json['category'] as String? ?? '',
      difficulty: json['difficulty'] as String? ?? 'Dasar',
      description: json['description'] as String? ?? '',
      tableNames: rawTables.map((t) => t.toString()).toList(),
      sampleQueries: rawQueries
          .map((q) => SampleQueryModel.fromJson(Map<String, dynamic>.from(q as Map)))
          .toList(),
      challengesCount: json['challengesCount'] as int? ?? 0,
      tables: rawTableDetails
          .map((t) => StudyCaseTableModel.fromJson(Map<String, dynamic>.from(t as Map)))
          .toList(),
      challenges: rawChallenges
          .map((c) => StudyCaseChallengeModel.fromJson(Map<String, dynamic>.from(c as Map)))
          .toList(),
    );
  }
}
