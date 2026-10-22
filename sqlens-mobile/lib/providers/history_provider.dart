import 'package:flutter/material.dart';
import '../core/constants/api_endpoints.dart';
import '../core/network/api_client.dart';
import '../core/network/api_exception.dart';
import '../data/models/query_history_model.dart';

class HistoryProvider extends ChangeNotifier {
  final ApiClient _apiClient = ApiClient();
  List<QueryHistoryItemModel> _items = [];
  bool _isLoading = false;
  String? _errorMessage;

  List<QueryHistoryItemModel> get items => _items;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  Future<void> fetchHistory() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiClient.get(ApiEndpoints.queryHistory);
      final data = response.data as Map<String, dynamic>;
      final rawItems = data['items'] as List? ?? [];
      _items = rawItems.map((item) => QueryHistoryItemModel.fromJson(Map<String, dynamic>.from(item as Map))).toList();
      _isLoading = false;
      notifyListeners();
    } on ApiException catch (e) {
      _errorMessage = e.message;
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _errorMessage = 'Gagal memuat riwayat kueri: $e';
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> deleteItem(String id) async {
    try {
      await _apiClient.delete('${ApiEndpoints.queryHistory}/$id');
      _items.removeWhere((item) => item.id == id);
      notifyListeners();
    } catch (_) {}
  }

  Future<void> clearAll() async {
    try {
      await _apiClient.delete(ApiEndpoints.queryHistory);
      _items.clear();
      notifyListeners();
    } catch (_) {}
  }
}
