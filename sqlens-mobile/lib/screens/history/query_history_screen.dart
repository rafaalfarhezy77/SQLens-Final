import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../core/widgets/brutalist_card.dart';
import '../../providers/history_provider.dart';
import '../../providers/playground_provider.dart';

class QueryHistoryScreen extends StatefulWidget {
  const QueryHistoryScreen({super.key});

  @override
  State<QueryHistoryScreen> createState() => _QueryHistoryScreenState();
}

class _QueryHistoryScreenState extends State<QueryHistoryScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<HistoryProvider>().fetchHistory();
    });
  }

  @override
  Widget build(BuildContext context) {
    final history = context.watch<HistoryProvider>();
    final playground = context.read<PlaygroundProvider>();

    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      appBar: AppBar(
        backgroundColor: AppColors.cardWhite,
        elevation: 0,
        title: const Text(
          'RIWAYAT QUERY',
          style: TextStyle(
            fontWeight: FontWeight.w900,
            fontSize: 16,
            color: AppColors.borderBlack,
            letterSpacing: 0.5,
          ),
        ),
        actions: [
          if (history.items.isNotEmpty)
            IconButton(
              icon: const Icon(Icons.delete_sweep_outlined, color: AppColors.errorRed),
              tooltip: 'Hapus Semua Riwayat',
              onPressed: () {
                showDialog(
                  context: context,
                  builder: (ctx) => AlertDialog(
                    title: const Text('Hapus Semua Riwayat?'),
                    content: const Text('Seluruh catatan aktivitas query Anda akan dihapus dari server.'),
                    actions: [
                      TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Batal')),
                      TextButton(
                        onPressed: () {
                          history.clearAll();
                          Navigator.pop(ctx);
                        },
                        child: const Text('Hapus', style: TextStyle(color: AppColors.errorRed)),
                      ),
                    ],
                  ),
                );
              },
            ),
          IconButton(
            icon: const Icon(Icons.refresh, color: AppColors.borderBlack),
            tooltip: 'Segarkan',
            onPressed: () => history.fetchHistory(),
          ),
        ],
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(2),
          child: Container(color: AppColors.borderBlack, height: 2),
        ),
      ),
      body: history.isLoading
          ? const Center(
              child: CircularProgressIndicator(color: AppColors.borderBlack),
            )
          : history.items.isEmpty
              ? Center(
                  child: Padding(
                    padding: const EdgeInsets.all(24.0),
                    child: BrutalistCard(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: const [
                          Icon(Icons.history_outlined, size: 48, color: AppColors.textMuted),
                          SizedBox(height: 12),
                          Text(
                            'BELUM ADA RIWAYAT',
                            style: TextStyle(fontWeight: FontWeight.w900, fontSize: 16),
                          ),
                          SizedBox(height: 6),
                          Text(
                            'Setiap query yang Anda jalankan di Playground akan otomatis tercatat dan tersinkronisasi di sini.',
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
                  itemCount: history.items.length,
                  separatorBuilder: (context, index) => const SizedBox(height: 12),
                  itemBuilder: (context, index) {
                    final item = history.items[index];
                    final isSuccess = item.status.toLowerCase() == 'success';

                    return BrutalistCard(
                      padding: const EdgeInsets.all(12),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: isSuccess ? AppColors.successGreenLight : AppColors.errorRedLight,
                                  border: Border.all(
                                    color: isSuccess ? AppColors.successGreen : AppColors.errorRed,
                                    width: 1,
                                  ),
                                ),
                                child: Text(
                                  item.status.toUpperCase(),
                                  style: TextStyle(
                                    fontWeight: FontWeight.w900,
                                    fontSize: 10,
                                    color: isSuccess ? AppColors.successGreenDark : AppColors.errorRed,
                                  ),
                                ),
                              ),
                              Row(
                                children: [
                                  if (item.executionTimeMs != null)
                                    Text(
                                      '${item.executionTimeMs!.toStringAsFixed(1)} ms',
                                      style: const TextStyle(
                                        fontFamily: 'monospace',
                                        fontSize: 11,
                                        color: AppColors.textMuted,
                                      ),
                                    ),
                                  const SizedBox(width: 8),
                                  GestureDetector(
                                    onTap: () => history.deleteItem(item.id),
                                    child: const Icon(Icons.close, size: 16, color: AppColors.textMuted),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          // SQL Query Box
                          Container(
                            width: double.infinity,
                            padding: const EdgeInsets.all(8),
                            color: AppColors.backgroundLight,
                            child: Text(
                              item.query,
                              style: const TextStyle(
                                fontFamily: 'monospace',
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                          const SizedBox(height: 8),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                item.executedAt.contains('T')
                                    ? item.executedAt.split('T')[0]
                                    : item.executedAt,
                                style: const TextStyle(fontSize: 11, color: AppColors.textMuted),
                              ),
                              GestureDetector(
                                onTap: () {
                                  playground.setQuery(item.query);
                                  playground.setActiveTab(0);
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(content: Text('Query disalin ke SQL Playground!')),
                                  );
                                },
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: AppColors.primaryYellow,
                                    border: Border.all(color: AppColors.borderBlack, width: 1.5),
                                  ),
                                  child: const Text(
                                    'Buka di Playground',
                                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11),
                                  ),
                                ),
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
