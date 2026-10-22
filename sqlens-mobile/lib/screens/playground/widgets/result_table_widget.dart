import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/widgets/brutalist_card.dart';
import '../../../data/models/query_execution_model.dart';

class ResultTableWidget extends StatelessWidget {
  final QueryExecutionModel? executionResult;

  const ResultTableWidget({super.key, required this.executionResult});

  @override
  Widget build(BuildContext context) {
    if (executionResult == null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: BrutalistCard(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: const [
                Icon(Icons.table_chart_outlined, size: 48, color: AppColors.textMuted),
                SizedBox(height: 12),
                Text(
                  'BELUM ADA HASIL QUERY',
                  style: TextStyle(fontWeight: FontWeight.w900, fontSize: 16),
                ),
                SizedBox(height: 6),
                Text(
                  'Jalankan query di tab Editor untuk menampilkan tabel data keluaran RDBMS.',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 12, color: AppColors.textMuted),
                ),
              ],
            ),
          ),
        ),
      );
    }

    final res = executionResult!;
    final columns = res.columns;
    final rows = res.rows;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Stats Row
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.primaryYellow,
                  border: Border.all(color: AppColors.borderBlack, width: 1.5),
                ),
                child: Text(
                  '${res.totalRows} BARIS DITEMUKAN',
                  style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 11),
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.cardWhite,
                  border: Border.all(color: AppColors.borderBlack, width: 1.5),
                ),
                child: Text(
                  'DURASI: ${res.executionTimeMs.toStringAsFixed(1)} ms',
                  style: const TextStyle(
                    fontFamily: 'monospace',
                    fontWeight: FontWeight.bold,
                    fontSize: 11,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),

          // Data Table with Horizontal Scroll
          if (columns.isEmpty || rows.isEmpty)
            BrutalistCard(
              backgroundColor: AppColors.cardWhite,
              child: const Text(
                'Query berhasil dijalankan, namun tidak ada baris yang dikembalikan.',
                style: TextStyle(fontSize: 13, color: AppColors.textMuted),
              ),
            )
          else
            Container(
              decoration: BoxDecoration(
                color: AppColors.cardWhite,
                border: Border.all(color: AppColors.borderBlack, width: 2),
                boxShadow: AppColors.brutalistShadow(offset: 2.5),
              ),
              child: SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: DataTable(
                  headingRowColor: WidgetStateProperty.all(AppColors.backgroundLight),
                  border: TableBorder(
                    horizontalInside: BorderSide(color: AppColors.borderBlack.withValues(alpha: 0.2), width: 1),
                    verticalInside: BorderSide(color: AppColors.borderBlack.withValues(alpha: 0.2), width: 1),
                  ),
                  columns: columns.map((col) {
                    return DataColumn(
                      label: Text(
                        col.toUpperCase(),
                        style: const TextStyle(
                          fontWeight: FontWeight.w900,
                          fontSize: 12,
                          fontFamily: 'monospace',
                          color: AppColors.borderBlack,
                        ),
                      ),
                    );
                  }).toList(),
                  rows: rows.map((r) {
                    return DataRow(
                      cells: columns.map((col) {
                        final val = r[col];
                        return DataCell(
                          Text(
                            val == null ? 'NULL' : val.toString(),
                            style: TextStyle(
                              fontFamily: 'monospace',
                              fontSize: 12,
                              color: val == null ? Colors.grey : AppColors.textMain,
                              fontStyle: val == null ? FontStyle.italic : FontStyle.normal,
                            ),
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
    );
  }
}
