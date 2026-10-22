import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:sqlens_mobile/main.dart';
import 'package:sqlens_mobile/providers/auth_provider.dart';
import 'package:sqlens_mobile/screens/auth/login_screen.dart';

void main() {
  testWidgets('SQLens Mobile App renders AuthGate loading smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const SqlensApp());
    expect(find.byType(CircularProgressIndicator), findsOneWidget);
  });

  testWidgets('LoginScreen renders brand and login button smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(
      ChangeNotifierProvider(
        create: (_) => AuthProvider(),
        child: const MaterialApp(home: LoginScreen()),
      ),
    );
    await tester.pump();

    expect(find.text('SQLENS'), findsOneWidget);
    expect(find.text('MOBILE'), findsOneWidget);
    expect(find.text('MASUK SEKARANG'), findsOneWidget);
  });
}
