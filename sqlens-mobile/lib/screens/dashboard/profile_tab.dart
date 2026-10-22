import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/api_endpoints.dart';
import '../../core/constants/app_colors.dart';
import '../../core/widgets/brutalist_card.dart';
import '../../providers/auth_provider.dart';

class ProfileTab extends StatelessWidget {
  const ProfileTab({super.key});

  void _showServerSettingsDialog(BuildContext context) {
    final urlController = TextEditingController(text: ApiEndpoints.baseUrl);
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.cardWhite,
        shape: const RoundedRectangleBorder(
          side: BorderSide(color: AppColors.borderBlack, width: 2),
        ),
        title: const Text(
          'PENGATURAN SERVER BACKEND',
          style: TextStyle(fontWeight: FontWeight.w900, fontSize: 16),
        ),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Pilih preset atau masukkan URL backend sesuai perangkat Anda:',
                style: TextStyle(fontSize: 12, color: AppColors.textMuted),
              ),
              const SizedBox(height: 10),
              Wrap(
                spacing: 6,
                runSpacing: 6,
                children: [
                  GestureDetector(
                    onTap: () => urlController.text = 'http://127.0.0.1:8000/v1',
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      color: AppColors.backgroundLight,
                      child: const Text('127.0.0.1 (USB)', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                    ),
                  ),
                  GestureDetector(
                    onTap: () => urlController.text = 'http://192.168.1.7:8000/v1',
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      color: AppColors.backgroundLight,
                      child: const Text('192.168.1.7 (Wi-Fi)', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                    ),
                  ),
                  GestureDetector(
                    onTap: () => urlController.text = 'http://10.0.2.2:8000/v1',
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      color: AppColors.backgroundLight,
                      child: const Text('10.0.2.2 (Emulator)', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              TextField(
                controller: urlController,
                decoration: InputDecoration(
                  filled: true,
                  fillColor: AppColors.backgroundLight,
                  border: OutlineInputBorder(
                    borderSide: const BorderSide(color: AppColors.borderBlack, width: 2),
                    borderRadius: BorderRadius.zero,
                  ),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                ),
                style: const TextStyle(fontSize: 13, fontFamily: 'monospace'),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Batal', style: TextStyle(color: AppColors.borderBlack)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primaryYellow,
              foregroundColor: AppColors.borderBlack,
              side: const BorderSide(color: AppColors.borderBlack, width: 2),
              shape: const RoundedRectangleBorder(borderRadius: BorderRadius.zero),
            ),
            onPressed: () {
              context.read<AuthProvider>().setCustomBaseUrl(urlController.text);
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Server disetel ke: ${urlController.text}')),
              );
            },
            child: const Text('Simpan', style: TextStyle(fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final user = auth.user;

    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      appBar: AppBar(
        backgroundColor: AppColors.cardWhite,
        elevation: 0,
        title: const Text(
          'PROFIL MAHASISWA',
          style: TextStyle(
            fontWeight: FontWeight.w900,
            fontSize: 16,
            color: AppColors.borderBlack,
            letterSpacing: 0.5,
          ),
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
            // User Card
            BrutalistCard(
              backgroundColor: AppColors.cardWhite,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        width: 52,
                        height: 52,
                        decoration: BoxDecoration(
                          color: AppColors.primaryYellow,
                          border: Border.all(color: AppColors.borderBlack, width: 2),
                        ),
                        child: Center(
                          child: Text(
                            user != null && user.name.isNotEmpty ? user.name[0].toUpperCase() : 'M',
                            style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 24),
                          ),
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              user?.name ?? 'Nama Pengguna',
                              style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 17),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              user?.email ?? 'email@sqlens.edu',
                              style: const TextStyle(fontSize: 12, color: AppColors.textMuted),
                            ),
                            const SizedBox(height: 4),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              color: AppColors.backgroundLight,
                              child: Text(
                                'PERAN: ${user?.role.toUpperCase() ?? "MAHASISWA"}',
                                style: const TextStyle(
                                  fontWeight: FontWeight.w900,
                                  fontSize: 10,
                                  fontFamily: 'monospace',
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Server Connection Info
            BrutalistCard(
              backgroundColor: AppColors.cardWhite,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'KONEKSI SERVER BACKEND',
                        style: TextStyle(fontWeight: FontWeight.w900, fontSize: 13, letterSpacing: 0.5),
                      ),
                      GestureDetector(
                        onTap: () => _showServerSettingsDialog(context),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          color: AppColors.primaryYellow,
                          child: const Text('UBAH URL', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 10)),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(10),
                    color: AppColors.backgroundLight,
                    child: Text(
                      ApiEndpoints.baseUrl,
                      style: const TextStyle(fontFamily: 'monospace', fontSize: 12),
                    ),
                  ),
                  const SizedBox(height: 6),
                  const Text(
                    'Pilih IP Wi-Fi PC (192.168.1.7) atau USB (127.0.0.1) untuk HP fisik.',
                    style: TextStyle(fontSize: 11, color: AppColors.textMuted),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Logout Button
            BrutalistButton(
              text: 'KELUAR DARI APLIKASI',
              backgroundColor: AppColors.errorRedLight,
              textColor: AppColors.errorRed,
              icon: const Icon(Icons.logout, size: 16, color: AppColors.errorRed),
              onPressed: () {
                showDialog(
                  context: context,
                  builder: (ctx) => AlertDialog(
                    title: const Text('Konfirmasi Logout'),
                    content: const Text('Apakah Anda yakin ingin keluar dari akun SQLens?'),
                    actions: [
                      TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Batal')),
                      TextButton(
                        onPressed: () {
                          Navigator.pop(ctx);
                          auth.logout();
                        },
                        child: const Text('Keluar', style: TextStyle(color: AppColors.errorRed)),
                      ),
                    ],
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
