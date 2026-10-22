import 'package:dio/dio.dart';
import '../constants/api_endpoints.dart';
import '../storage/token_storage.dart';
import 'api_exception.dart';

class ApiClient {
  late final Dio _dio;

  ApiClient() {
    _dio = Dio(
      BaseOptions(
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 20),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Client-Platform': 'flutter-mobile',
        },
      ),
    );

    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          // Check if custom base url is saved
          final customUrl = await TokenStorage.getCustomBaseUrl();
          final effectiveBaseUrl = (customUrl != null && customUrl.isNotEmpty)
              ? customUrl.replaceAll(RegExp(r'/+$'), '')
              : ApiEndpoints.baseUrl.replaceAll(RegExp(r'/+$'), '');

          ApiEndpoints.baseUrl = effectiveBaseUrl;
          options.baseUrl = effectiveBaseUrl;

          // If path starts with an absolute http/https URL, ensure host/port matches effectiveBaseUrl
          if (options.path.startsWith('http://') || options.path.startsWith('https://')) {
            final uri = Uri.parse(options.path);
            final baseUri = Uri.parse(effectiveBaseUrl);
            options.path = uri.replace(
              scheme: baseUri.scheme,
              host: baseUri.host,
              port: baseUri.hasPort ? baseUri.port : null,
            ).toString();
          }

          // Attach Bearer Token if available
          final token = await TokenStorage.getToken();
          if (token != null && token.isNotEmpty) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          return handler.next(options);
        },
        onError: (DioException e, handler) {
          final res = e.response;
          if (res != null && res.data is Map<String, dynamic>) {
            final data = res.data as Map<String, dynamic>;
            final errorObj = data['error'] is Map<String, dynamic> ? data['error'] : data;
            final code = errorObj['code']?.toString() ?? 'ERROR';
            final message = errorObj['message']?.toString() ?? 'Terjadi kesalahan pada server.';
            final fieldErrors = errorObj['fieldErrors'] as Map<String, dynamic>?;

            throw ApiException(
              statusCode: res.statusCode,
              code: code,
              message: message,
              fieldErrors: fieldErrors,
            );
          }

          if (e.type == DioExceptionType.connectionTimeout || e.type == DioExceptionType.receiveTimeout) {
            throw ApiException(
              statusCode: 408,
              code: 'TIMEOUT',
              message: 'Koneksi ke backend SQLens terputus atau melebihi batas waktu.',
            );
          }

          if (e.type == DioExceptionType.connectionError) {
            throw ApiException(
              statusCode: 503,
              code: 'CONNECTION_REFUSED',
              message: 'Tidak dapat terhubung ke server backend SQLens. Pastikan server aktif dan IP/Wi-Fi sesuai.',
            );
          }

          throw ApiException(
            statusCode: res?.statusCode,
            code: 'UNKNOWN_ERROR',
            message: e.message ?? 'Terjadi kesalahan jaringan.',
          );
        },
      ),
    );
  }

  Dio get client => _dio;

  Future<Response> get(String path, {Map<String, dynamic>? queryParameters}) {
    return _dio.get(path, queryParameters: queryParameters);
  }

  Future<Response> post(String path, {dynamic data}) {
    return _dio.post(path, data: data);
  }

  Future<Response> patch(String path, {dynamic data}) {
    return _dio.patch(path, data: data);
  }

  Future<Response> delete(String path) {
    return _dio.delete(path);
  }
}
