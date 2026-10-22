import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../core/widgets/brutalist_card.dart';
import '../../providers/auth_provider.dart';

class HomeTab extends StatelessWidget {
  final Function(int tabIndex) onNavigateToTab;

  const HomeTab({super.key, required this.onNavigateToTab});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final user = auth.user;

    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      appBar: AppBar(
        backgroundColor: AppColors.cardWhite,
        elevation: 0,
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              color: AppColors.primaryYellow,
              child: const Text(
                'SQLENS',
                style: TextStyle(fontWeight: FontWeight.w900, fontSize: 16, letterSpacing: 1),
              ),
            ),
            const SizedBox(width: 8),
            const Text(
              'DASHBOARD',
              style: TextStyle(fontWeight: FontWeight.w900, fontSize: 15),
            ),
          ],
        ),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(2),
          child: Container(color: AppColors.borderBlack, height: 2),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Welcome Card
            BrutalistCard(
              backgroundColor: AppColors.primaryYellow,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'SELAMAT BELAJAR,',
                    style: TextStyle(fontWeight: FontWeight.w900, fontSize: 12, letterSpacing: 0.5),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    user?.name.toUpperCase() ?? 'MAHASISWA',
                    style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 20),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Kuasai cara kerja database relasional secara visual melalui pemrosesan bertahap.',
                    style: TextStyle(fontSize: 13, fontWeight: FontWeight.w500),
                  ),
                  const SizedBox(height: 14),
                  BrutalistButton(
                    text: 'BUKA WORKSPACE PLAYGROUND',
                    backgroundColor: AppColors.cardWhite,
                    icon: const Icon(Icons.code, size: 16),
                    onPressed: () => onNavigateToTab(1), // Go to Playground
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Feature Quick Action Cards
            const Text(
              'FITUR PEMBELAJARAN',
              style: TextStyle(fontWeight: FontWeight.w900, fontSize: 13, letterSpacing: 0.5),
            ),
            const SizedBox(height: 10),

            Row(
              children: [
                Expanded(
                  child: BrutalistCard(
                    padding: const EdgeInsets.all(14),
                    onTap: () => onNavigateToTab(1),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Icon(Icons.terminal, size: 28, color: AppColors.borderBlack),
                        SizedBox(height: 8),
                        Text(
                          'SQL EDITOR',
                          style: TextStyle(fontWeight: FontWeight.w900, fontSize: 13),
                        ),
                        SizedBox(height: 4),
                        Text(
                          'Tulis dan uji query SQL interaktif.',
                          style: TextStyle(fontSize: 11, color: AppColors.textMuted),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: BrutalistCard(
                    padding: const EdgeInsets.all(14),
                    onTap: () => onNavigateToTab(2), // Go to AI Tutor
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Icon(Icons.psychology, size: 28, color: AppColors.borderBlack),
                        SizedBox(height: 8),
                        Text(
                          'AI TUTOR',
                          style: TextStyle(fontWeight: FontWeight.w900, fontSize: 13),
                        ),
                        SizedBox(height: 4),
                        Text(
                          'Bimbingan konsep query tanpa spoiler.',
                          style: TextStyle(fontSize: 11, color: AppColors.textMuted),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            Row(
              children: [
                Expanded(
                  child: BrutalistCard(
                    padding: const EdgeInsets.all(14),
                    onTap: () => onNavigateToTab(3), // Go to History
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Icon(Icons.history, size: 28, color: AppColors.borderBlack),
                        SizedBox(height: 8),
                        Text(
                          'RIWAYAT QUERY',
                          style: TextStyle(fontWeight: FontWeight.w900, fontSize: 13),
                        ),
                        SizedBox(height: 4),
                        Text(
                          'Catatan aktivitas eksekusi tersinkron.',
                          style: TextStyle(fontSize: 11, color: AppColors.textMuted),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: BrutalistCard(
                    padding: const EdgeInsets.all(14),
                    onTap: () => onNavigateToTab(4), // Go to Profile
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Icon(Icons.person_outline, size: 28, color: AppColors.borderBlack),
                        SizedBox(height: 8),
                        Text(
                          'PROFIL AKUN',
                          style: TextStyle(fontWeight: FontWeight.w900, fontSize: 13),
                        ),
                        SizedBox(height: 4),
                        Text(
                          'Identitas akademik dan sesi login.',
                          style: TextStyle(fontSize: 11, color: AppColors.textMuted),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
