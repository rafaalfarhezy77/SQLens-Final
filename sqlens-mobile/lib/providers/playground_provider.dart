import 'package:flutter/material.dart';
import '../core/constants/api_endpoints.dart';
import '../core/network/api_client.dart';
import '../core/network/api_exception.dart';
import '../data/models/query_execution_model.dart';

class PlaygroundProvider extends ChangeNotifier {
  final ApiClient _apiClient = ApiClient();
  final TextEditingController queryController = TextEditingController();

  bool _isExecuting = false;
  QueryExecutionModel? _executionResult;
  String? _errorMessage;
  int _activeTabIndex = 0; // 0: Editor, 1: Visualisasi, 2: Hasil
  int _selectedStepIndex = 0;

  bool get isExecuting => _isExecuting;
  QueryExecutionModel? get executionResult => _executionResult;
  String? get errorMessage => _errorMessage;
  int get activeTabIndex => _activeTabIndex;
  int get selectedStepIndex => _selectedStepIndex;

  PlaygroundProvider() {
    // Default starter query matching educational datasets
    queryController.text = 'SELECT s.name, sc.course, sc.score\nFROM students s\nJOIN scores sc ON s.id = sc.student_id\nWHERE sc.score >= 80;';
  }

  void setActiveTab(int index) {
    _activeTabIndex = index;
    notifyListeners();
  }

  void setSelectedStep(int index) {
    _selectedStepIndex = index;
    notifyListeners();
  }

  void insertKeyword(String keyword) {
    final text = queryController.text;
    final selection = queryController.selection;

    if (selection.isValid && selection.start >= 0 && selection.end >= 0) {
      final newText = text.replaceRange(selection.start, selection.end, '$keyword ');
      queryController.value = TextEditingValue(
        text: newText,
        selection: TextSelection.collapsed(offset: selection.start + keyword.length + 1),
      );
    } else {
      queryController.text = '$text $keyword ';
      queryController.selection = TextSelection.collapsed(offset: queryController.text.length);
    }
    notifyListeners();
  }

  void setQuery(String sql) {
    queryController.text = sql;
    notifyListeners();
  }

  Future<bool> executeCurrentQuery() async {
    final sql = queryController.text.trim();
    if (sql.isEmpty) {
      _errorMessage = 'Query SQL tidak boleh kosong.';
      notifyListeners();
      return false;
    }

    _isExecuting = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiClient.post(
        ApiEndpoints.queryExecutions,
        data: {'query': sql},
      );

      final data = response.data as Map<String, dynamic>;
      _executionResult = QueryExecutionModel.fromJson(data);
      _selectedStepIndex = 0;
      _isExecuting = false;

      // Automatically switch to Visualisasi tab after successful execution
      if (_executionResult!.steps.isNotEmpty) {
        _activeTabIndex = 1;
      } else {
        _activeTabIndex = 2;
      }

      notifyListeners();
      return true;
    } on ApiException catch (e) {
      _errorMessage = e.message;
      _isExecuting = false;
      notifyListeners();
      return false;
    } catch (e) {
      _errorMessage = 'Gagal mengeksekusi query: $e';
      _isExecuting = false;
      notifyListeners();
      return false;
    }
  }

  @override
  void dispose() {
    queryController.dispose();
    super.dispose();
  }
}
