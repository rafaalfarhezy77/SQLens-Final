class JoinDetailsModel {
  final String leftTable;
  final String rightTable;
  final String leftKey;
  final String rightKey;
  final String joinType;

  JoinDetailsModel({
    required this.leftTable,
    required this.rightTable,
    required this.leftKey,
    required this.rightKey,
    required this.joinType,
  });

  factory JoinDetailsModel.fromJson(Map<String, dynamic> json) {
    return JoinDetailsModel(
      leftTable: json['leftTable']?.toString() ?? '',
      rightTable: json['rightTable']?.toString() ?? '',
      leftKey: json['leftKey']?.toString() ?? '',
      rightKey: json['rightKey']?.toString() ?? '',
      joinType: json['joinType']?.toString() ?? '',
    );
  }
}

class QueryStepRowModel {
  final String id;
  final Map<String, dynamic> data;
  final String status; // 'keep', 'filtered', 'source', 'joined'
  final String statusText;
  final String reason;

  QueryStepRowModel({
    required this.id,
    required this.data,
    required this.status,
    required this.statusText,
    required this.reason,
  });

  factory QueryStepRowModel.fromJson(Map<String, dynamic> json) {
    return QueryStepRowModel(
      id: json['id']?.toString() ?? '',
      data: json['data'] is Map ? Map<String, dynamic>.from(json['data'] as Map) : {},
      status: json['status']?.toString() ?? 'keep',
      statusText: json['statusText']?.toString() ?? '',
      reason: json['reason']?.toString() ?? '',
    );
  }
}

class QueryStepModel {
  final int stepNumber;
  final String clause;
  final String title;
  final String badge;
  final String description;
  final String explanation;
  final int rowsBeforeCount;
  final int rowsAfterCount;
  final List<QueryStepRowModel> rowEvaluations;
  final JoinDetailsModel? joinDetails;

  QueryStepModel({
    required this.stepNumber,
    required this.clause,
    required this.title,
    required this.badge,
    required this.description,
    required this.explanation,
    required this.rowsBeforeCount,
    required this.rowsAfterCount,
    required this.rowEvaluations,
    this.joinDetails,
  });

  factory QueryStepModel.fromJson(Map<String, dynamic> json) {
    final rowsRaw = json['rowEvaluations'] as List? ?? [];
    return QueryStepModel(
      stepNumber: json['stepNumber'] is int ? json['stepNumber'] as int : int.tryParse(json['stepNumber'].toString()) ?? 1,
      clause: json['clause']?.toString() ?? '',
      title: json['title']?.toString() ?? '',
      badge: json['badge']?.toString() ?? '',
      description: json['description']?.toString() ?? '',
      explanation: json['explanation']?.toString() ?? '',
      rowsBeforeCount: json['rowsBeforeCount'] is int ? json['rowsBeforeCount'] as int : 0,
      rowsAfterCount: json['rowsAfterCount'] is int ? json['rowsAfterCount'] as int : 0,
      rowEvaluations: rowsRaw.map((r) => QueryStepRowModel.fromJson(Map<String, dynamic>.from(r as Map))).toList(),
      joinDetails: json['joinDetails'] != null ? JoinDetailsModel.fromJson(Map<String, dynamic>.from(json['joinDetails'] as Map)) : null,
    );
  }
}

class QueryExecutionModel {
  final String status;
  final String query;
  final double executionTimeMs;
  final List<String> columns;
  final List<Map<String, dynamic>> rows;
  final int totalRows;
  final List<QueryStepModel> steps;

  QueryExecutionModel({
    required this.status,
    required this.query,
    required this.executionTimeMs,
    required this.columns,
    required this.rows,
    required this.totalRows,
    required this.steps,
  });

  factory QueryExecutionModel.fromJson(Map<String, dynamic> json) {
    final colsRaw = json['columns'] as List? ?? [];
    final rowsRaw = json['rows'] as List? ?? [];
    final stepsRaw = json['steps'] as List? ?? [];

    return QueryExecutionModel(
      status: json['status']?.toString() ?? 'success',
      query: json['query']?.toString() ?? '',
      executionTimeMs: (json['executionTimeMs'] as num?)?.toDouble() ?? 0.0,
      columns: colsRaw.map((c) => c.toString()).toList(),
      rows: rowsRaw.map((r) => Map<String, dynamic>.from(r as Map)).toList(),
      totalRows: json['totalRows'] is int ? json['totalRows'] as int : rowsRaw.length,
      steps: stepsRaw.map((s) => QueryStepModel.fromJson(Map<String, dynamic>.from(s as Map))).toList(),
    );
  }
}
