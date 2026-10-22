import 'package:flutter/material.dart';
import '../core/constants/api_endpoints.dart';
import '../core/network/api_client.dart';
import '../core/network/api_exception.dart';
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
}

class AiTutorProvider extends ChangeNotifier {
  final ApiClient _apiClient = ApiClient();
  final List<AiChatMessage> _messages = [];
  bool _isLoading = false;
  String? _errorMessage;

  List<AiChatMessage> get messages => _messages;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  AiTutorProvider() {
    // Add welcoming pedagogical message
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

  void clearError() {
    _errorMessage = null;
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
    } catch (e) {
      final msg = 'Tidak dapat menghubungi server AI Tutor: $e\nPastikan backend aktif dan URL server sesuai.';
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
