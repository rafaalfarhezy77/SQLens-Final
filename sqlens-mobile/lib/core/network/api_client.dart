import 'package:dio/dio.dart';
import '../constants/api_endpoints.dart';
import '../storage/token_storage.dart';
import 'api_exception.dart';

class ApiClient {
  late final Dio _dio;

  ApiClient() {
    _dio = Dio(
      BaseOptions(
        connectTimeout: const Duration(seconds: 45),
        receiveTimeout: const Duration(seconds: 45),
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
          var effectiveBaseUrl = (customUrl != null && customUrl.isNotEmpty)
              ? customUrl.replaceAll(RegExp(r'/+$'), '')
              : ApiEndpoints.baseUrl.replaceAll(RegExp(r'/+$'), '');

          if (!effectiveBaseUrl.endsWith('/v1')) {
            effectiveBaseUrl = '$effectiveBaseUrl/v1';
          }

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
            final rawMessage = errorObj['message']?.toString() ?? 'Terjadi kesalahan pada server.';
            final fieldErrors = errorObj['fieldErrors'] as Map<String, dynamic>?;

            final cleanMessage = _sanitizeErrorMessage(
              rawMessage,
              statusCode: res.statusCode,
              code: code,
            );

            throw ApiException(
              statusCode: res.statusCode,
              code: code,
              message: cleanMessage,
              fieldErrors: fieldErrors,
            );
          }

          if (e.type == DioExceptionType.connectionTimeout || e.type == DioExceptionType.receiveTimeout) {
            throw ApiException(
              statusCode: 408,
              code: 'TIMEOUT',
              message: 'Waktu koneksi ke server habis. Server mungkin sedang dalam proses wake-up atau jaringan lambat. Silakan coba kembali.',
            );
          }

          if (e.type == DioExceptionType.connectionError) {
            throw ApiException(
              statusCode: 503,
              code: 'CONNECTION_REFUSED',
              message: 'Tidak dapat terhubung ke server SQLens. Periksa koneksi internet Anda atau pastikan server aktif.',
            );
          }

          if (res != null && res.statusCode != null) {
            throw ApiException(
              statusCode: res.statusCode,
              code: 'HTTP_ERROR_${res.statusCode}',
              message: _sanitizeErrorMessage(
                'Terjadi kesalahan pada server.',
                statusCode: res.statusCode,
              ),
            );
          }

          throw ApiException(
            statusCode: res?.statusCode,
            code: 'UNKNOWN_ERROR',
            message: 'Terjadi gangguan jaringan atau sistem saat menghubungi server. Silakan coba beberapa saat lagi.',
          );
        },
      ),
    );
  }

  static String _sanitizeErrorMessage(
    String rawMessage, {
    int? statusCode,
    String? code,
  }) {
    if (code == 'EMAIL_ALREADY_REGISTERED' ||
        statusCode == 409 ||
        rawMessage.toLowerCase().contains('email sudah terdaftar')) {
      return 'Email sudah terdaftar. Silakan login atau daftarkan akun lain.';
    }

    if (code == 'INVALID_CREDENTIALS' ||
        rawMessage.toLowerCase().contains('kata sandi') ||
        rawMessage.toLowerCase().contains('tidak cocok')) {
      return 'Password salah, silakan coba lagi';
    }

    if (statusCode != null && statusCode >= 500) {
      return 'Terjadi kendala internal pada server. Tim kami sedang menanganinya, silakan coba beberapa saat lagi.';
    }

    if (statusCode == 401) {
      return 'Sesi Anda telah kedaluwarsa atau belum valid. Silakan login kembali.';
    }

    if (statusCode == 403) {
      return 'Akses ditolak. Anda tidak memiliki izin untuk melakukan tindakan ini.';
    }

    if (statusCode == 404) {
      return 'Layanan atau data yang diminta tidak ditemukan di server.';
    }

    // Filter technical/sensitive terms to avoid disclosing implementation details or stack traces
    final lower = rawMessage.toLowerCase();
    const sensitiveTerms = [
      'traceback',
      'exception',
      'psycopg',
      'sqlalchemy',
      'pgcode',
      'syntax error at',
      'column "',
      'table "',
      'relation "',
      'password_hash',
      'hashed_password',
      'secret_key',
      'secret',
      'token',
      'hash',
      'socket',
      'errno',
      'os error',
      'file "',
      'line ',
      'nullpointer',
      'stacktrace',
      'database_url',
      'select ',
      'insert into',
      'update ',
      'delete from',
      'host lookup',
    ];

    for (final term in sensitiveTerms) {
      if (lower.contains(term)) {
        return 'Terjadi kendala saat memproses permintaan. Silakan coba beberapa saat lagi.';
      }
    }

    return rawMessage;
  }

  static ApiException transformDioError(DioException e) {
    if (e.error is ApiException) {
      return e.error as ApiException;
    }

    final res = e.response;
    if (res != null && res.data is Map<String, dynamic>) {
      final data = res.data as Map<String, dynamic>;
      final errorObj = data['error'] is Map<String, dynamic> ? data['error'] : data;
      final code = errorObj['code']?.toString() ?? 'ERROR';
      final rawMessage = errorObj['message']?.toString() ?? 'Terjadi kesalahan pada server.';
      final fieldErrors = errorObj['fieldErrors'] as Map<String, dynamic>?;

      return ApiException(
        statusCode: res.statusCode,
        code: code,
        message: _sanitizeErrorMessage(rawMessage, statusCode: res.statusCode, code: code),
        fieldErrors: fieldErrors,
      );
    }

    if (e.type == DioExceptionType.connectionTimeout || e.type == DioExceptionType.receiveTimeout) {
      return ApiException(
        statusCode: 408,
        code: 'TIMEOUT',
        message: 'Waktu koneksi ke server habis. Server mungkin sedang dalam proses wake-up atau jaringan lambat. Silakan coba kembali.',
      );
    }

    if (e.type == DioExceptionType.connectionError) {
      return ApiException(
        statusCode: 503,
        code: 'CONNECTION_REFUSED',
        message: 'Tidak dapat terhubung ke server SQLens. Periksa koneksi internet Anda atau pastikan server aktif.',
      );
    }

    if (res != null && res.statusCode != null) {
      return ApiException(
        statusCode: res.statusCode,
        code: 'HTTP_ERROR_${res.statusCode}',
        message: _sanitizeErrorMessage('Terjadi kesalahan pada server.', statusCode: res.statusCode),
      );
    }

    return ApiException(
      statusCode: res?.statusCode,
      code: 'UNKNOWN_ERROR',
      message: 'Terjadi gangguan jaringan atau sistem saat menghubungi server. Silakan coba beberapa saat lagi.',
    );
  }

  Dio get client => _dio;

  Future<Response<T>> _safeRequest<T>(Future<Response<T>> Function() request) async {
    try {
      return await request();
    } on DioException catch (e) {
      throw transformDioError(e);
    }
  }

  Future<Response> get(String path, {Map<String, dynamic>? queryParameters}) {
    return _safeRequest(() => _dio.get(path, queryParameters: queryParameters));
  }

  Future<Response> post(String path, {dynamic data}) {
    return _safeRequest(() => _dio.post(path, data: data));
  }

  Future<Response> patch(String path, {dynamic data}) {
    return _safeRequest(() => _dio.patch(path, data: data));
  }

  Future<Response> delete(String path) {
    return _safeRequest(() => _dio.delete(path));
  }
}
