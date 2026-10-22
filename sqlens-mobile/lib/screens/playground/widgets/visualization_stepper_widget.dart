import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/widgets/brutalist_card.dart';
import '../../../data/models/query_execution_model.dart';
import '../../../providers/playground_provider.dart';

class VisualizationStepperWidget extends StatelessWidget {
  final List<QueryStepModel> steps;

  const VisualizationStepperWidget({super.key, required this.steps});

  Color _getStatusBgColor(String status) {
    switch (status.toLowerCase()) {
      case 'keep':
        return AppColors.successGreenLight;
      case 'filtered':
        return AppColors.errorRedLight;
      case 'joined':
        return AppColors.accentBlueLight;
      default:
        return AppColors.backgroundLight;
    }
  }

  Color _getStatusTextColor(String status) {
    switch (status.toLowerCase()) {
      case 'keep':
        return AppColors.successGreenDark;
      case 'filtered':
        return AppColors.errorRed;
      case 'joined':
        return AppColors.accentBlue;
      default:
        return AppColors.textMain;
    }
  }

  @override
  Widget build(BuildContext context) {
    if (steps.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: BrutalistCard(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: const [
                Icon(Icons.bubble_chart_outlined, size: 48, color: AppColors.textMuted),
                SizedBox(height: 12),
                Text(
                  'BELUM ADA VISUALISASI',
                  style: TextStyle(fontWeight: FontWeight.w900, fontSize: 16),
                ),
                SizedBox(height: 6),
                Text(
                  'Tulis query SQL pada tab Editor lalu tekan "JALANKAN QUERY" untuk melihat transformasi alur data.',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 12, color: AppColors.textMuted),
                ),
              ],
            ),
          ),
        ),
      );
    }

    final playground = context.watch<PlaygroundProvider>();
    final selectedIdx = playground.selectedStepIndex.clamp(0, steps.length - 1);
    final currentStep = steps[selectedIdx];

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Step Selector Stepper Chips
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: List.generate(steps.length, (idx) {
                final s = steps[idx];
                final isSelected = idx == selectedIdx;
                return Padding(
                  padding: const EdgeInsets.only(right: 8.0),
                  child: GestureDetector(
                    onTap: () => playground.setSelectedStep(idx),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      decoration: BoxDecoration(
                        color: isSelected ? AppColors.primaryYellow : AppColors.cardWhite,
                        border: Border.all(color: AppColors.borderBlack, width: 2),
                        boxShadow: isSelected
                            ? AppColors.brutalistShadow(offset: 2.5)
                            : const [BoxShadow(color: AppColors.borderBlack, offset: Offset(1, 1))],
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 20,
                            height: 20,
                            alignment: Alignment.center,
                            decoration: BoxDecoration(
                              color: isSelected ? AppColors.borderBlack : AppColors.backgroundLight,
                              shape: BoxShape.circle,
                            ),
                            child: Text(
                              '${s.stepNumber}',
                              style: TextStyle(
                                color: isSelected ? AppColors.cardWhite : AppColors.borderBlack,
                                fontSize: 11,
                                fontWeight: FontWeight.w900,
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            s.clause,
                            style: TextStyle(
                              fontWeight: FontWeight.w900,
                              fontSize: 12,
                              color: AppColors.borderBlack,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              }),
            ),
          ),
          const SizedBox(height: 16),

          // Active Step Card
          BrutalistCard(
            backgroundColor: AppColors.cardWhite,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Flexible(
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppColors.primaryYellow,
                          border: Border.all(color: AppColors.borderBlack, width: 1.5),
                        ),
                        child: Text(
                          'LANGKAH ${currentStep.stepNumber}: ${currentStep.clause}',
                          style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 12),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      '${currentStep.rowsBeforeCount} → ${currentStep.rowsAfterCount} baris',
                      style: const TextStyle(
                        fontFamily: 'monospace',
                        fontWeight: FontWeight.bold,
                        fontSize: 11,
                        color: AppColors.textMuted,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Text(
                  currentStep.title,
                  style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16),
                ),
                const SizedBox(height: 6),
                Text(
                  currentStep.explanation,
                  style: const TextStyle(fontSize: 13, color: AppColors.textMuted),
                ),

                // JOIN Details Box if applicable
                if (currentStep.joinDetails != null) ...[
                  const SizedBox(height: 14),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppColors.accentBlueLight,
                      border: Border.all(color: AppColors.accentBlue, width: 2),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            const Icon(Icons.link, size: 16, color: AppColors.accentBlue),
                            const SizedBox(width: 6),
                            Text(
                              'DETAIL OPERASI ${currentStep.joinDetails!.joinType}',
                              style: const TextStyle(
                                fontWeight: FontWeight.w900,
                                fontSize: 11,
                                color: AppColors.accentBlue,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 6),
                        Text(
                          '${currentStep.joinDetails!.leftTable}.${currentStep.joinDetails!.leftKey} = ${currentStep.joinDetails!.rightTable}.${currentStep.joinDetails!.rightKey}',
                          style: const TextStyle(
                            fontFamily: 'monospace',
                            fontWeight: FontWeight.bold,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Row-by-Row Evaluations
          const Text(
            'EVALUASI BARIS DATA',
            style: TextStyle(fontWeight: FontWeight.w900, fontSize: 13, letterSpacing: 0.5),
          ),
          const SizedBox(height: 8),

          if (currentStep.rowEvaluations.isEmpty)
            BrutalistCard(
              backgroundColor: AppColors.backgroundLight,
              child: const Text(
                'Tidak ada perubahan baris spesifik yang dievaluasi pada langkah ini.',
                style: TextStyle(fontSize: 12, color: AppColors.textMuted),
              ),
            )
          else
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: currentStep.rowEvaluations.length,
              separatorBuilder: (context, index) => const SizedBox(height: 8),
              itemBuilder: (context, rIdx) {
                final row = currentStep.rowEvaluations[rIdx];
                final bgColor = _getStatusBgColor(row.status);
                final textColor = _getStatusTextColor(row.status);

                return Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.cardWhite,
                    border: Border.all(color: AppColors.borderBlack, width: 1.5),
                    boxShadow: AppColors.brutalistShadow(offset: 2),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            row.id.toUpperCase(),
                            style: const TextStyle(
                              fontWeight: FontWeight.w900,
                              fontFamily: 'monospace',
                              fontSize: 11,
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: bgColor,
                              border: Border.all(color: textColor, width: 1),
                            ),
                            child: Text(
                              row.statusText.toUpperCase(),
                              style: TextStyle(
                                fontWeight: FontWeight.w900,
                                fontSize: 10,
                                color: textColor,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      // Data values
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(8),
                        color: AppColors.backgroundLight,
                        child: SingleChildScrollView(
                          scrollDirection: Axis.horizontal,
                          child: Text(
                            row.data.entries.map((e) => '${e.key}: ${e.value}').join('  |  '),
                            style: const TextStyle(fontFamily: 'monospace', fontSize: 12),
                          ),
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        'Alasan: ${row.reason}',
                        style: const TextStyle(fontSize: 12, color: AppColors.textMuted),
                      ),
                    ],
                  ),
                );
              },
            ),
        ],
      ),
    );
  }
}
