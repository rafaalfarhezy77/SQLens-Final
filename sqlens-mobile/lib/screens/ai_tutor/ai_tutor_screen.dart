import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../core/widgets/brutalist_card.dart';
import '../../providers/ai_tutor_provider.dart';
import '../../providers/playground_provider.dart';

class AiTutorScreen extends StatefulWidget {
  const AiTutorScreen({super.key});

  @override
  State<AiTutorScreen> createState() => _AiTutorScreenState();
}

class _AiTutorScreenState extends State<AiTutorScreen> {
  final _promptController = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  @override
  void dispose() {
    _promptController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final aiTutor = context.watch<AiTutorProvider>();
    final playground = context.watch<PlaygroundProvider>();

    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      appBar: AppBar(
        backgroundColor: AppColors.cardWhite,
        elevation: 0,
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              color: AppColors.primaryYellow,
              child: const Text(
                'AI',
                style: TextStyle(fontWeight: FontWeight.w900, fontSize: 13),
              ),
            ),
            const SizedBox(width: 8),
            const Text(
              'SQLENS TUTOR',
              style: TextStyle(
                fontWeight: FontWeight.w900,
                fontSize: 16,
                color: AppColors.borderBlack,
                letterSpacing: 0.5,
              ),
            ),
          ],
        ),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(2),
          child: Container(color: AppColors.borderBlack, height: 2),
        ),
      ),
      body: Column(
        children: [
          // Chat message list
          Expanded(
            child: ListView.separated(
              controller: _scrollController,
              padding: const EdgeInsets.all(16.0),
              itemCount: aiTutor.messages.length,
              separatorBuilder: (context, index) => const SizedBox(height: 14),
              itemBuilder: (context, index) {
                final msg = aiTutor.messages[index];
                if (msg.isUser) {
                  return _buildUserBubble(msg.question);
                } else if (msg.isError) {
                  return _buildErrorBubble(msg, aiTutor, playground);
                } else {
                  return _buildTutorBubble(msg);
                }
              },
            ),
          ),

          // Starter Scenario Chips
          SizedBox(
            height: 44,
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 12),
              children: [
                _buildScenarioChip(
                  aiTutor,
                  'Mengapa data Citra tidak muncul?',
                  query: playground.queryController.text,
                ),
                const SizedBox(width: 8),
                _buildScenarioChip(
                  aiTutor,
                  'Bagaimana cara kerja INNER JOIN?',
                ),
                const SizedBox(width: 8),
                _buildScenarioChip(
                  aiTutor,
                  'Kapan menggunakan HAVING vs WHERE?',
                ),
              ],
            ),
          ),
          const SizedBox(height: 8),

          // Input Bar
          Container(
            padding: const EdgeInsets.all(12),
            decoration: const BoxDecoration(
              color: AppColors.cardWhite,
              border: Border(top: BorderSide(color: AppColors.borderBlack, width: 2)),
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _promptController,
                    decoration: InputDecoration(
                      hintText: 'Tanyakan alur query atau konsep SQL...',
                      hintStyle: const TextStyle(fontSize: 13, color: AppColors.textMuted),
                      filled: true,
                      fillColor: AppColors.backgroundLight,
                      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                      border: OutlineInputBorder(
                        borderSide: const BorderSide(color: AppColors.borderBlack, width: 1.5),
                        borderRadius: BorderRadius.zero,
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderSide: const BorderSide(color: AppColors.borderBlack, width: 1.5),
                        borderRadius: BorderRadius.zero,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                GestureDetector(
                  onTap: aiTutor.isLoading
                      ? null
                      : () async {
                          final text = _promptController.text.trim();
                          if (text.isEmpty) return;
                          _promptController.clear();
                          await aiTutor.askQuestion(
                            prompt: text,
                            query: playground.queryController.text,
                          );
                          _scrollToBottom();
                        },
                  child: Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      color: aiTutor.isLoading ? Colors.grey[300] : AppColors.primaryYellow,
                      border: Border.all(color: AppColors.borderBlack, width: 2),
                      boxShadow: const [BoxShadow(color: AppColors.borderBlack, offset: Offset(2, 2))],
                    ),
                    child: aiTutor.isLoading
                        ? const Center(
                            child: SizedBox(
                              width: 18,
                              height: 18,
                              child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.borderBlack),
                            ),
                          )
                        : const Icon(Icons.send, size: 20, color: AppColors.borderBlack),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildScenarioChip(AiTutorProvider provider, String text, {String? query}) {
    return GestureDetector(
      onTap: provider.isLoading
          ? null
          : () async {
              await provider.askQuestion(prompt: text, query: query);
              _scrollToBottom();
            },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: AppColors.cardWhite,
          border: Border.all(color: AppColors.borderBlack, width: 1.5),
        ),
        child: Text(
          text,
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: AppColors.borderBlack),
        ),
      ),
    );
  }

  Widget _buildUserBubble(String question) {
    return Align(
      alignment: Alignment.centerRight,
      child: Container(
        constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.85),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: AppColors.cardWhite,
          border: Border.all(color: AppColors.borderBlack, width: 2),
          boxShadow: AppColors.brutalistShadow(offset: 2),
        ),
        child: Text(
          question,
          style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
        ),
      ),
    );
  }

  Widget _buildErrorBubble(AiChatMessage msg, AiTutorProvider aiTutor, PlaygroundProvider playground) {
    return Align(
      alignment: Alignment.centerLeft,
      child: ConstrainedBox(
        constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.9),
        child: BrutalistCard(
          backgroundColor: AppColors.errorRedLight,
          borderColor: AppColors.errorRed,
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    color: AppColors.errorRed,
                    child: const Text(
                      'AI TUTOR ERROR',
                      style: TextStyle(fontWeight: FontWeight.w900, fontSize: 11, color: Colors.white),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                msg.errorMessage ?? 'Gagal memproses pertanyaan ke server AI Tutor.',
                style: const TextStyle(fontSize: 12, color: AppColors.errorRed, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 10),
              GestureDetector(
                onTap: () {
                  aiTutor.askQuestion(
                    prompt: msg.question,
                    query: playground.queryController.text,
                  );
                },
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: AppColors.cardWhite,
                    border: Border.all(color: AppColors.borderBlack, width: 1.5),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: const [
                      Icon(Icons.refresh, size: 14, color: AppColors.borderBlack),
                      SizedBox(width: 4),
                      Text('Coba Lagi', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 11)),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTutorBubble(AiChatMessage msg) {
    final res = msg.response;
    return Align(
      alignment: Alignment.centerLeft,
      child: ConstrainedBox(
        constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.92),
        child: BrutalistCard(
          backgroundColor: AppColors.cardWhite,
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    color: AppColors.primaryYellow,
                    child: const Text(
                      'SQLENS TUTOR',
                      style: TextStyle(fontWeight: FontWeight.w900, fontSize: 11),
                    ),
                  ),
                  const SizedBox(width: 8),
                  if (res != null)
                    Expanded(
                      child: Align(
                        alignment: Alignment.centerRight,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          color: AppColors.accentBlueLight,
                          child: Text(
                            res.sqlConcept,
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                            textAlign: TextAlign.end,
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 10,
                              color: AppColors.accentBlue,
                            ),
                          ),
                        ),
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 10),
              Text(
                res?.explanation ?? msg.question,
                style: const TextStyle(fontSize: 13, height: 1.4),
              ),
              if (res != null) ...[
                const SizedBox(height: 10),
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: AppColors.successGreenLight,
                    border: Border.all(color: AppColors.successGreen, width: 1.5),
                  ),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Icon(Icons.lightbulb_outline, size: 18, color: AppColors.successGreenDark),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          res.hint,
                          style: const TextStyle(
                            fontSize: 12,
                            color: AppColors.successGreenDark,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                if (res.reasoning.isNotEmpty) ...[
                  const SizedBox(height: 10),
                  const Text(
                    'LANGKAH PENALARAN ALUR DATA:',
                    style: TextStyle(fontWeight: FontWeight.w900, fontSize: 11, letterSpacing: 0.5),
                  ),
                  const SizedBox(height: 4),
                  ...res.reasoning.map(
                    (step) => Padding(
                      padding: const EdgeInsets.only(bottom: 4.0),
                      child: Text('• $step', style: const TextStyle(fontSize: 12, color: AppColors.textMuted)),
                    ),
                  ),
                ],
              ],
            ],
          ),
        ),
      ),
    );
  }
}
