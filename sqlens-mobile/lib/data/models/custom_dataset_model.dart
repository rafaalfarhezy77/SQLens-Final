class DatasetTableModel {
  final String name;
  final List<String> columns;
  final List<Map<String, dynamic>> rows;
  final String? relationship;

  DatasetTableModel({
    required this.name,
    required this.columns,
    required this.rows,
    this.relationship,
  });

  factory DatasetTableModel.fromJson(Map<String, dynamic> json) {
    final rawCols = json['columns'] as List<dynamic>? ?? [];
    final rawRows = json['rows'] as List<dynamic>? ?? [];

    return DatasetTableModel(
      name: json['name'] as String? ?? '',
      columns: rawCols.map((c) => c.toString()).toList(),
      rows: rawRows.map((r) => Map<String, dynamic>.from(r as Map)).toList(),
      relationship: json['relationship'] as String?,
    );
  }
}

class CustomDatasetInfoModel {
  final bool hasCustomDataset;
  final List<DatasetTableModel> tables;

  CustomDatasetInfoModel({
    required this.hasCustomDataset,
    required this.tables,
  });

  factory CustomDatasetInfoModel.fromJson(Map<String, dynamic> json) {
    final rawTables = json['tables'] as List<dynamic>? ?? [];
    return CustomDatasetInfoModel(
      hasCustomDataset: json['has_custom_dataset'] as bool? ?? false,
      tables: rawTables
          .map((t) => DatasetTableModel.fromJson(Map<String, dynamic>.from(t as Map)))
          .toList(),
    );
  }
}

class SharedDatasetModel {
  final String id;
  final String title;
  final String description;
  final String schemaName;
  final List<String> tableNames;
  final String createdByName;
  final String createdAt;

  SharedDatasetModel({
    required this.id,
    required this.title,
    required this.description,
    required this.schemaName,
    required this.tableNames,
    required this.createdByName,
    required this.createdAt,
  });

  factory SharedDatasetModel.fromJson(Map<String, dynamic> json) {
    final rawTables = json['tableNames'] as List<dynamic>? ?? [];
    return SharedDatasetModel(
      id: json['id'] as String? ?? '',
      title: json['title'] as String? ?? '',
      description: json['description'] as String? ?? '',
      schemaName: json['schemaName'] as String? ?? '',
      tableNames: rawTables.map((t) => t.toString()).toList(),
      createdByName: json['createdByName'] as String? ?? 'Dosen',
      createdAt: json['createdAt'] as String? ?? '',
    );
  }
}

class SharedDatasetDetailModel {
  final String id;
  final String title;
  final String description;
  final String schemaName;
  final List<String> tableNames;
  final List<DatasetTableModel> tables;
  final String createdByName;
  final String createdAt;

  SharedDatasetDetailModel({
    required this.id,
    required this.title,
    required this.description,
    required this.schemaName,
    required this.tableNames,
    required this.tables,
    required this.createdByName,
    required this.createdAt,
  });

  factory SharedDatasetDetailModel.fromJson(Map<String, dynamic> json) {
    final rawTables = json['tableNames'] as List<dynamic>? ?? [];
    final rawTableDetails = json['tables'] as List<dynamic>? ?? [];

    return SharedDatasetDetailModel(
      id: json['id'] as String? ?? '',
      title: json['title'] as String? ?? '',
      description: json['description'] as String? ?? '',
      schemaName: json['schemaName'] as String? ?? '',
      tableNames: rawTables.map((t) => t.toString()).toList(),
      tables: rawTableDetails
          .map((t) => DatasetTableModel.fromJson(Map<String, dynamic>.from(t as Map)))
          .toList(),
      createdByName: json['createdByName'] as String? ?? 'Dosen',
      createdAt: json['createdAt'] as String? ?? '',
    );
  }
}
