import 'package:flutter/material.dart';

class AppColors {
  // Neo-Brutalist Core Palette matching SQLens Web
  static const Color primaryYellow = Color(0xFFFFD600);
  static const Color backgroundLight = Color(0xFFF7F7F2);
  static const Color cardWhite = Color(0xFFFFFFFF);
  static const Color borderBlack = Color(0xFF111111);
  static const Color textMain = Color(0xFF111111);
  static const Color textMuted = Color(0xFF555555);

  // Status & Feedback Colors
  static const Color successGreen = Color(0xFF00D084);
  static const Color successGreenLight = Color(0xFFE8F8F0);
  static const Color successGreenDark = Color(0xFF006633);

  static const Color errorRed = Color(0xFFFF4757);
  static const Color errorRedLight = Color(0xFFFFECEF);

  static const Color accentBlue = Color(0xFF3867D6);
  static const Color accentBlueLight = Color(0xFFEBF1FD);

  static const Color accentPurple = Color(0xFF8854D0);

  // Hard Box Shadow for Neo-Brutalism
  static List<BoxShadow> brutalistShadow({double offset = 3.0, Color shadowColor = borderBlack}) {
    return [
      BoxShadow(
        color: shadowColor,
        offset: Offset(offset, offset),
        blurRadius: 0,
        spreadRadius: 0,
      ),
    ];
  }
}
