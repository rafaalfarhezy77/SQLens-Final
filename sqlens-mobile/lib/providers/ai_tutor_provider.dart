import 'dart:convert';
import 'package:flutter/material.dart';
import '../core/constants/api_endpoints.dart';
import '../core/network/api_client.dart';
import '../core/network/api_exception.dart';
import '../core/storage/token_storage.dart';
import '../data/models/ai_tutor_model.dart';

class AiChatMessage {
  final String question;
  final String? attachedQuery;
  final AiTutorResponseModel? response;
  final bool isUser;
  final bool isError;
  final String? errorMessage;
  final DateTime timestamp;

  AiChatMessage({
    required this.question,
    this.attachedQuery,
    this.response,
    required this.isUser,
    this.isError = false,
    this.errorMessage,
    required this.timestamp,
  });

  Map<String, dynamic> toJson() => {
    'question': question,
    'attachedQuery': attachedQuery,
    'response': response?.toJson(),
    'isUser': isUser,
    'isError': isError,
    'errorMessage': errorMessage,
    'timestamp': timestamp.toIso8601String(),
  };

  factory AiChatMessage.fromJson(Map<String, dynamic> json) {
    return AiChatMessage(
      question: json['question']?.toString() ?? '',
      attachedQuery: json['attachedQuery']?.toString(),
      response: json['response'] != null
          ? AiTutorResponseModel.fromJson(Map<String, dynamic>.from(json['response'] as Map))
          : null,
      isUser: json['isUser'] == true,
      isError: json['isError'] == true,
      errorMessage: json['errorMessage']?.toString(),
      timestamp: DateTime.tryParse(json['timestamp']?.toString() ?? '') ?? DateTime.now(),
    );
  }
}

class AiTutorSession {
  final String id;
  final String title;
  final DateTime timestamp;
  final List<AiChatMessage> messages;

  AiTutorSession({
    required this.id,
    required this.title,
    required this.timestamp,
    required this.messages,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'timestamp': timestamp.toIso8601String(),
    'messages': messages.map((m) => m.toJson()).toList(),
  };

  factory AiTutorSession.fromJson(Map<String, dynamic> json) {
    final rawList = json['messages'] as List? ?? [];
    return AiTutorSession(
      id: json['id']?.toString() ?? DateTime.now().millisecondsSinceEpoch.toString(),
      title: json['title']?.toString() ?? 'Percakapan AI Tutor',
      timestamp: DateTime.tryParse(json['timestamp']?.toString() ?? '') ?? DateTime.now(),
      messages: rawList
          .map((m) => AiChatMessage.fromJson(Map<String, dynamic>.from(m as Map)))
          .toList(),
    );
  }
}

class AiTutorProvider extends ChangeNotifier {
  final ApiClient _apiClient = ApiClient();
  final List<AiChatMessage> _messages = [];
  final List<AiTutorSession> _historySessions = [];
  bool _isLoading = false;
  String? _errorMessage;

  List<AiChatMessage> get messages => _messages;
  List<AiTutorSession> get historySessions => _historySessions;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  AiTutorProvider() {
    _initDefaultMessage();
    loadHistorySessions();
  }

  void _initDefaultMessage() {
    _messages.clear();
    _messages.add(
      AiChatMessage(
        question: 'Halo! Saya SQLens Tutor. Tanyakan konsep SQL, analisis filter klausa WHERE, atau cara kerja JOIN tanpa spoiler jawaban langsung.',
        isUser: false,
        timestamp: DateTime.now(),
        response: AiTutorResponseModel(
          explanation: 'SQLens Tutor membantu Anda memahami bagaimana DBMS memproses data langkah demi langkah.',
          hint: 'Gunakan pertanyaan seperti "Mengapa baris ini dieliminasi?" atau "Bagaimana cara kerja INNER JOIN?".',
          sqlConcept: 'Socratic Query Tutor',
          reasoning: ['Membimbing penalaran alur data tanpa merusak tantangan belajar.'],
        ),
      ),
    );
  }

  Future<void> loadHistorySessions() async {
    try {
      final raw = await TokenStorage.getAiTutorHistory();
      if (raw != null && raw.isNotEmpty) {
        final decoded = jsonDecode(raw) as List? ?? [];
        _historySessions.clear();
        for (final item in decoded) {
          _historySessions.add(AiTutorSession.fromJson(Map<String, dynamic>.from(item as Map)));
        }
        notifyListeners();
      }
    } catch (_) {}
  }

  Future<void> _saveHistoryToStorage() async {
    try {
      final encoded = jsonEncode(_historySessions.map((s) => s.toJson()).toList());
      await TokenStorage.saveAiTutorHistory(encoded);
    } catch (_) {}
  }

  Future<void> archiveCurrentSession() async {
    final userMessages = _messages.where((m) => m.isUser).toList();
    if (userMessages.isNotEmpty) {
      final firstQuestion = userMessages.first.question;
      final session = AiTutorSession(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        title: firstQuestion.length > 60 ? '${firstQuestion.substring(0, 57)}...' : firstQuestion,
        timestamp: DateTime.now(),
        messages: List.from(_messages),
      );
      // Remove duplicate if same ID
      _historySessions.removeWhere((s) => s.id == session.id);
      _historySessions.insert(0, session);
      await _saveHistoryToStorage();
      notifyListeners();
    }
  }

  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }

  Future<void> resetConversation({bool archive = true}) async {
    if (archive) {
      await archiveCurrentSession();
    }
    _errorMessage = null;
    _initDefaultMessage();
    notifyListeners();
  }

  void restoreSession(AiTutorSession session) {
    _messages.clear();
    _messages.addAll(session.messages);
    _errorMessage = null;
    notifyListeners();
  }

  Future<void> deleteSession(String id) async {
    _historySessions.removeWhere((s) => s.id == id);
    await _saveHistoryToStorage();
    notifyListeners();
  }

  Future<void> clearAllHistory() async {
    _historySessions.clear();
    await TokenStorage.clearAiTutorHistory();
    notifyListeners();
  }

  Future<void> askQuestion({
    required String prompt,
    String? query,
    String? context,
  }) async {
    final cleanPrompt = prompt.trim();
    if (cleanPrompt.isEmpty) return;

    final cleanQuery = (query != null && query.trim().isNotEmpty) ? query.trim() : null;

    _messages.add(
      AiChatMessage(
        question: cleanPrompt,
        attachedQuery: cleanQuery,
        isUser: true,
        timestamp: DateTime.now(),
      ),
    );

    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiClient.post(
        ApiEndpoints.aiTutorAsk,
        data: {
          'prompt': cleanPrompt,
          if (cleanQuery != null)
            'query': cleanQuery.length > 1000 ? cleanQuery.substring(0, 1000) : cleanQuery,
          if (context != null && context.trim().isNotEmpty) 'context': context.trim(),
        },
      );

      final data = response.data as Map<String, dynamic>;
      final aiRes = AiTutorResponseModel.fromJson(data);

      _messages.add(
        AiChatMessage(
          question: cleanPrompt,
          response: aiRes,
          isUser: false,
          timestamp: DateTime.now(),
        ),
      );
      _isLoading = false;
      notifyListeners();
    } on ApiException catch (e) {
      _errorMessage = e.message;
      _messages.add(
        AiChatMessage(
          question: cleanPrompt,
          isUser: false,
          isError: true,
          errorMessage: e.message,
          timestamp: DateTime.now(),
        ),
      );
      _isLoading = false;
      notifyListeners();
    } catch (_) {
      const msg = 'Tidak dapat menghubungi server AI Tutor saat ini. Silakan periksa koneksi internet Anda atau coba beberapa saat lagi.';
      _errorMessage = msg;
      _messages.add(
        AiChatMessage(
          question: cleanPrompt,
          isUser: false,
          isError: true,
          errorMessage: msg,
          timestamp: DateTime.now(),
        ),
      );
      _isLoading = false;
      notifyListeners();
    }
  }
}
