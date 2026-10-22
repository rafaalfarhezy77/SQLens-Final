class UserModel {
  final String id;
  final String name;
  final String email;
  final String role;
  final String? accessToken;

  UserModel({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    this.accessToken,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      email: json['email']?.toString() ?? '',
      role: json['role']?.toString() ?? 'mahasiswa',
      accessToken: json['accessToken']?.toString() ?? json['access_token']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'role': role,
      'accessToken': accessToken,
    };
  }
}
