import 'package:flutter/material.dart';
import '../core/constants/api_endpoints.dart';
import '../core/network/api_client.dart';
import '../core/network/api_exception.dart';
import '../data/models/custom_dataset_model.dart';
import '../data/models/query_execution_model.dart';
import '../data/models/study_case_model.dart';

class PlaygroundProvider extends ChangeNotifier {
  final ApiClient _apiClient = ApiClient();
  final TextEditingController queryController = TextEditingController();

  bool _isExecuting = false;
  bool _isLoadingData = false;
  QueryExecutionModel? _executionResult;
  String? _errorMessage;
  int _activeTabIndex = 0; // 0: Editor, 1: Visualisasi, 2: Hasil
  int _selectedStepIndex = 0;

  // Study Cases & Datasets state
  List<StudyCaseSummaryModel> _studyCases = [];
  StudyCaseDetailModel? _activeCaseDetail;
  String _activeCaseId = 'academic';

  List<SharedDatasetModel> _sharedDatasets = [];
  SharedDatasetDetailModel? _activeSharedDetail;
  String? _activeSharedId;

  CustomDatasetInfoModel? _customDatasetInfo;
  bool _isCustomMode = false;

  bool get isExecuting => _isExecuting;
  bool get isLoadingData => _isLoadingData;
  QueryExecutionModel? get executionResult => _executionResult;
  String? get errorMessage => _errorMessage;
  int get activeTabIndex => _activeTabIndex;
  int get selectedStepIndex => _selectedStepIndex;

  List<StudyCaseSummaryModel> get studyCases => _studyCases;
  StudyCaseDetailModel? get activeCaseDetail => _activeCaseDetail;
  String get activeCaseId => _activeCaseId;

  List<SharedDatasetModel> get sharedDatasets => _sharedDatasets;
  SharedDatasetDetailModel? get activeSharedDetail => _activeSharedDetail;
  String? get activeSharedId => _activeSharedId;

  CustomDatasetInfoModel? get customDatasetInfo => _customDatasetInfo;
  bool get isCustomMode => _isCustomMode;

  String get currentActiveTitle {
    if (_activeSharedId != null && _activeSharedDetail != null) {
      return _activeSharedDetail!.title;
    }
    if (_isCustomMode) {
      return 'Dataset Kustom Pribadi';
    }
    return _activeCaseDetail?.title ?? 'Sistem Akademik Kampus';
  }

  PlaygroundProvider() {
    queryController.text =
        'SELECT s.name, sc.course, sc.score\nFROM students s\nJOIN scores sc ON s.id = sc.student_id\nWHERE sc.score >= 80;';
    initWorkspaceData();
  }

  Future<void> initWorkspaceData() async {
    _isLoadingData = true;
    notifyListeners();

    try {
      // 1. Fetch study cases
      final scRes = await _apiClient.get(ApiEndpoints.studyCases);
      if (scRes.data is Map && scRes.data['items'] is List) {
        final list = scRes.data['items'] as List;
        _studyCases = list
            .map((item) =>
                StudyCaseSummaryModel.fromJson(Map<String, dynamic>.from(item as Map)))
            .toList();
      }

      // 2. Fetch default study case detail (academic)
      final detailRes =
          await _apiClient.get(ApiEndpoints.studyCaseDetail(_activeCaseId));
      if (detailRes.data is Map) {
        _activeCaseDetail = StudyCaseDetailModel.fromJson(
            Map<String, dynamic>.from(detailRes.data as Map));
      }

      // 3. Fetch shared datasets (from lecturers)
      final sdRes = await _apiClient.get(ApiEndpoints.sharedDatasets);
      if (sdRes.data is Map && sdRes.data['items'] is List) {
        final list = sdRes.data['items'] as List;
        _sharedDatasets = list
            .map((item) =>
                SharedDatasetModel.fromJson(Map<String, dynamic>.from(item as Map)))
            .toList();
      }

      // 4. Fetch custom dataset info
      final cdRes = await _apiClient.get(ApiEndpoints.customDataset);
      if (cdRes.data is Map) {
        _customDatasetInfo = CustomDatasetInfoModel.fromJson(
            Map<String, dynamic>.from(cdRes.data as Map));
      }
    } catch (_) {
      // Fallback silently if offline or token expired
    } finally {
      _isLoadingData = false;
      notifyListeners();
    }
  }

  Future<void> selectStudyCase(String caseId) async {
    _isLoadingData = true;
    _activeCaseId = caseId;
    _activeSharedId = null;
    _activeSharedDetail = null;
    _isCustomMode = false;
    notifyListeners();

    try {
      final res =
          await _apiClient.get(ApiEndpoints.studyCaseDetail(caseId));
      if (res.data is Map) {
        _activeCaseDetail = StudyCaseDetailModel.fromJson(
            Map<String, dynamic>.from(res.data as Map));
        if (_activeCaseDetail!.sampleQueries.isNotEmpty) {
          queryController.text = _activeCaseDetail!.sampleQueries.first.query;
        }
      }
    } catch (e) {
      _errorMessage = 'Gagal memuat detail studi kasus $caseId.';
    } finally {
      _isLoadingData = false;
      notifyListeners();
    }
  }

  Future<void> selectSharedDataset(String sharedId) async {
    _isLoadingData = true;
    _activeSharedId = sharedId;
    _isCustomMode = false;
    notifyListeners();

    try {
      final res =
          await _apiClient.get(ApiEndpoints.sharedDatasetDetail(sharedId));
      if (res.data is Map) {
        _activeSharedDetail = SharedDatasetDetailModel.fromJson(
            Map<String, dynamic>.from(res.data as Map));
        if (_activeSharedDetail!.tables.isNotEmpty) {
          final firstTable = _activeSharedDetail!.tables.first.name;
          queryController.text = 'SELECT * FROM $firstTable LIMIT 10;';
        }
      }
    } catch (e) {
      _errorMessage = 'Gagal memuat dataset bersama dosen.';
    } finally {
      _isLoadingData = false;
      notifyListeners();
    }
  }

  void selectCustomMode() {
    _isCustomMode = true;
    _activeSharedId = null;
    _activeSharedDetail = null;
    if (_customDatasetInfo != null && _customDatasetInfo!.tables.isNotEmpty) {
      final firstTable = _customDatasetInfo!.tables.first.name;
      queryController.text = 'SELECT * FROM $firstTable LIMIT 10;';
    }
    notifyListeners();
  }

  Future<bool> uploadCustomCsv(List<Map<String, String>> files) async {
    _isLoadingData = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final res = await _apiClient.post(
        ApiEndpoints.customDatasetUploadCsv,
        data: {
          'files': files
              .map((f) => {
                    'filename': f['filename'] ?? 'data.csv',
                    'content': f['content'] ?? '',
                  })
              .toList(),
        },
      );

      final data = res.data as Map<String, dynamic>;
      final rawTables = data['tables'] as List<dynamic>? ?? [];
      _customDatasetInfo = CustomDatasetInfoModel(
        hasCustomDataset: true,
        tables: rawTables
            .map((t) => DatasetTableModel.fromJson(Map<String, dynamic>.from(t as Map)))
            .toList(),
      );
      selectCustomMode();
      return true;
    } on ApiException catch (e) {
      _errorMessage = e.message;
      return false;
    } catch (_) {
      _errorMessage = 'Gagal mengunggah file CSV ke database kustom.';
      return false;
    } finally {
      _isLoadingData = false;
      notifyListeners();
    }
  }

  Future<bool> uploadCustomSql(String sql) async {
    _isLoadingData = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final res = await _apiClient.post(
        ApiEndpoints.customDatasetUploadSql,
        data: {'sql': sql},
      );

      final data = res.data as Map<String, dynamic>;
      final rawTables = data['tables'] as List<dynamic>? ?? [];
      _customDatasetInfo = CustomDatasetInfoModel(
        hasCustomDataset: true,
        tables: rawTables
            .map((t) => DatasetTableModel.fromJson(Map<String, dynamic>.from(t as Map)))
            .toList(),
      );
      selectCustomMode();
      return true;
    } on ApiException catch (e) {
      _errorMessage = e.message;
      return false;
    } catch (_) {
      _errorMessage = 'Gagal mengeksekusi skrip SQL database kustom.';
      return false;
    } finally {
      _isLoadingData = false;
      notifyListeners();
    }
  }

  Future<bool> resetCustomDataset() async {
    _isLoadingData = true;
    notifyListeners();

    try {
      await _apiClient.post(ApiEndpoints.customDatasetReset);
      _customDatasetInfo = CustomDatasetInfoModel(hasCustomDataset: false, tables: []);
      await selectStudyCase('academic');
      return true;
    } catch (_) {
      _errorMessage = 'Gagal mereset database kustom.';
      return false;
    } finally {
      _isLoadingData = false;
      notifyListeners();
    }
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

  void clearError() {
    _errorMessage = null;
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
      final payload = <String, dynamic>{'query': sql};
      if (_activeSharedId != null) {
        payload['sharedDatasetId'] = _activeSharedId;
      }

      final response = await _apiClient.post(
        ApiEndpoints.queryExecutions,
        data: payload,
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
    } catch (_) {
      _errorMessage =
          'Gagal memproses eksekusi query. Pastikan sintaks SQL benar atau coba beberapa saat lagi.';
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
