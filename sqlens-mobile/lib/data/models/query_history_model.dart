class QueryHistoryItemModel {
  final String id;
  final String query;
  final String status;
  final String executedAt;
  final double? executionTimeMs;
  final int? rowCount;

  QueryHistoryItemModel({
    required this.id,
    required this.query,
    required this.status,
    required this.executedAt,
    this.executionTimeMs,
    this.rowCount,
  });

  factory QueryHistoryItemModel.fromJson(Map<String, dynamic> json) {
    return QueryHistoryItemModel(
      id: json['id']?.toString() ?? '',
      query: json['query']?.toString() ?? '',
      status: json['status']?.toString() ?? 'success',
      executedAt: json['executedAt']?.toString() ?? '',
      executionTimeMs: (json['executionTimeMs'] as num?)?.toDouble(),
      rowCount: json['rowCount'] as int?,
    );
  }
}
