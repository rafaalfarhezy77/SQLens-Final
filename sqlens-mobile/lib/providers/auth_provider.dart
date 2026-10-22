import 'package:flutter/material.dart';
import '../core/constants/api_endpoints.dart';
import '../core/network/api_client.dart';
import '../core/network/api_exception.dart';
import '../core/storage/token_storage.dart';
import '../data/models/user_model.dart';

class AuthProvider extends ChangeNotifier {
  final ApiClient _apiClient = ApiClient();
  UserModel? _user;
  bool _isLoading = false;
  String? _errorMessage;

  UserModel? get user => _user;
  bool get isAuthenticated => _user != null;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  AuthProvider() {
    initSession();
  }

  Future<void> initSession() async {
    _isLoading = true;
    notifyListeners();

    try {
      final customUrl = await TokenStorage.getCustomBaseUrl();
      if (customUrl != null && customUrl.isNotEmpty) {
        ApiEndpoints.baseUrl = customUrl;
      }

      final sessionData = await TokenStorage.getUserData();
      final token = sessionData['token'];
      if (token != null && token.isNotEmpty) {
        _user = UserModel(
          id: sessionData['id'] ?? '',
          name: sessionData['name'] ?? '',
          email: sessionData['email'] ?? '',
          role: sessionData['role'] ?? 'mahasiswa',
          accessToken: token,
        );
      }
    } catch (_) {
      // Ignored on startup
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiClient.post(
        ApiEndpoints.login,
        data: {'email': email.trim(), 'password': password},
      );

      final data = response.data as Map<String, dynamic>;
      final user = UserModel.fromJson(data);

      if (user.accessToken != null) {
        await TokenStorage.saveSession(
          token: user.accessToken!,
          userId: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        );
      }

      _user = user;
      _isLoading = false;
      notifyListeners();
      return true;
    } on ApiException catch (e) {
      _errorMessage = e.message;
      _isLoading = false;
      notifyListeners();
      return false;
    } catch (e) {
      _errorMessage = 'Terjadi kesalahan tidak terduga: $e';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> register({
    required String name,
    required String email,
    required String password,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiClient.post(
        ApiEndpoints.register,
        data: {
          'name': name.trim(),
          'email': email.trim(),
          'password': password,
          'role': 'mahasiswa',
        },
      );

      final data = response.data as Map<String, dynamic>;
      final user = UserModel.fromJson(data);

      if (user.accessToken != null) {
        await TokenStorage.saveSession(
          token: user.accessToken!,
          userId: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        );
      }

      _user = user;
      _isLoading = false;
      notifyListeners();
      return true;
    } on ApiException catch (e) {
      _errorMessage = e.message;
      _isLoading = false;
      notifyListeners();
      return false;
    } catch (e) {
      _errorMessage = 'Terjadi kesalahan tidak terduga: $e';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> logout() async {
    await TokenStorage.clearSession();
    _user = null;
    notifyListeners();
  }

  Future<void> setCustomBaseUrl(String url) async {
    final cleanUrl = url.trim().replaceAll(RegExp(r'/+$'), '');
    ApiEndpoints.baseUrl = cleanUrl;
    await TokenStorage.saveCustomBaseUrl(cleanUrl);
    notifyListeners();
  }
}
