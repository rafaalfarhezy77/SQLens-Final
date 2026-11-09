import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/widgets/brutalist_card.dart';
import '../../../providers/playground_provider.dart';

class StudyCaseBottomSheet extends StatefulWidget {
  const StudyCaseBottomSheet({super.key});

  static void show(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.cardWhite,
      shape: const RoundedRectangleBorder(
        side: BorderSide(color: AppColors.borderBlack, width: 2),
      ),
      builder: (_) => const StudyCaseBottomSheet(),
    );
  }

  @override
  State<StudyCaseBottomSheet> createState() => _StudyCaseBottomSheetState();
}

class _StudyCaseBottomSheetState extends State<StudyCaseBottomSheet> {
  String? _expandedHintId;

  @override
  Widget build(BuildContext context) {
    final playground = context.watch<PlaygroundProvider>();
    final activeCase = playground.activeCaseDetail;

    return DraggableScrollableSheet(
      initialChildSize: 0.85,
      minChildSize: 0.5,
      maxChildSize: 0.95,
      expand: false,
      builder: (ctx, scrollController) {
        return Column(
          children: [
            // Header Bar
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: const BoxDecoration(
                color: AppColors.primaryYellow,
                border: Border(bottom: BorderSide(color: AppColors.borderBlack, width: 2)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'PILIH STUDI KASUS & DATABASE',
                    style: TextStyle(fontWeight: FontWeight.w900, fontSize: 14, letterSpacing: 0.5),
                  ),
                  GestureDetector(
                    onTap: () => Navigator.pop(context),
                    child: const Icon(Icons.close, size: 20, color: AppColors.borderBlack),
                  ),
                ],
              ),
            ),

            // Scrollable Content
            Expanded(
              child: ListView(
                controller: scrollController,
                padding: const EdgeInsets.all(16),
                children: [
                  // 1. Selector Chips (Akademik, E-Commerce, Perpustakaan, Shared, Custom)
                  const Text(
                    'STUDI KASUS BAWAAN',
                    style: TextStyle(fontWeight: FontWeight.w900, fontSize: 12, color: AppColors.textMuted),
                  ),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: playground.studyCases.map((cs) {
                      final isSelected = !playground.isCustomMode &&
                          playground.activeSharedId == null &&
                          playground.activeCaseId == cs.id;
                      return GestureDetector(
                        onTap: () {
                          playground.selectStudyCase(cs.id);
                        },
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                          decoration: BoxDecoration(
                            color: isSelected ? AppColors.primaryYellow : AppColors.cardWhite,
                            border: Border.all(color: AppColors.borderBlack, width: 2),
                            boxShadow: AppColors.brutalistShadow(offset: isSelected ? 3 : 1),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(
                                cs.title,
                                style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 12),
                              ),
                              const SizedBox(width: 6),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
                                color: isSelected ? AppColors.cardWhite : AppColors.backgroundLight,
                                child: Text(
                                  cs.difficulty,
                                  style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    }).toList(),
                  ),

                  // 2. Shared Datasets from Lecturer
                  if (playground.sharedDatasets.isNotEmpty) ...[
                    const SizedBox(height: 16),
                    const Text(
                      'DATASET TUGAS DARI DOSEN',
                      style: TextStyle(fontWeight: FontWeight.w900, fontSize: 12, color: AppColors.textMuted),
                    ),
                    const SizedBox(height: 8),
                    ...playground.sharedDatasets.map((sd) {
                      final isSelected = playground.activeSharedId == sd.id;
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: BrutalistCard(
                          backgroundColor: isSelected ? AppColors.successGreenLight : AppColors.cardWhite,
                          onTap: () {
                            playground.selectSharedDataset(sd.id);
                          },
                          child: Row(
                            children: [
                              const Icon(Icons.school, size: 20, color: AppColors.successGreenDark),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      sd.title,
                                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                                    ),
                                    Text(
                                      'Pengunggah: ${sd.createdByName} • Tabel: ${sd.tableNames.join(", ")}',
                                      style: const TextStyle(fontSize: 11, color: AppColors.textMuted),
                                    ),
                                  ],
                                ),
                              ),
                              if (isSelected)
                                const Icon(Icons.check_circle, size: 18, color: AppColors.successGreenDark),
                            ],
                          ),
                        ),
                      );
                    }),
                  ],

                  const SizedBox(height: 16),
                  const Divider(color: AppColors.borderBlack, thickness: 1.5),
                  const SizedBox(height: 12),

                  // 3. Active Case Study Details & Challenges
                  if (activeCase != null && playground.activeSharedId == null) ...[
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Text(
                            activeCase.title.toUpperCase(),
                            style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16),
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          color: AppColors.primaryYellow,
                          child: Text(
                            activeCase.category,
                            style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      activeCase.description,
                      style: const TextStyle(fontSize: 12, color: AppColors.textMuted, height: 1.4),
                    ),
                    const SizedBox(height: 12),

                    // Tables in this case
                    const Text(
                      'TABEL TERKAIT:',
                      style: TextStyle(fontWeight: FontWeight.w900, fontSize: 11, letterSpacing: 0.5),
                    ),
                    const SizedBox(height: 6),
                    Wrap(
                      spacing: 6,
                      runSpacing: 6,
                      children: activeCase.tableNames.map((tbl) {
                        return Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppColors.backgroundLight,
                            border: Border.all(color: AppColors.borderBlack, width: 1.5),
                          ),
                          child: Text(
                            tbl,
                            style: const TextStyle(fontFamily: 'monospace', fontSize: 11, fontWeight: FontWeight.bold),
                          ),
                        );
                      }).toList(),
                    ),

                    // Challenges
                    if (activeCase.challenges.isNotEmpty) ...[
                      const SizedBox(height: 16),
                      Text(
                        'SOAL TANTANGAN & LATIHAN (${activeCase.challenges.length})',
                        style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 13, letterSpacing: 0.5),
                      ),
                      const SizedBox(height: 8),
                      ...activeCase.challenges.map((c) {
                        final isHintOpen = _expandedHintId == c.id;
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 10),
                          child: BrutalistCard(
                            padding: const EdgeInsets.all(12),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Expanded(
                                      child: Text(
                                        c.title,
                                        style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 13),
                                      ),
                                    ),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1),
                                      color: AppColors.primaryYellow,
                                      child: Text(
                                        c.difficulty,
                                        style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 6),
                                Text(
                                  c.description,
                                  style: const TextStyle(fontSize: 12, color: AppColors.textMuted),
                                ),
                                if (isHintOpen) ...[
                                  const SizedBox(height: 8),
                                  Container(
                                    padding: const EdgeInsets.all(8),
                                    color: const Color(0xFFFFFDE7),
                                    child: Row(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        const Icon(Icons.lightbulb_outline, size: 16, color: Color(0xFFB78103)),
                                        const SizedBox(width: 6),
                                        Expanded(
                                          child: Text(
                                            c.hint,
                                            style: const TextStyle(fontSize: 11, color: Color(0xFF5D4037)),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                                const SizedBox(height: 10),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    GestureDetector(
                                      onTap: () {
                                        setState(() {
                                          _expandedHintId = isHintOpen ? null : c.id;
                                        });
                                      },
                                      child: Text(
                                        isHintOpen ? 'Tutup Petunjuk' : 'Lihat Petunjuk',
                                        style: const TextStyle(
                                          fontSize: 11,
                                          fontWeight: FontWeight.bold,
                                          decoration: TextDecoration.underline,
                                        ),
                                      ),
                                    ),
                                    ElevatedButton.icon(
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: AppColors.borderBlack,
                                        foregroundColor: AppColors.cardWhite,
                                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                        shape: const RoundedRectangleBorder(),
                                      ),
                                      icon: const Icon(Icons.code, size: 14),
                                      label: const Text('Kerjakan Soal', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                                      onPressed: () {
                                        playground.setQuery(c.starterQuery);
                                        Navigator.pop(context);
                                      },
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        );
                      }),
                    ],

                    // Sample Queries Quick Load
                    if (activeCase.sampleQueries.isNotEmpty) ...[
                      const SizedBox(height: 16),
                      const Text(
                        'CONTOH QUERY CEPAT',
                        style: TextStyle(fontWeight: FontWeight.w900, fontSize: 13, letterSpacing: 0.5),
                      ),
                      const SizedBox(height: 8),
                      ...activeCase.sampleQueries.map((sq) {
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 8),
                          child: BrutalistCard(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                            backgroundColor: AppColors.backgroundLight,
                            onTap: () {
                              playground.setQuery(sq.query);
                              Navigator.pop(context);
                            },
                            child: Row(
                              children: [
                                const Icon(Icons.play_circle_outline, size: 18, color: AppColors.borderBlack),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        sq.title,
                                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                                      ),
                                      Text(
                                        sq.explanation,
                                        style: const TextStyle(fontSize: 11, color: AppColors.textMuted),
                                      ),
                                    ],
                                  ),
                                ),
                                const Icon(Icons.arrow_forward_ios, size: 12, color: AppColors.borderBlack),
                              ],
                            ),
                          ),
                        );
                      }),
                    ],
                  ],
                ],
              ),
            ),
          ],
        );
      },
    );
  }
}
