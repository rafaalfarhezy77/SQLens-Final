import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../core/widgets/brutalist_card.dart';
import '../../providers/playground_provider.dart';
import 'widgets/quick_sql_toolbar.dart';
import 'widgets/result_table_widget.dart';
import 'widgets/visualization_stepper_widget.dart';

class PlaygroundScreen extends StatelessWidget {
  const PlaygroundScreen({super.key});

  static const List<Map<String, String>> _presets = [
    {
      'title': '1. SELECT Dasar & Alias',
      'query': 'SELECT id, name AS nama_mahasiswa, major\nFROM students;',
    },
    {
      'title': '2. Filter WHERE (score >= 80)',
      'query': 'SELECT student_id, course, score\nFROM scores\nWHERE score >= 80;',
    },
    {
      'title': '3. INNER JOIN Students & Scores',
      'query': 'SELECT s.name, sc.course, sc.score\nFROM students s\nJOIN scores sc ON s.id = sc.student_id\nWHERE sc.score >= 80;',
    },
    {
      'title': '4. ORDER BY & LIMIT',
      'query': 'SELECT * FROM students\nORDER BY name ASC\nLIMIT 2;',
    },
  ];

  void _showPresetBottomSheet(BuildContext context, PlaygroundProvider playground) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.cardWhite,
      shape: const RoundedRectangleBorder(
        side: BorderSide(color: AppColors.borderBlack, width: 2),
      ),
      builder: (ctx) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'PILIH TEMPLATE QUERY EDUKASI',
                style: TextStyle(fontWeight: FontWeight.w900, fontSize: 16),
              ),
              const SizedBox(height: 12),
              ..._presets.map((preset) {
                return Padding(
                  padding: const EdgeInsets.only(bottom: 8.0),
                  child: BrutalistCard(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                    backgroundColor: AppColors.backgroundLight,
                    onTap: () {
                      playground.setQuery(preset['query']!);
                      Navigator.pop(ctx);
                    },
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          preset['title']!,
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                        ),
                        const Icon(Icons.arrow_forward_ios, size: 14, color: AppColors.borderBlack),
                      ],
                    ),
                  ),
                );
              }),
            ],
          ),
        ),
      ),
    );
  }

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
            icon: const Icon(Icons.bookmark_border, color: AppColors.borderBlack),
            tooltip: 'Template Query',
            onPressed: () => _showPresetBottomSheet(context, playground),
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
              style: TextStyle(
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
