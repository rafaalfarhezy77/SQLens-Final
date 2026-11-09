import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../core/widgets/brutalist_card.dart';
import '../../providers/ai_tutor_provider.dart';

class AiTutorHistoryScreen extends StatelessWidget {
  const AiTutorHistoryScreen({super.key});

  void _showSessionDetail(BuildContext context, AiTutorSession session, AiTutorProvider provider) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.cardWhite,
      shape: const RoundedRectangleBorder(
        side: BorderSide(color: AppColors.borderBlack, width: 2),
      ),
      builder: (ctx) => DraggableScrollableSheet(
        initialChildSize: 0.85,
        minChildSize: 0.5,
        maxChildSize: 0.95,
        expand: false,
        builder: (_, scrollController) => Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Header Sheet
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          DateFormat('dd MMMM yyyy, HH:mm').format(session.timestamp),
                          style: const TextStyle(fontSize: 12, color: AppColors.textMuted, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 2),
                        const Text(
                          'DETAIL PERCAKAPAN',
                          style: TextStyle(fontWeight: FontWeight.w900, fontSize: 16),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
              const Divider(color: AppColors.borderBlack, thickness: 1.5),
              const SizedBox(height: 8),

              // Messages list
              Expanded(
                child: ListView.separated(
                  controller: scrollController,
                  itemCount: session.messages.length,
                  separatorBuilder: (context, index) => const SizedBox(height: 12),
                  itemBuilder: (_, index) {
                    final msg = session.messages[index];
                    if (msg.isUser) {
                      return BrutalistCard(
                        backgroundColor: AppColors.primaryYellow,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Row(
                              children: [
                                Icon(Icons.person, size: 16),
                                SizedBox(width: 6),
                                Text('PERTANYAAN ANDA', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 11)),
                              ],
                            ),
                            const SizedBox(height: 6),
                            Text(msg.question, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                            if (msg.attachedQuery != null) ...[
                              const SizedBox(height: 6),
                              Container(
                                padding: const EdgeInsets.all(6),
                                color: AppColors.cardWhite,
                                child: Text(
                                  msg.attachedQuery!,
                                  style: const TextStyle(fontFamily: 'monospace', fontSize: 11),
                                ),
                              ),
                            ],
                          ],
                        ),
                      );
                    } else if (msg.isError) {
                      return BrutalistCard(
                        backgroundColor: AppColors.errorRedLight,
                        child: Text(
                          msg.errorMessage ?? 'Terjadi kesalahan.',
                          style: const TextStyle(color: AppColors.errorRed, fontSize: 12),
                        ),
                      );
                    } else {
                      final res = msg.response;
                      return BrutalistCard(
                        backgroundColor: AppColors.cardWhite,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                  color: AppColors.primaryYellow,
                                  child: const Text('SQLENS TUTOR', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 10)),
                                ),
                                const SizedBox(width: 8),
                                if (res?.sqlConcept != null && res!.sqlConcept.isNotEmpty)
                                  Flexible(
                                    child: Text(
                                      res.sqlConcept,
                                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: AppColors.textMuted),
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Text(
                              res?.explanation ?? '',
                              style: const TextStyle(fontSize: 13, height: 1.4),
                            ),
                            if (res?.hint != null && res!.hint.isNotEmpty) ...[
                              const SizedBox(height: 8),
                              Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: AppColors.backgroundLight,
                                  border: Border.all(color: AppColors.borderBlack, width: 1),
                                ),
                                child: Row(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Icon(Icons.lightbulb_outline, size: 16, color: AppColors.successGreenDark),
                                    const SizedBox(width: 6),
                                    Expanded(
                                      child: Text(
                                        'Petunjuk: ${res.hint}',
                                        style: const TextStyle(fontSize: 12, fontStyle: FontStyle.italic),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ],
                        ),
                      );
                    }
                  },
                ),
              ),
              const SizedBox(height: 12),

              // Restore Button
              BrutalistButton(
                text: 'BUKA DI CHAT AKTIF',
                backgroundColor: AppColors.primaryYellow,
                icon: const Icon(Icons.replay, size: 16),
                onPressed: () {
                  provider.restoreSession(session);
                  Navigator.pop(ctx); // Close sheet
                  Navigator.pop(context); // Close history screen back to chat
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Sesi percakapan dimuat kembali ke chat aktif.'),
                      duration: Duration(seconds: 1),
                    ),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final aiTutor = context.watch<AiTutorProvider>();
    final sessions = aiTutor.historySessions;

    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      appBar: AppBar(
        backgroundColor: AppColors.cardWhite,
        elevation: 0,
        title: const Text(
          'RIWAYAT AI TUTOR',
          style: TextStyle(
            fontWeight: FontWeight.w900,
            fontSize: 16,
            color: AppColors.borderBlack,
            letterSpacing: 0.5,
          ),
        ),
        actions: [
          if (sessions.isNotEmpty)
            IconButton(
              icon: const Icon(Icons.delete_sweep_outlined, color: AppColors.errorRed),
              tooltip: 'Hapus Semua Riwayat',
              onPressed: () {
                showDialog(
                  context: context,
                  builder: (ctx) => AlertDialog(
                    title: const Text('Hapus Semua Riwayat AI Tutor?'),
                    content: const Text('Seluruh arsip percakapan Anda dengan AI Tutor akan dihapus secara permanen.'),
                    actions: [
                      TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Batal')),
                      TextButton(
                        onPressed: () {
                          aiTutor.clearAllHistory();
                          Navigator.pop(ctx);
                        },
                        child: const Text('Hapus', style: TextStyle(color: AppColors.errorRed)),
                      ),
                    ],
                  ),
                );
              },
            ),
        ],
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(2),
          child: Container(color: AppColors.borderBlack, height: 2),
        ),
      ),
      body: sessions.isEmpty
          ? Center(
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: BrutalistCard(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: const [
                      Icon(Icons.history_edu_outlined, size: 48, color: AppColors.textMuted),
                      SizedBox(height: 12),
                      Text(
                        'BELUM ADA RIWAYAT',
                        style: TextStyle(fontWeight: FontWeight.w900, fontSize: 16),
                      ),
                      SizedBox(height: 6),
                      Text(
                        'Setiap percakapan Anda dengan SQLens Tutor akan otomatis tersimpan di sini saat sesi diperbarui atau selesai.',
                        textAlign: TextAlign.center,
                        style: TextStyle(fontSize: 12, color: AppColors.textMuted),
                      ),
                    ],
                  ),
                ),
              ),
            )
          : ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: sessions.length,
              separatorBuilder: (context, index) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final session = sessions[index];
                final qCount = session.messages.where((m) => m.isUser).length;

                return BrutalistCard(
                  onTap: () => _showSessionDetail(context, session, aiTutor),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            color: AppColors.backgroundLight,
                            child: Row(
                              children: [
                                const Icon(Icons.access_time, size: 12, color: AppColors.textMuted),
                                const SizedBox(width: 4),
                                Text(
                                  DateFormat('dd MMM yyyy, HH:mm').format(session.timestamp),
                                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.textMuted),
                                ),
                              ],
                            ),
                          ),
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                color: AppColors.primaryYellow,
                                child: Text(
                                  '$qCount Pertanyaan',
                                  style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w900),
                                ),
                              ),
                              const SizedBox(width: 4),
                              InkWell(
                                onTap: () => aiTutor.deleteSession(session.id),
                                child: const Padding(
                                  padding: EdgeInsets.all(4.0),
                                  child: Icon(Icons.close, size: 16, color: AppColors.textMuted),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        session.title,
                        style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 14),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 10),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          TextButton.icon(
                            style: TextButton.styleFrom(
                              visualDensity: VisualDensity.compact,
                              foregroundColor: AppColors.borderBlack,
                            ),
                            icon: const Icon(Icons.visibility_outlined, size: 14),
                            label: const Text('Buka Detail', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                            onPressed: () => _showSessionDetail(context, session, aiTutor),
                          ),
                        ],
                      ),
                    ],
                  ),
                );
              },
            ),
    );
  }
}
