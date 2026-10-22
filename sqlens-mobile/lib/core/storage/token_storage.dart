import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class TokenStorage {
  static const _storage = FlutterSecureStorage();
  static const _keyToken = 'sqlens_jwt_token';
  static const _keyUserId = 'sqlens_user_id';
  static const _keyUserName = 'sqlens_user_name';
  static const _keyUserEmail = 'sqlens_user_email';
  static const _keyUserRole = 'sqlens_user_role';
  static const _keyBaseUrl = 'sqlens_custom_base_url';

  static Future<void> saveSession({
    required String token,
    required String userId,
    required String name,
    required String email,
    required String role,
  }) async {
    await _storage.write(key: _keyToken, value: token);
    await _storage.write(key: _keyUserId, value: userId);
    await _storage.write(key: _keyUserName, value: name);
    await _storage.write(key: _keyUserEmail, value: email);
    await _storage.write(key: _keyUserRole, value: role);
  }

  static Future<String?> getToken() async {
    return await _storage.read(key: _keyToken);
  }

  static Future<Map<String, String?>> getUserData() async {
    final token = await _storage.read(key: _keyToken);
    final id = await _storage.read(key: _keyUserId);
    final name = await _storage.read(key: _keyUserName);
    final email = await _storage.read(key: _keyUserEmail);
    final role = await _storage.read(key: _keyUserRole);

    return {
      'token': token,
      'id': id,
      'name': name,
      'email': email,
      'role': role,
    };
  }

  static Future<void> clearSession() async {
    await _storage.delete(key: _keyToken);
    await _storage.delete(key: _keyUserId);
    await _storage.delete(key: _keyUserName);
    await _storage.delete(key: _keyUserEmail);
    await _storage.delete(key: _keyUserRole);
  }

  static Future<void> saveCustomBaseUrl(String url) async {
    await _storage.write(key: _keyBaseUrl, value: url);
  }

  static Future<String?> getCustomBaseUrl() async {
    return await _storage.read(key: _keyBaseUrl);
  }
}
