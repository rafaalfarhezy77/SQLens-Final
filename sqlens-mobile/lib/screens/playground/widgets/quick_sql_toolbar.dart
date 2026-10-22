import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';

class QuickSqlToolbar extends StatelessWidget {
  final Function(String keyword) onKeywordTap;

  const QuickSqlToolbar({super.key, required this.onKeywordTap});

  static const List<String> _keywords = [
    'SELECT',
    'FROM',
    'WHERE',
    'JOIN',
    'ON',
    'AND',
    'OR',
    '*',
    '=',
    '>=',
    '<=',
    ';',
    "'",
    'GROUP BY',
    'ORDER BY',
    'LIMIT',
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 44,
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: AppColors.backgroundLight,
        border: Border.all(color: AppColors.borderBlack, width: 2),
      ),
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: _keywords.length,
        separatorBuilder: (context, index) => const SizedBox(width: 6),
        itemBuilder: (context, index) {
          final kw = _keywords[index];
          return GestureDetector(
            onTap: () => onKeywordTap(kw),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              alignment: Alignment.center,
              decoration: BoxDecoration(
                color: AppColors.cardWhite,
                border: Border.all(color: AppColors.borderBlack, width: 1.5),
                boxShadow: const [
                  BoxShadow(
                    color: AppColors.borderBlack,
                    offset: Offset(1.5, 1.5),
                    blurRadius: 0,
                  ),
                ],
              ),
              child: Text(
                kw,
                style: const TextStyle(
                  fontWeight: FontWeight.w900,
                  fontSize: 12,
                  fontFamily: 'monospace',
                  color: AppColors.borderBlack,
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
