import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/widgets/brutalist_card.dart';
import '../../../data/models/custom_dataset_model.dart';
import '../../../data/models/study_case_model.dart';
import '../../../providers/playground_provider.dart';

class TableSchemaBottomSheet extends StatelessWidget {
  const TableSchemaBottomSheet({super.key});

  static void show(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.cardWhite,
      shape: const RoundedRectangleBorder(
        side: BorderSide(color: AppColors.borderBlack, width: 2),
      ),
      builder: (_) => const TableSchemaBottomSheet(),
    );
  }

  @override
  Widget build(BuildContext context) {
    final playground = context.watch<PlaygroundProvider>();

    // Determine tables to show
    List<dynamic> tables = [];
    if (playground.isCustomMode) {
      tables = playground.customDatasetInfo?.tables ?? [];
    } else if (playground.activeSharedDetail != null) {
      tables = playground.activeSharedDetail!.tables;
    } else if (playground.activeCaseDetail != null) {
      tables = playground.activeCaseDetail!.tables;
    }

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
                  Row(
                    children: [
                      const Icon(Icons.table_chart_outlined, size: 18, color: AppColors.borderBlack),
                      const SizedBox(width: 8),
                      Text(
                        'SKEMA TABEL: ${playground.currentActiveTitle.toUpperCase()}',
                        style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 13, letterSpacing: 0.5),
                      ),
                    ],
                  ),
                  GestureDetector(
                    onTap: () => Navigator.pop(context),
                    child: const Icon(Icons.close, size: 20, color: AppColors.borderBlack),
                  ),
                ],
              ),
            ),

            // Tables view
            Expanded(
              child: tables.isEmpty
                  ? Center(
                      child: Padding(
                        padding: const EdgeInsets.all(24),
                        child: Text(
                          'Tidak ada tabel yang tersedia pada database ini.',
                          style: const TextStyle(fontSize: 13, color: AppColors.textMuted),
                        ),
                      ),
                    )
                  : ListView.builder(
                      controller: scrollController,
                      padding: const EdgeInsets.all(16),
                      itemCount: tables.length,
                      itemBuilder: (ctx, idx) {
                        final tbl = tables[idx];
                        final String tableName = tbl.name;
                        final List<String> columns = tbl.columns;
                        final List<Map<String, dynamic>> rows =
                            tbl is StudyCaseTableModel ? tbl.sampleRows : (tbl as DatasetTableModel).rows;

                        return Padding(
                          padding: const EdgeInsets.only(bottom: 16),
                          child: BrutalistCard(
                            padding: const EdgeInsets.all(12),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Row(
                                      children: [
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                          color: AppColors.borderBlack,
                                          child: Text(
                                            'TABEL',
                                            style: const TextStyle(
                                              color: AppColors.cardWhite,
                                              fontSize: 10,
                                              fontWeight: FontWeight.w900,
                                            ),
                                          ),
                                        ),
                                        const SizedBox(width: 8),
                                        Text(
                                          tableName,
                                          style: const TextStyle(
                                            fontFamily: 'monospace',
                                            fontWeight: FontWeight.w900,
                                            fontSize: 14,
                                          ),
                                        ),
                                      ],
                                    ),
                                    Text(
                                      '${rows.length} Baris',
                                      style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.textMuted),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 8),

                                // Columns chips
                                Wrap(
                                  spacing: 4,
                                  runSpacing: 4,
                                  children: columns.map((col) {
                                    return Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                      decoration: BoxDecoration(
                                        color: AppColors.backgroundLight,
                                        border: Border.all(color: AppColors.borderBlack, width: 1),
                                      ),
                                      child: Text(
                                        col,
                                        style: const TextStyle(fontFamily: 'monospace', fontSize: 10, fontWeight: FontWeight.bold),
                                      ),
                                    );
                                  }).toList(),
                                ),
                                const SizedBox(height: 10),

                                // Scrollable Preview Table
                                if (rows.isNotEmpty)
                                  Container(
                                    decoration: BoxDecoration(
                                      border: Border.all(color: AppColors.borderBlack, width: 1.5),
                                    ),
                                    child: SingleChildScrollView(
                                      scrollDirection: Axis.horizontal,
                                      child: DataTable(
                                        headingRowHeight: 32,
                                        dataRowMinHeight: 28,
                                        dataRowMaxHeight: 32,
                                        headingRowColor: WidgetStateProperty.all(AppColors.primaryYellow),
                                        columns: columns.map((col) {
                                          return DataColumn(
                                            label: Text(
                                              col.toUpperCase(),
                                              style: const TextStyle(
                                                fontFamily: 'monospace',
                                                fontWeight: FontWeight.w900,
                                                fontSize: 11,
                                                color: AppColors.borderBlack,
                                              ),
                                            ),
                                          );
                                        }).toList(),
                                        rows: rows.map((r) {
                                          return DataRow(
                                            cells: columns.map((col) {
                                              return DataCell(
                                                Text(
                                                  r[col]?.toString() ?? 'NULL',
                                                  style: const TextStyle(fontFamily: 'monospace', fontSize: 11),
                                                ),
                                              );
                                            }).toList(),
                                          );
                                        }).toList(),
                                      ),
                                    ),
                                  ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
            ),
          ],
        );
      },
    );
  }
}
