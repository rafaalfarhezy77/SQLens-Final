import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../core/widgets/brutalist_card.dart';
import '../../providers/playground_provider.dart';
import 'widgets/custom_dataset_bottom_sheet.dart';
import 'widgets/quick_sql_toolbar.dart';
import 'widgets/result_table_widget.dart';
import 'widgets/study_case_bottom_sheet.dart';
import 'widgets/table_schema_bottom_sheet.dart';
import 'widgets/visualization_stepper_widget.dart';

class PlaygroundScreen extends StatelessWidget {
  const PlaygroundScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final playground = context.watch<PlaygroundProvider>();

    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      appBar: AppBar(
        backgroundColor: AppColors.cardWhite,
        elevation: 0,
        title: const Text(
          'SQL PLAYGROUND',
          style: TextStyle(
            fontWeight: FontWeight.w900,
            fontSize: 16,
            color: AppColors.borderBlack,
            letterSpacing: 0.5,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.table_chart_outlined, color: AppColors.borderBlack),
            tooltip: 'Lihat Skema & Tabel',
            onPressed: () => TableSchemaBottomSheet.show(context),
          ),
          IconButton(
            icon: const Icon(Icons.upload_file_outlined, color: AppColors.borderBlack),
            tooltip: 'Unggah Database Kustom',
            onPressed: () => CustomDatasetBottomSheet.show(context),
          ),
          IconButton(
            icon: const Icon(Icons.menu_book_outlined, color: AppColors.borderBlack),
            tooltip: 'Pilih Studi Kasus & Soal',
            onPressed: () => StudyCaseBottomSheet.show(context),
          ),
        ],
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(48),
          child: Container(
            decoration: const BoxDecoration(
              border: Border(
                top: BorderSide(color: AppColors.borderBlack, width: 2),
                bottom: BorderSide(color: AppColors.borderBlack, width: 2),
              ),
              color: AppColors.cardWhite,
            ),
            child: Row(
              children: [
                _buildTabButton(context, playground, 0, 'EDITOR'),
                _buildTabButton(context, playground, 1, 'VISUALISASI'),
                _buildTabButton(context, playground, 2, 'HASIL'),
              ],
            ),
          ),
        ),
      ),
      body: IndexedStack(
        index: playground.activeTabIndex,
        children: [
          // Tab 0: SQL Editor
          _buildEditorTab(context, playground),
          // Tab 1: Visualisasi Stepper
          VisualizationStepperWidget(
            steps: playground.executionResult?.steps ?? [],
          ),
          // Tab 2: Hasil Query
          ResultTableWidget(
            executionResult: playground.executionResult,
          ),
        ],
      ),
    );
  }

  Widget _buildTabButton(BuildContext context, PlaygroundProvider playground, int index, String label) {
    final isActive = playground.activeTabIndex == index;
    return Expanded(
      child: GestureDetector(
        onTap: () => playground.setActiveTab(index),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: isActive ? AppColors.primaryYellow : AppColors.cardWhite,
            border: index > 0 ? const Border(left: BorderSide(color: AppColors.borderBlack, width: 2)) : null,
          ),
          child: Center(
            child: Text(
              label,
              style: const TextStyle(
                fontWeight: FontWeight.w900,
                fontSize: 12,
                letterSpacing: 0.5,
                color: AppColors.borderBlack,
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildEditorTab(BuildContext context, PlaygroundProvider playground) {
    return Column(
      children: [
        // Active Study Case / Database Banner
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          decoration: const BoxDecoration(
            color: AppColors.cardWhite,
            border: Border(bottom: BorderSide(color: AppColors.borderBlack, width: 1.5)),
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                color: playground.isCustomMode
                    ? AppColors.primaryYellow
                    : playground.activeSharedId != null
                        ? AppColors.successGreen
                        : AppColors.primaryYellow,
                child: Text(
                  playground.isCustomMode
                      ? 'DB KUSTOM'
                      : playground.activeSharedId != null
                          ? 'TUGAS DOSEN'
                          : 'STUDI KASUS',
                  style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w900),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  playground.currentActiveTitle,
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              GestureDetector(
                onTap: () => StudyCaseBottomSheet.show(context),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.backgroundLight,
                    border: Border.all(color: AppColors.borderBlack, width: 1),
                  ),
                  child: const Text(
                    'GANTI KASUS',
                    style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900),
                  ),
                ),
              ),
              const SizedBox(width: 6),
              GestureDetector(
                onTap: () => TableSchemaBottomSheet.show(context),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.backgroundLight,
                    border: Border.all(color: AppColors.borderBlack, width: 1),
                  ),
                  child: const Text(
                    'SKEMA TABEL',
                    style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900),
                  ),
                ),
              ),
            ],
          ),
        ),

        // Error notification if execution failed
        if (playground.errorMessage != null)
          Container(
            padding: const EdgeInsets.all(12),
            margin: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.errorRedLight,
              border: Border.all(color: AppColors.errorRed, width: 2),
            ),
            child: Row(
              children: [
                const Icon(Icons.error_outline, color: AppColors.errorRed, size: 20),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    playground.errorMessage!,
                    style: const TextStyle(
                      color: AppColors.errorRed,
                      fontSize: 13,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
          ),

        // SQL Code Input
        Expanded(
          child: Container(
            margin: const EdgeInsets.all(12),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.cardWhite,
              border: Border.all(color: AppColors.borderBlack, width: 2),
              boxShadow: AppColors.brutalistShadow(offset: 3),
            ),
            child: TextField(
              controller: playground.queryController,
              maxLines: null,
              expands: true,
              keyboardType: TextInputType.multiline,
              style: const TextStyle(
                fontFamily: 'monospace',
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: AppColors.textMain,
                height: 1.4,
              ),
              decoration: const InputDecoration(
                hintText: 'Tulis query SQL di sini (misal: SELECT * FROM students;)',
                border: InputBorder.none,
              ),
            ),
          ),
        ),

        // Quick SQL Keywords Toolbar
        QuickSqlToolbar(
          onKeywordTap: (kw) => playground.insertKeyword(kw),
        ),

        // Execute Button Bar
        Container(
          padding: const EdgeInsets.all(12.0),
          decoration: const BoxDecoration(
            color: AppColors.cardWhite,
            border: Border(top: BorderSide(color: AppColors.borderBlack, width: 2)),
          ),
          child: Row(
            children: [
              Expanded(
                child: BrutalistButton(
                  text: 'JALANKAN QUERY',
                  icon: const Icon(Icons.play_arrow, size: 18, color: AppColors.borderBlack),
                  isLoading: playground.isExecuting,
                  onPressed: () => playground.executeCurrentQuery(),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
