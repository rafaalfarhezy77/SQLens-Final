import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/widgets/brutalist_card.dart';
import '../../../providers/playground_provider.dart';

class CustomDatasetBottomSheet extends StatefulWidget {
  const CustomDatasetBottomSheet({super.key});

  static void show(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.cardWhite,
      shape: const RoundedRectangleBorder(
        side: BorderSide(color: AppColors.borderBlack, width: 2),
      ),
      builder: (_) => const CustomDatasetBottomSheet(),
    );
  }

  @override
  State<CustomDatasetBottomSheet> createState() => _CustomDatasetBottomSheetState();
}

class _CustomDatasetBottomSheetState extends State<CustomDatasetBottomSheet> {
  int _activeTab = 0; // 0: CSV, 1: SQL

  // CSV form controllers
  final _csvFilenameController = TextEditingController(text: 'produk_toko.csv');
  final _csvContentController = TextEditingController(
    text: 'id,nama_produk,kategori,harga,stok\n'
        '1,Headphone Bluetooth,Elektronik,450000,20\n'
        '2,Mechanical Keyboard,Elektronik,850000,15\n'
        '3,Tas Ransel Laptop,Aksesoris,320000,30\n'
        '4,Botol Minum Termos,Aksesoris,95000,50\n',
  );

  // SQL form controller
  final _sqlContentController = TextEditingController(
    text: 'CREATE TABLE karyawan (\n'
        '  id INTEGER PRIMARY KEY,\n'
        '  nama VARCHAR(100),\n'
        '  divisi VARCHAR(50),\n'
        '  gaji NUMERIC\n'
        ');\n\n'
        'INSERT INTO karyawan VALUES\n'
        '  (1, \'Ahmad Fauzi\', \'Teknologi\', 8500000),\n'
        '  (2, \'Siti Nurhaliza\', \'Pemasaran\', 7000000),\n'
        '  (3, \'Rian Pratama\', \'Teknologi\', 9000000);\n',
  );

  bool _isUploading = false;
  String? _uploadError;

  @override
  void dispose() {
    _csvFilenameController.dispose();
    _csvContentController.dispose();
    _sqlContentController.dispose();
    super.dispose();
  }

  Future<void> _handleUploadCsv(PlaygroundProvider playground) async {
    final filename = _csvFilenameController.text.trim();
    final content = _csvContentController.text.trim();

    if (filename.isEmpty || content.isEmpty) {
      setState(() {
        _uploadError = 'Nama file dan isi CSV tidak boleh kosong.';
      });
      return;
    }

    setState(() {
      _isUploading = true;
      _uploadError = null;
    });

    final success = await playground.uploadCustomCsv([
      {'filename': filename, 'content': content}
    ]);

    setState(() {
      _isUploading = false;
    });

    if (success && mounted) {
      Navigator.pop(context);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Database kustom dari CSV berhasil diimpor!'),
          backgroundColor: AppColors.successGreenDark,
        ),
      );
    } else if (mounted) {
      setState(() {
        _uploadError = playground.errorMessage ?? 'Gagal mengunggah CSV.';
      });
    }
  }

  Future<void> _handleUploadSql(PlaygroundProvider playground) async {
    final sql = _sqlContentController.text.trim();

    if (sql.isEmpty) {
      setState(() {
        _uploadError = 'Skrip SQL tidak boleh kosong.';
      });
      return;
    }

    setState(() {
      _isUploading = true;
      _uploadError = null;
    });

    final success = await playground.uploadCustomSql(sql);

    setState(() {
      _isUploading = false;
    });

    if (success && mounted) {
      Navigator.pop(context);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Skrip SQL berhasil dieksekusi ke database kustom!'),
          backgroundColor: AppColors.successGreenDark,
        ),
      );
    } else if (mounted) {
      setState(() {
        _uploadError = playground.errorMessage ?? 'Gagal mengeksekusi SQL.';
      });
    }
  }

  Future<void> _handleReset(PlaygroundProvider playground) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Reset Database Kustom?'),
        content: const Text('Tabel kustom Anda akan dihapus dan dikembalikan ke dataset edukasi bawaan.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Batal')),
          TextButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('Reset')),
        ],
      ),
    );

    if (confirm == true) {
      await playground.resetCustomDataset();
      if (mounted) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Database kustom berhasil direset ke bawaan.')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final playground = context.watch<PlaygroundProvider>();

    return Padding(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
      ),
      child: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
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
                    'UNGGAH DATABASE KUSTOM',
                    style: TextStyle(fontWeight: FontWeight.w900, fontSize: 14, letterSpacing: 0.5),
                  ),
                  GestureDetector(
                    onTap: () => Navigator.pop(context),
                    child: const Icon(Icons.close, size: 20, color: AppColors.borderBlack),
                  ),
                ],
              ),
            ),

            // Tab Switcher (CSV vs SQL)
            Container(
              decoration: const BoxDecoration(
                border: Border(bottom: BorderSide(color: AppColors.borderBlack, width: 2)),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: GestureDetector(
                      onTap: () => setState(() => _activeTab = 0),
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        color: _activeTab == 0 ? AppColors.cardWhite : AppColors.backgroundLight,
                        child: Center(
                          child: Text(
                            'UNGGAH CSV',
                            style: TextStyle(
                              fontWeight: FontWeight.w900,
                              fontSize: 12,
                              color: _activeTab == 0 ? AppColors.borderBlack : AppColors.textMuted,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                  Expanded(
                    child: GestureDetector(
                      onTap: () => setState(() => _activeTab = 1),
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        decoration: BoxDecoration(
                          color: _activeTab == 1 ? AppColors.cardWhite : AppColors.backgroundLight,
                          border: const Border(left: BorderSide(color: AppColors.borderBlack, width: 2)),
                        ),
                        child: Center(
                          child: Text(
                            'SKRIP DDL SQL',
                            style: TextStyle(
                              fontWeight: FontWeight.w900,
                              fontSize: 12,
                              color: _activeTab == 1 ? AppColors.borderBlack : AppColors.textMuted,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Error alert
                  if (_uploadError != null)
                    Container(
                      padding: const EdgeInsets.all(10),
                      margin: const EdgeInsets.only(bottom: 12),
                      color: AppColors.errorRedLight,
                      child: Text(
                        _uploadError!,
                        style: const TextStyle(color: AppColors.errorRed, fontSize: 12, fontWeight: FontWeight.bold),
                      ),
                    ),

                  if (_activeTab == 0) ...[
                    // Tab 0: CSV
                    const Text('Nama File CSV', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                    const SizedBox(height: 4),
                    TextField(
                      controller: _csvFilenameController,
                      style: const TextStyle(fontFamily: 'monospace', fontSize: 12),
                      decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                      ),
                    ),
                    const SizedBox(height: 12),
                    const Text('Konten CSV (Header baris 1, data baris selanjutnya)',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                    const SizedBox(height: 4),
                    TextField(
                      controller: _csvContentController,
                      maxLines: 6,
                      style: const TextStyle(fontFamily: 'monospace', fontSize: 12),
                      decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        contentPadding: EdgeInsets.all(10),
                      ),
                    ),
                    const SizedBox(height: 16),
                    BrutalistButton(
                      text: 'IMPOR DATABASE CSV',
                      icon: const Icon(Icons.upload_file, size: 16),
                      isLoading: _isUploading,
                      onPressed: () => _handleUploadCsv(playground),
                    ),
                  ] else ...[
                    // Tab 1: SQL Script
                    const Text('Skrip SQL (CREATE TABLE & INSERT INTO saja)',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                    const SizedBox(height: 4),
                    TextField(
                      controller: _sqlContentController,
                      maxLines: 7,
                      style: const TextStyle(fontFamily: 'monospace', fontSize: 12),
                      decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        contentPadding: EdgeInsets.all(10),
                      ),
                    ),
                    const SizedBox(height: 16),
                    BrutalistButton(
                      text: 'EKSEKUSI SKRIP SQL',
                      icon: const Icon(Icons.code, size: 16),
                      isLoading: _isUploading,
                      onPressed: () => _handleUploadSql(playground),
                    ),
                  ],

                  // Reset button if custom dataset exists
                  if (playground.customDatasetInfo?.hasCustomDataset == true) ...[
                    const SizedBox(height: 12),
                    OutlinedButton.icon(
                      style: OutlinedButton.styleFrom(
                        foregroundColor: AppColors.errorRed,
                        side: const BorderSide(color: AppColors.errorRed, width: 1.5),
                        shape: const RoundedRectangleBorder(),
                      ),
                      icon: const Icon(Icons.delete_outline, size: 16),
                      label: const Text('Hapus Database Kustom & Kembali ke Bawaan'),
                      onPressed: () => _handleReset(playground),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
