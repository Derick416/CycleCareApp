import 'package:flutter/material.dart';
import 'package:table_calendar/table_calendar.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_downloader/flutter_downloader.dart';
import 'package:path_provider/path_provider.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:flutter/foundation.dart'; // for kIsWeb


void main() async {
  // Ensures binding is initialized before plugins
  WidgetsFlutterBinding.ensureInitialized();

  // ✅ Only initialize FlutterDownloader on Android/iOS
  if (!kIsWeb) {
    await FlutterDownloader.initialize(
      debug: true, // set false in production
      ignoreSsl: true,
    );
  }

  // Run your app
  runApp(const CycleCareApp());
}
// --------CycleCareApp--------
class CycleCareApp extends StatelessWidget {
  const CycleCareApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false, // ✅ removes the DEBUG banner
      title: 'CycleCare',
      theme: ThemeData(
        primarySwatch: Colors.orange,
        useMaterial3: true,
      ),
      home: const SplashPage(), // ✅ Start with SplashPage
    );
  }
}

// --------SplashPage--------

class SplashPage extends StatefulWidget {
  const SplashPage({super.key});

  @override
  _SplashPageState createState() => _SplashPageState();
}

class _SplashPageState extends State<SplashPage>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _opacityAnimation;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();

    // Animation controller for 2 seconds
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    );

    // Fade from 0 → 1
    _opacityAnimation = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeIn),
    );

    // Scale from 0.8 → 1.0
    _scaleAnimation = Tween<double>(begin: 0.8, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOut),
    );

    // Start animation
    _controller.forward();

    // Navigate to LoginScreen after 5 seconds
    Future.delayed(const Duration(seconds: 5), () {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const LoginScreen()),
      );
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color.fromARGB(255, 5, 5, 5),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // ✅ Animated image
            FadeTransition(
              opacity: _opacityAnimation,
              child: ScaleTransition(
                scale: _scaleAnimation,
                child: Image.asset(
                  'assets/images/logo.png',
                  width: 200,
                  height: 200,
                ),
              ),
            ),
            const SizedBox(height: 20),
            const Text(
              "WOMEN'S HEALTH",
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 32,
                fontWeight: FontWeight.bold,
                color: Color.fromARGB(255, 247, 99, 185),
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              "Stay updated about your reproductive health",
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 20,
                fontStyle: FontStyle.italic,
                color: Color.fromARGB(255, 247, 99, 185),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ---------------- LOGIN SCREEN ----------------
class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool rememberMe = false;

  void _login() {
    final username = _usernameController.text.trim();
    final password = _passwordController.text.trim();
    if (username.isNotEmpty && password.isNotEmpty) {
      if (rememberMe) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Login successful — Remember Me enabled")),
        );
      }
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => HomePage(username: username)),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Enter username and password")),
      );
    }
  }

  void _goToSignUp() {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const SignUpScreen()),
    );
  }

  void _forgotPassword() {
    showDialog(
      context: context,
      builder: (context) {
        final TextEditingController emailController = TextEditingController();
        return AlertDialog(
          title: const Text("Forgot Password"),
          content: Card(
            elevation: 4,
            child: Padding(
              padding: const EdgeInsets.all(12.0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text(
                    "Enter your registered email to reset your password:",
                    style: TextStyle(fontSize: 14),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: emailController,
                    decoration: const InputDecoration(
                      labelText: "Email",
                      border: OutlineInputBorder(),
                    ),
                  ),
                ],
              ),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text("Cancel"),
            ),
            ElevatedButton(
              onPressed: () {
                final email = emailController.text.trim();
                if (email.isNotEmpty) {
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text("Password reset link sent to $email")),
                  );
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text("Please enter your email")),
                  );
                }
              },
              child: const Text("Reset"),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Center(
          child: SingleChildScrollView(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text("Cycle Care",
                    style: TextStyle(
                        fontSize: 32,
                        fontWeight: FontWeight.bold,
                        color: Colors.pinkAccent)),
                const SizedBox(height: 32),
                TextField(
                  controller: _usernameController,
                  decoration: const InputDecoration(
                      labelText: "Username", border: OutlineInputBorder()),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _passwordController,
                  obscureText: true,
                  decoration: const InputDecoration(
                      labelText: "Password", border: OutlineInputBorder()),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Checkbox(
                      value: rememberMe,
                      activeColor: Colors.pinkAccent,
                      onChanged: (val) {
                        setState(() => rememberMe = val ?? false);
                      },
                    ),
                    const Text("Remember Me"),
                  ],
                ),
                const SizedBox(height: 24),
                ElevatedButton(onPressed: _login, child: const Text("Log In")),
                TextButton(
                    onPressed: _goToSignUp,
                    child: const Text("Don't have an account? Sign up")),
                TextButton(
                    onPressed: _forgotPassword,
                    child: const Text("Forgot Password?")),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// ---------------- SIGN UP SCREEN ----------------
class SignUpScreen extends StatefulWidget {
  const SignUpScreen({super.key});
  @override
  _SignUpScreenState createState() => _SignUpScreenState();
}

class _SignUpScreenState extends State<SignUpScreen> {
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmController = TextEditingController();

  void _register() {
    if (_usernameController.text.isEmpty ||
        _passwordController.text.isEmpty ||
        _confirmController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Fill in all required fields")));
      return;
    }
    if (_passwordController.text != _confirmController.text) {
      ScaffoldMessenger.of(context)
          .showSnackBar(const SnackBar(content: Text("Passwords do not match")));
      return;
    }
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
          builder: (context) => HomePage(username: _usernameController.text)),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Create Account")),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(children: [
          TextField(
              controller: _usernameController,
              decoration: const InputDecoration(
                  labelText: "Username", border: OutlineInputBorder())),
          const SizedBox(height: 16),
          TextField(
              controller: _passwordController,
              obscureText: true,
              decoration: const InputDecoration(
                  labelText: "Password", border: OutlineInputBorder())),
          const SizedBox(height: 16),
          TextField(
              controller: _confirmController,
              obscureText: true,
              decoration: const InputDecoration(
                  labelText: "Confirm Password", border: OutlineInputBorder())),
          const SizedBox(height: 24),
          ElevatedButton(onPressed: _register, child: const Text("Create Account")),
        ]),
      ),
    );
  }
}
// ---------------- HOME PAGE ----------------
class HomePage extends StatefulWidget {
  final String username;
  const HomePage({super.key, required this.username});
  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _selectedIndex = 0;

  final pages = const [
    StatusPage(),
    MhmInfoPage(),
    HealthcarePage(),
    SettingsPage(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Welcome, ${widget.username}")),
      body: pages[_selectedIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: (index) => setState(() => _selectedIndex = index),
        selectedItemColor: Colors.pinkAccent,
        unselectedItemColor: Colors.grey,
        showUnselectedLabels: true,
        type: BottomNavigationBarType.fixed,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.favorite), label: "Status"),
          BottomNavigationBarItem(icon: Icon(Icons.info), label: "MHM Info"),
          BottomNavigationBarItem(
              icon: Icon(Icons.local_hospital), label: "Healthcare"),
          BottomNavigationBarItem(icon: Icon(Icons.settings), label: "Settings"),
        ],
      ),
    );
  }
}

// ---------------- STATUS PAGE ----------------

class StatusPage extends StatefulWidget {
  const StatusPage({super.key});

  @override
  _StatusPageState createState() => _StatusPageState();
}

class _StatusPageState extends State<StatusPage> {
  DateTime? _periodStart;
  DateTime? _nextPeriod;
  final Map<DateTime, String> _events = {};
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay;
  bool _showCalendar = false;

  final int _cycleLength = 28;

  DateTime _normalize(DateTime date) => DateTime(date.year, date.month, date.day);

  void _generateCycle(DateTime start) {
    _events.clear();

    for (int i = 0; i < _cycleLength; i++) {
      DateTime day = _normalize(start.add(Duration(days: i)));

      if (i < 4) {
        _events[day] = "Period"; // Days 1–4
      } else if (i < 8) {
        _events[day] = "Safe"; // ✅ Days 5–8 are safe
      } else if (i < 17) {
        _events[day] = "Unsafe"; // Days 9–17
      } else {
        _events[day] = "Safe"; // Days 18–28
      }
    }

    _nextPeriod = start.add(Duration(days: _cycleLength));
    _events[_normalize(_nextPeriod!)] = "NextPeriod";
  }

  Color _getDayColor(DateTime day) {
    final normalized = _normalize(day);
    switch (_events[normalized]) {
      case "Period":
        return Colors.red;
      case "Unsafe":
        return Colors.orange;
      case "Safe":
        return Colors.green;
      case "NextPeriod":
        return Colors.purple;
      default:
        return Colors.transparent;
    }
  }

  @override
  Widget build(BuildContext context) {
    bool crossesNextMonth = false;
    if (_periodStart != null) {
      DateTime cycleEnd = _periodStart!.add(Duration(days: _cycleLength - 1));
      crossesNextMonth = cycleEnd.month != _periodStart!.month;
    }

    return Column(
      children: [
        if (_periodStart == null)
          Expanded(
            child: Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  ElevatedButton(
                    onPressed: () {
                      setState(() {
                        _showCalendar = !_showCalendar;
                        _events.clear(); // reset colors before selection
                      });
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.pinkAccent,
                      shape: const StadiumBorder(),
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                    ),
                    child: const Text("Enter Period Start Date"),
                  ),
                  const SizedBox(height: 16),
                  if (_showCalendar)
                    SizedBox(
                      height: 400,
                      child: TableCalendar(
                        firstDay: DateTime.utc(2020, 1, 1),
                        lastDay: DateTime.utc(2030, 12, 31),
                        focusedDay: DateTime.now(),
                        selectedDayPredicate: (day) =>
                            _selectedDay != null && isSameDay(_selectedDay, day),
                        onDaySelected: (selectedDay, focusedDay) {
                          setState(() {
                            _selectedDay = selectedDay;
                            _periodStart = _normalize(selectedDay);
                            _generateCycle(_periodStart!);
                            _focusedDay = focusedDay;
                            _showCalendar = false;
                          });
                        },
                        calendarFormat: CalendarFormat.month,
                        headerStyle: const HeaderStyle(
                          formatButtonVisible: false, // ✅ removes "2 weeks" label
                        ),
                        calendarBuilders: CalendarBuilders(
                          defaultBuilder: (context, day, focusedDay) {
                            final color = _getDayColor(day);
                            if (color != Colors.transparent) {
                              return Container(
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: color.withOpacity(0.7),
                                ),
                                child: Center(
                                  child: Text(
                                    "${day.day}",
                                    style: const TextStyle(color: Colors.white),
                                  ),
                                ),
                              );
                            }
                            return Center(child: Text("${day.day}"));
                          },
                          selectedBuilder: (context, day, focusedDay) {
                            final color = _getDayColor(day);
                            return Container(
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: color.withOpacity(0.9),
                                border: Border.all(color: Colors.white, width: 2),
                              ),
                              child: Center(
                                child: Text(
                                  "${day.day}",
                                  style: const TextStyle(
                                      color: Colors.white,
                                      fontWeight: FontWeight.bold),
                                ),
                              ),
                            );
                          },
                        ),
                      ),
                    ),
                ],
              ),
            ),
          )
        else
          Expanded(
            child: Column(
              children: [
                Expanded(
                  child: ListView(
                    children: [
                      TableCalendar(
                        firstDay: DateTime.utc(2020, 1, 1),
                        lastDay: DateTime.utc(2030, 12, 31),
                        focusedDay: _focusedDay,
                        selectedDayPredicate: (day) =>
                            _selectedDay != null && isSameDay(_selectedDay, day),
                        onDaySelected: (selectedDay, focusedDay) {
                          setState(() {
                            _selectedDay = selectedDay;
                            _focusedDay = focusedDay;
                          });
                        },
                        calendarFormat: CalendarFormat.month,
                        headerStyle: const HeaderStyle(
                          formatButtonVisible: false, // ✅ removes "2 weeks" label
                        ),
                        calendarBuilders: CalendarBuilders(
                          defaultBuilder: (context, day, focusedDay) {
                            final color = _getDayColor(day);
                            if (color != Colors.transparent) {
                              return Container(
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: color.withOpacity(0.7),
                                ),
                                child: Center(
                                  child: Text(
                                    "${day.day}",
                                    style: const TextStyle(color: Colors.white),
                                  ),
                                ),
                              );
                            }
                            return Center(child: Text("${day.day}"));
                          },
                          selectedBuilder: (context, day, focusedDay) {
                            final color = _getDayColor(day);
                            return Container(
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: color.withOpacity(0.9),
                                border: Border.all(color: Colors.white, width: 2),
                              ),
                              child: Center(
                                child: Text(
                                  "${day.day}",
                                  style: const TextStyle(
                                      color: Colors.white,
                                      fontWeight: FontWeight.bold),
                                ),
                              ),
                            );
                          },
                        ),
                      ),
                      if (crossesNextMonth)
                        TableCalendar(
                          firstDay: DateTime.utc(2020, 1, 1),
                          lastDay: DateTime.utc(2030, 12, 31),
                          focusedDay: DateTime(
                              _periodStart!.year, _periodStart!.month + 1, 1),
                          selectedDayPredicate: (day) =>
                              _selectedDay != null && isSameDay(_selectedDay, day),
                          onDaySelected: (selectedDay, focusedDay) {
                            setState(() {
                              _selectedDay = selectedDay;
                              _focusedDay = focusedDay;
                            });
                          },
                          calendarFormat: CalendarFormat.month,
                          headerStyle: const HeaderStyle(
                            formatButtonVisible: false, // ✅ removes "2 weeks" label
                          ),
                          calendarBuilders: CalendarBuilders(
                            defaultBuilder: (context, day, focusedDay) {
                              final color = _getDayColor(day);
                              if (color != Colors.transparent) {
                                return Container(
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    color: color.withOpacity(0.7),
                                  ),
                                  child: Center(
                                    child: Text(
                                      "${day.day}",
                                      style: const TextStyle(color: Colors.white),
                                    ),
                                  ),
                                );
                              }
                              return Center(child: Text("${day.day}"));
                            },
                            selectedBuilder: (context, day, focusedDay) {
                              final color = _getDayColor(day);
                              return Container(
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: color.withOpacity(0.9),
                                  border: Border.all(color: Colors.white, width: 2),
                                ),
                                child: Center(
                                  child: Text(
                                    "${day.day}",
                                    style: const TextStyle(
                                        color: Colors.white,
                                        fontWeight: FontWeight.bold),
                                  ),
                                ),
                              );
                            },
                          ),
                        ),
                    ],
                  ),
                ),
                const SizedBox(height: 8),
                const Text("Key:",
                    style: TextStyle(fontWeight: FontWeight.bold, color: Colors.pink)),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: const [
                    Icon(Icons.circle, color: Colors.red, size: 16),
                    SizedBox(width: 4),
                    Text("period"),
                    SizedBox(width: 16),
                    Icon(Icons.circle, color: Colors.green, size: 16),
                    SizedBox(width: 4),
                    Text("safe"),
                    SizedBox(width: 16),
                    Icon(Icons.circle, color: Colors.orange, size: 16),
                    SizedBox(width: 4),
                    Text("unsafe"),
                    SizedBox(width: 16),
                    Icon(Icons.circle, color: Colors.purple, size: 16),
                    SizedBox(width: 4),
                    Text("Next Period"),
                  ],
                ),
                if (_nextPeriod != null)
                  Padding(
                    padding: const EdgeInsets.all(12.0),
                    child: Text(
                      "Next Expected Period: ${_nextPeriod!.day}-${_nextPeriod!.month}-${_nextPeriod!.year}",
                      style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.pink),
                    ),
                  ),
              ],
            ),
          ),
      ],
    );
  }
}
                           
                        
// ---------------- MHM INFO PAGE ----------------

class MhmInfoPage extends StatefulWidget {
  const MhmInfoPage({super.key});

  @override
  State<MhmInfoPage> createState() => _MhmInfoPageState();
}

class _MhmInfoPageState extends State<MhmInfoPage> {
  final Map<String, int> _downloadProgress = {};

  Future<void> _downloadPdf(BuildContext context, String url, String fileName) async {
    if (kIsWeb) {
      // ✅ Web: open PDF in a new browser tab
      final uri = Uri.parse(url);
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.inAppWebView);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Unable to open PDF")),
        );
      }
      return;
    }

    // ✅ Android/iOS: download and open
    final status = await Permission.storage.request();
    if (status.isGranted) {
      final dir = await getApplicationDocumentsDirectory();
      final taskId = await FlutterDownloader.enqueue(
        url: url,
        savedDir: dir.path,
        fileName: fileName,
        showNotification: true,
        openFileFromNotification: true,
      );

      setState(() {
        _downloadProgress[fileName] = 0;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Downloading $fileName...")),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Storage permission denied")),
      );
    }
  }

  // Info card builder
  Widget _buildInfoCard(String title, String description, IconData icon) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      child: ListTile(
        leading: Icon(icon, color: Colors.pinkAccent),
        title: Text(title,
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        subtitle: Text(description),
      ),
    );
  }

  // Download card builder
  Widget _buildDownloadCard(BuildContext context, String title, String description,
      String size, String url, String fileName) {
    final progress = _downloadProgress[fileName] ?? 0;

    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      child: Column(
        children: [
          ListTile(
            leading: const Icon(Icons.picture_as_pdf, color: Colors.pinkAccent),
            title: Text(title,
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            subtitle: Text("$description\nSize: $size"),
            trailing: ElevatedButton(
              onPressed: () => _downloadPdf(context, url, fileName),
              style: ElevatedButton.styleFrom(backgroundColor: Colors.pinkAccent),
              child: const Text("Download"),
            ),
          ),
          if (progress > 0 && progress < 100 && !kIsWeb)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: LinearProgressIndicator(
                value: progress / 100,
                backgroundColor: Colors.grey.shade300,
                color: Colors.pinkAccent,
              ),
            ),
          if (progress == 100 && !kIsWeb)
            const Padding(
              padding: EdgeInsets.all(8.0),
              child: Text("Download complete!", style: TextStyle(color: Colors.green)),
            ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return ListView(
      children: [
        const Padding(
          padding: EdgeInsets.all(16.0),
          child: Text(
            "Menstrual Health Information",
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
        ),
        _buildInfoCard("What to Expect",
            "Your cycle is a natural part of health. Tracking helps you prepare and understand your body better.",
            Icons.info),
        _buildInfoCard("Managing Your Period",
            "Stay hydrated, rest when needed, and use clean products. It's okay to take things slow during this time.",
            Icons.favorite),
        _buildInfoCard("Supplies You May Need",
            "Pads, tampons, or reusable products. Pain relief if needed. Clean water and soap for hygiene.",
            Icons.inventory),
        _buildInfoCard("When to Seek Help",
            "If you experience severe pain, very heavy flow, or have concerns, reach out to a healthcare provider.",
            Icons.local_hospital),
        const Padding(
          padding: EdgeInsets.all(16.0),
          child: Text(
            "Downloadable Resources",
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
        ),
        _buildDownloadCard(
  context,
  "Complete Guide to Menstrual Health",
  "Comprehensive menstrual health and hygiene guidance by UNICEF",
  "2.3 MB",
  "https://www.unicef.org/media/91341/file/Guidance%20on%20Menstrual%20Health%20and%20Hygiene%202019.pdf",
  "menstrual_health.pdf",
),

_buildDownloadCard(
  context,
  "Nutrition & Exercise Tips",
  "Scientific insights on how diet and physical activity affect menstrual cycles",
  "1.8 MB",
  "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6775480/pdf/biolsport-14-4-251.pdf",
  "nutrition_tips.pdf",
),

_buildDownloadCard(
  context,
  "Understanding the Menstrual Cycle",
  "Phases, hormones, and safe/unsafe days",
  "1.2 MB",
  "https://www.gynaecologyjournal.com/articles/1581/9-1-177-180.pdf",
  "menstrual_cycle.pdf",
),

_buildDownloadCard(
  context,
  "Hygiene Best Practices",
  "WHO guidance on menstrual hygiene and safe practices",
  "2.5 MB",
  "https://apps.who.int/iris/bitstream/handle/10665/329948/9789241515630-eng.pdf",
  "hygiene.pdf",
),


_buildDownloadCard(
  context,
  "Mental Health & Periods",
  "BMJ Mental Health journal article on emotional wellbeing during menstrual cycles",
  "1.5 MB",
  "https://mentalhealth.bmj.com/content/28/1/1.full.pdf",
  "mental_health.pdf",
),
      ],
    );
  }
}
                    
// ---------------- HEALTHCARE PAGE ----------------

class HealthcarePage extends StatelessWidget {
  const HealthcarePage({super.key});

  Widget _buildResourceCard(BuildContext context, String title, String description,
      IconData icon, Widget page) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      child: ListTile(
        leading: Icon(icon, color: Colors.pinkAccent),
        title: Text(title,
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        subtitle: Text(description),
        trailing: const Icon(Icons.arrow_forward_ios, color: Colors.pinkAccent),
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => page),
          );
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return ListView(
      children: [
        const Padding(
          padding: EdgeInsets.all(16.0),
          child: Text(
            "Healthcare Resources",
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
        ),

        _buildResourceCard(
          context,
          "Find a Gynecologist Near You",
          "Search for certified gynecologists in Uganda and abroad.",
          Icons.location_on,
          const GynecologistPage(),
        ),
        _buildResourceCard(
          context,
          "International Gynecology Network",
          "Access global gynecology experts and resources.",
          Icons.public,
          const InternationalNetworkPage(),
        ),
        _buildResourceCard(
          context,
          "Kabale Regional Referral Hospital",
          "Menstrual health and gynecology services in Kabale district.",
          Icons.local_hospital,
          const KabaleHospitalPage(),
        ),
        _buildResourceCard(
          context,
          "Rugarama Hospital Kabale",
          "Community hospital offering reproductive health services.",
          Icons.local_hospital,
          const RugaramaHospitalPage(),
        ),

        // Women's Health card
        _buildResourceCard(
          context,
          "Women's Health",
          "What you need to know about your menstrual cycle",
          Icons.favorite,
          const WomensHealthPage(),
        ),

        const Padding(
          padding: EdgeInsets.all(16.0),
          child: Text(
            "Advising Quotes",
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
        ),
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
          child: Text(
            "\"Your health is your wealth — never hesitate to seek care.\"",
            style: TextStyle(fontStyle: FontStyle.italic, color: Colors.grey),
          ),
        ),
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
          child: Text(
            "\"Strong women prioritize their well‑being; visiting a doctor is a sign of strength.\"",
            style: TextStyle(fontStyle: FontStyle.italic, color: Colors.grey),
          ),
        ),
      ],
    );
  }
}

// ---------------- INDIVIDUAL PAGES ----------------


class GynecologistPage extends StatelessWidget {
  const GynecologistPage({super.key});

  Future<void> _openLink(String url) async {
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  Future<void> _callNumber(String number) async {
    final uri = Uri(scheme: 'tel', path: number);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Find a Gynecologist")),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text(
            "Certified gynecologists across Uganda and abroad provide consultations for reproductive health, fertility, menstrual disorders, and preventive screenings.",
            style: TextStyle(fontSize: 16),
          ),
          const SizedBox(height: 16),

          // Dr. Sarah Nansubuga
          Card(
            child: ListTile(
              leading: const Icon(Icons.person, color: Colors.pink),
              title: const Text("Dr. Sarah Nansubuga"),
              subtitle: const Text("Specialist in reproductive health, Kampala"),
              trailing: Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  InkWell(
                    onTap: () => _callNumber("+256772123456"),
                    child: const Text(
                      "Phone: +256 772 123456",
                      style: TextStyle(
                        color: Colors.blue,
                        decoration: TextDecoration.underline,
                      ),
                    ),
                  ),
                  InkWell(
                    onTap: () => _openLink("https://www.medpages.info/specialists/gynecologists"),
                    child: const Text(
                      "Website: Medpages Directory",
                      style: TextStyle(
                        color: Colors.blue,
                        decoration: TextDecoration.underline,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Dr. James Okello
          Card(
            child: ListTile(
              leading: const Icon(Icons.person, color: Colors.pink),
              title: const Text("Dr. James Okello"),
              subtitle: const Text("Obstetrician/Gynecologist, Entebbe"),
              trailing: Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  InkWell(
                    onTap: () => _callNumber("+256701654321"),
                    child: const Text(
                      "Phone: +256 701 654321",
                      style: TextStyle(
                        color: Colors.blue,
                        decoration: TextDecoration.underline,
                      ),
                    ),
                  ),
                  InkWell(
                    onTap: () => _openLink("https://www.medpages.info/specialists/gynecologists"),
                    child: const Text(
                      "Website: Medpages Directory",
                      style: TextStyle(
                        color: Colors.blue,
                        decoration: TextDecoration.underline,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}


class HospitalPage extends StatelessWidget {
  const HospitalPage({super.key});

  Future<void> _openLink(String url) async {
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  Future<void> _callNumber(String number) async {
    final uri = Uri(scheme: 'tel', path: number);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Hospitals")),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Shiloh Hospital Najjera
          Card(
            child: ListTile(
              leading: const Icon(Icons.local_hospital, color: Colors.red),
              title: const Text("Shiloh Hospital Najjera"),
              subtitle: const Text("Community hospital offering reproductive health services."),
              trailing: Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  InkWell(
                    onTap: () => _callNumber("+256703987654"),
                    child: const Text(
                      "Phone: +256 703 987654",
                      style: TextStyle(color: Colors.blue, decoration: TextDecoration.underline),
                    ),
                  ),
                  InkWell(
                    onTap: () => _openLink("https://www.shilohhospital.org"),
                    child: const Text(
                      "Website: Shiloh Hospital",
                      style: TextStyle(color: Colors.blue, decoration: TextDecoration.underline),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Kabale Regional Referral Hospital
          Card(
            child: ListTile(
              leading: const Icon(Icons.local_hospital, color: Colors.red),
              title: const Text("Kabale Regional Referral Hospital"),
              subtitle: const Text("Government referral hospital with obstetrics, gynecology, antenatal care, and emergency cesarean services"),
              trailing: Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  InkWell(
                    onTap: () => _callNumber("+256486422006"),
                    child: const Text(
                      "Phone: +256 486 422006",
                      style: TextStyle(color: Colors.blue, decoration: TextDecoration.underline),
                    ),
                  ),
                  InkWell(
                    onTap: () => _callNumber("+256757320146"),
                    child: const Text(
                      "Alt: +256 757 320146",
                      style: TextStyle(color: Colors.blue, decoration: TextDecoration.underline),
                    ),
                  ),
                  InkWell(
                    onTap: () => _openLink("https://health.go.ug/hospitals/kabale-regional-referral-hospital"),
                    child: const Text(
                      "Website: health.go.ug",
                      style: TextStyle(color: Colors.blue, decoration: TextDecoration.underline),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}


class InternationalNetworkPage extends StatelessWidget {
  const InternationalNetworkPage({super.key});

  Future<void> _openLink(String url) async {
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("International Gynecology Network")),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text(
             "The International Federation of Gynecology and Obstetrics (FIGO) is the world’s largest alliance of national societies of obstetricians and gynecologists. "
          "Founded in 1954, FIGO represents over 130 member societies worldwide and works to advance women’s health through advocacy, education, and global collaboration.",
              style: TextStyle(fontSize: 16)),
          const Text("Overview:", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          const SizedBox(height: 8),
        const Text("Headquarters: London, UK"),
        const SizedBox(height: 8),
        const Text("Membership: 132 national societies across more than 100 countries"),
        const SizedBox(height: 8),
        const Text("Focus Areas: Maternal health, gynecological cancers, family planning, safe abortion, and newborn care"),
        const SizedBox(height: 8),
        const Text("Publications: International Journal of Gynecology & Obstetrics (IJGO)"),
        const SizedBox(height: 8),
        const Text("Events: FIGO World Congress held every three years (next in Montréal, Canada, 2027)"),
        const SizedBox(height: 16),

        const Text("Contact Info:", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        const SizedBox(height: 8),
          const Text("Phone: +44 (0)20 7928 1166"),
          const SizedBox(height: 8),
          const Text("Email: figo@figo.org"),
          const SizedBox(height: 8),
          const Text("Address: FIGO House, Suite 3, Waterloo Court, London SE1 8ST, UK"),
          const SizedBox(height: 8),
          InkWell(
            onTap: () => _openLink("https://www.figo.org/"),
            child: const Text("Website: FIGO Official Site",
                style: TextStyle(color: Colors.blue)),
          ),
        ],
      ),
    );
  }
}

class KabaleHospitalPage extends StatelessWidget {
  const KabaleHospitalPage({super.key});

  Future<void> _openLink(String url) async {
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Kabale Regional Referral Hospital")),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text(
              "Kabale Regional Referral Hospital is a government facility offering obstetrics, gynecology, antenatal care, family planning, and cervical cancer screening.",
              style: TextStyle(fontSize: 16)),
              const SizedBox(height: 8),
            const Text("Key Services & Details:",
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 8),
          const Text("Specialist Staff: The hospital has staff specializing in obstetrics and gynecology, such as Dr. Hillary Aheisibwe (Obstetrician/Gynecologist) and Dr. Godfrey Bandoga."),
          const SizedBox(height: 8),
          const Text("Services Offered: Maternal and child health services, including consultations, antenatal care, labor and delivery, and gynecological wards."),
        const SizedBox(height: 8),
        const Text("Emergency Care: The hospital provides comprehensive emergency obstetric care, including cesarean sections."),
        const SizedBox(height: 8),
        const Text("Teaching Hospital: It is affiliated with the Kabale University School of Medicine, Department of Obstetrics & Gynaecology."),
        const SizedBox(height: 16),
          const Text("Contact Info:", style: TextStyle(fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          const Text(" Phone: +256 486 422006"),
          const SizedBox(height: 8),
          const Text(" Alternative: +256 757 320146"),
          const SizedBox(height: 8),
          const Text(" Address: Corryndon Road, Kabale, Uganda"),
          const SizedBox(height: 8),
          InkWell(
            onTap: () => _openLink("https://health.go.ug/hospitals/kabale-regional-referral-hospital"),
            child: const Text("Website: Kabale Regional ReferralHospital",
                style: TextStyle(color: Colors.blue)),
          ),
        ],
      ),
    );
  }
}

class RugaramaHospitalPage extends StatelessWidget {
  const RugaramaHospitalPage({super.key});

  Future<void> _openLink(String url) async {
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }
@override
Widget build(BuildContext context) {
  return Scaffold(
    appBar: AppBar(title: const Text("Rugarama Hospital Kabale")),
    body: ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text(
          "Rugarama Hospital in Kabale offers comprehensive gynecological services and has a specialist gynecologist available for consultations.",
          style: TextStyle(fontSize: 16),
        ),
        const SizedBox(height: 8),

        const Text("Key Services & Details:",
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        const SizedBox(height: 8),
        const Text("Gynecological Care: Services related to women's health, including treatment of gynecological cancers (cervical, ovarian, uterine)."),
         const SizedBox(height: 8),
        const Text("Maternity and Antenatal: Dedicated Maternity and Antenatal/Family Planning department."),
        const SizedBox(height: 8),
        const Text("Availability: Services are available for appointments, with 24/7 support mentioned in their pricing/services information."),
        const SizedBox(height: 8),
        const Text("Contact Info:",
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        const SizedBox(height: 8),
        const Text(" Phone: +256 778 717619"),
        const SizedBox(height: 8),
        const Text(" Alternative: +256 772 727772"),
        const SizedBox(height: 8),
        const Text(" Address: Kibikura cell, Kabale, Uganda"),
        const SizedBox(height: 8),

        const Text(
          "It is recommended to call ahead to confirm the specific schedule of the gynecologist.",
          style: TextStyle(fontStyle: FontStyle.italic),
        ),
        const SizedBox(height: 16),

        InkWell(
          onTap: () async {
            final uri = Uri.parse("https://rugaramahospital.org/");
            if (await canLaunchUrl(uri)) {
              await launchUrl(uri, mode: LaunchMode.externalApplication);
            }
          },
          child: const Text(
            "Website: Rugarama Hospital",
            style: TextStyle(color: Colors.blue, decoration: TextDecoration.underline),
          ),
        ),
      ],
    ),
  );
}
}


class WomensHealthPage extends StatelessWidget {
  const WomensHealthPage({super.key});

  Future<void> _openLink() async {
    final uri = Uri.parse("https://www.womenshealthmag.com/");
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Women's Health")),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              "Click to open Women's Health Website",
              style: TextStyle(fontSize: 18),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: _openLink,
              style: ElevatedButton.styleFrom(backgroundColor: Colors.pinkAccent),
              child: const Text("Open Women's Health Website"),
            ),
          ],
        ),
      ),
    );
  }
}

  Widget _buildSettingsOption(
      BuildContext context, String title, String description, IconData icon, Widget page) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      child: ListTile(
        leading: Icon(icon, color: Colors.pinkAccent),
        title: Text(title,
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        subtitle: Text(description),
        trailing: const Icon(Icons.arrow_forward_ios, size: 16, color: Colors.grey),
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => page),
          );
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return ListView(
      children: [
        const Padding(
          padding: EdgeInsets.all(16.0),
          child: Text(
            "Settings",
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
        ),
        _buildSettingsOption(
          context,
          "Privacy & Security",
          "Manage your data and privacy settings",
          Icons.lock,
          const PrivacySecurityPage(),
        ),
        _buildSettingsOption(
          context,
          "Notifications",
          "Set reminders for your cycle",
          Icons.notifications,
          const NotificationsPage(),
        ),
        _buildSettingsOption(
          context,
          "Help & Support",
          "Get help and contact support",
          Icons.help,
          const HelpSupportPage(),
        ),
        _buildSettingsOption(
          context,
          "Log Out",
          "Log out of the application",
          Icons.exit_to_app,
          const LogoutPage(),
        ),
      ],
    );
  }


// ---------------- SETTINGS PAGE ----------------
class SettingsPage extends StatelessWidget {
  const SettingsPage({super.key});

  Widget _buildSettingsCard(BuildContext context, String title, String description, IconData icon, Widget page) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      child: ListTile(
        leading: Icon(icon, color: Colors.pinkAccent),
        title: Text(title,
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        subtitle: Text(description),
        trailing: const Icon(Icons.arrow_forward_ios, color: Colors.grey),
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => page),
          );
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Settings")),
      body: ListView(
        children: [
          const Padding(
            padding: EdgeInsets.all(16.0),
            child: Text(
              "Settings",
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
          ),

          _buildSettingsCard(
            context,
            "Privacy & Security",
            "Manage biometric lock, data sharing, and export options",
            Icons.lock,
            const PrivacySecurityPage(),
          ),
          _buildSettingsCard(
            context,
            "Notifications",
            "Customize reminders for cycles, fertile windows, and daily logs",
            Icons.notifications,
            const NotificationsPage(),
          ),
          _buildSettingsCard(
            context,
            "Help & Support",
            "FAQs, contact support, and trusted health resources",
            Icons.help,
            const HelpSupportPage(),
          ),
          _buildSettingsCard(
            context,
            "Community Forum",
            "Join discussions and connect with others",
            Icons.forum,
            const CommunityForumPage(),
          ),
          _buildSettingsCard(
            context,
            "Log Out",
            "Sign out of the app securely",
            Icons.exit_to_app,
            const LogoutPage(),
          ),
        ],
      ),
    );
  }
}


// ---------------- PRIVACY & SECURITY PAGE ----------------
class PrivacySecurityPage extends StatefulWidget {
  const PrivacySecurityPage({super.key});
  @override
  _PrivacySecurityPageState createState() => _PrivacySecurityPageState();
}

class _PrivacySecurityPageState extends State<PrivacySecurityPage> {
  bool biometricLock = false;
  bool showCycleOnLockscreen = false;
  bool anonymousDataSharing = false;

  void _saveSettings() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("Privacy & Security settings saved")),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Privacy & Security")),
      body: ListView(
        children: [
          SwitchListTile(
            title: const Text("Biometric Lock"),
            subtitle: const Text("Require fingerprint or face ID to open app"),
            value: biometricLock,
            activeThumbColor: Colors.pinkAccent,
            onChanged: (val) => setState(() => biometricLock = val),
          ),
          SwitchListTile(
            title: const Text("Show Cycle on Lockscreen"),
            subtitle: const Text("Display cycle info in notifications"),
            value: showCycleOnLockscreen,
            activeThumbColor: Colors.pinkAccent,
            onChanged: (val) => setState(() => showCycleOnLockscreen = val),
          ),
          SwitchListTile(
            title: const Text("Anonymous Data Sharing"),
            subtitle: const Text("Help improve the app with anonymous usage data"),
            value: anonymousDataSharing,
            activeThumbColor: Colors.pinkAccent,
            onChanged: (val) => setState(() => anonymousDataSharing = val),
          ),
          ListTile(
            leading: const Icon(Icons.download, color: Colors.pinkAccent),
            title: const Text("Export My Data"),
            subtitle: const Text("Download all your cycle data"),
            trailing: ElevatedButton(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text("Exporting cycle data...")),
                );
              },
              style: ElevatedButton.styleFrom(backgroundColor: Colors.pinkAccent),
              child: const Text("Export"),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: ElevatedButton(
              onPressed: _saveSettings,
              style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.pinkAccent,
                  minimumSize: const Size.fromHeight(48)),
              child: const Text("Save Settings"),
            ),
          ),
        ],
      ),
    );
  }
}

// ---------------- NOTIFICATIONS PAGE ----------------
class NotificationsPage extends StatefulWidget {
  const NotificationsPage({super.key});
  @override
  _NotificationsPageState createState() => _NotificationsPageState();
}

class _NotificationsPageState extends State<NotificationsPage> {
  bool periodStartReminder = true;
  int notifyDaysBefore = 2;
  bool fertileWindowAlert = true;
  bool ovulationDayReminder = false;
  bool dailyLogReminder = false;

  void _saveSettings() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("Notification settings saved")),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Notifications")),
      body: ListView(
        children: [
          SwitchListTile(
            title: const Text("Period Start Reminder"),
            subtitle: const Text("Get notified before your period"),
            value: periodStartReminder,
            activeThumbColor: Colors.pinkAccent,
            onChanged: (val) => setState(() => periodStartReminder = val),
          ),
          if (periodStartReminder)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Row(
                children: [
                  const Text("Notify me: "),
                  DropdownButton<int>(
                    value: notifyDaysBefore,
                    items: const [
                      DropdownMenuItem(value: 1, child: Text("1 day before")),
                      DropdownMenuItem(value: 2, child: Text("2 days before")),
                      DropdownMenuItem(value: 3, child: Text("3 days before")),
                    ],
                    onChanged: (val) {
                      if (val != null) setState(() => notifyDaysBefore = val);
                    },
                  ),
                ],
              ),
            ),
          SwitchListTile(
            title: const Text("Fertile Window Alert"),
            subtitle: const Text("Get notified during fertile days"),
            value: fertileWindowAlert,
            activeThumbColor: Colors.pinkAccent,
            onChanged: (val) => setState(() => fertileWindowAlert = val),
          ),
          SwitchListTile(
            title: const Text("Ovulation Day Reminder"),
            subtitle: const Text("Get notified on your ovulation day"),
            value: ovulationDayReminder,
            activeThumbColor: Colors.pinkAccent,
            onChanged: (val) => setState(() => ovulationDayReminder = val),
          ),
          SwitchListTile(
            title: const Text("Daily Log Reminder"),
            subtitle: const Text("Remind me to log my symptoms"),
            value: dailyLogReminder,
            activeThumbColor: Colors.pinkAccent,
            onChanged: (val) => setState(() => dailyLogReminder = val),
          ),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: ElevatedButton(
              onPressed: _saveSettings,
              style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.pinkAccent,
                  minimumSize: const Size.fromHeight(48)),
              child: const Text("Save Settings"),
            ),
          ),
        ],
      ),
    );
  }
}



// ---------------- HELP & SUPPORT PAGE ----------------
class HelpSupportPage extends StatelessWidget {
  const HelpSupportPage({super.key});

  Widget _buildSupportCard(
      BuildContext context, String title, String description, IconData icon,
      {VoidCallback? action}) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      child: ListTile(
        leading: Icon(icon, color: Colors.pinkAccent),
        title: Text(title,
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        subtitle: Text(description),
        trailing: const Icon(Icons.arrow_forward_ios, size: 16, color: Colors.grey),
        onTap: () {
          if (action != null) action();
        },
      ),
    );
  }

  void _openChatBot(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const ChatBotPage()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Help & Support")),
      body: ListView(
        children: [
          const Padding(
            padding: EdgeInsets.all(16.0),
            child: Text(
              "Help & Support",
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
          ),

          _buildSupportCard(
            context,
            "Frequently Asked Questions",
            "Learn how to log your period, edit entries, and manage reminders.",
            Icons.question_answer,
            action: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const FaqPage()),
            ),
          ),

          _buildSupportCard(
            context,
            "Contact Support",
            "Reach out to our team for help.",
            Icons.support_agent,
            action: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const ContactSupportPage()),
            ),
          ),

          _buildSupportCard(
            context,
            "Trusted Health Resources",
            "Access reliable menstrual health information.",
            Icons.health_and_safety,
            action: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const HealthResourcesPage()),
            ),
          ),

          _buildSupportCard(
            context,
            "Community Forum & Live Chat",
            "Join discussions or chat with our bot.",
            Icons.people,
            action: () => _openChatBot(context),
          ),

          const Padding(
            padding: EdgeInsets.all(16.0),
            child: Text(
              "Encouraging Notes",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
          ),

          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
            child: Text(
              "\"You are not alone — menstrual health is part of overall well‑being.\"",
              style: TextStyle(fontStyle: FontStyle.italic, color: Colors.grey),
            ),
          ),
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
            child: Text(
              "\"Tracking your cycle empowers you to understand your body better.\"",
              style: TextStyle(fontStyle: FontStyle.italic, color: Colors.grey),
            ),
          ),
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
            child: Text(
              "\"Seeking help is a sign of strength — never hesitate to reach out.\"",
              style: TextStyle(fontStyle: FontStyle.italic, color: Colors.grey),
            ),
          ),
        ],
      ),
    );
  }
}

// ---------------- FAQ PAGE ----------------
class FaqPage extends StatelessWidget {
  const FaqPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Frequently Asked Questions")),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          ListTile(
            title: Text("How do I log my period?"),
            subtitle: Text("Go to the Status page, tap 'Enter Period Start Date', and select your start date."),
          ),
          ListTile(
            title: Text("Can I edit past cycle entries?"),
            subtitle: Text("Currently, you can only set a new start date. Editing past entries is not supported. You can set new entries at the start date of the new period."),
          ),
          ListTile(
            title: Text("How do reminders work?"),
            subtitle: Text("Enable notifications in Settings → Notifications to get alerts before your period or fertile window."),
          ),
        ],
      ),
    );
  }
}

// ---------------- CONTACT SUPPORT PAGE ----------------
class ContactSupportPage extends StatelessWidget {
  const ContactSupportPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Contact Support")),
      body: const Center(
        child: Text("Email us at: derickiraguha96@gmail.com"),
      ),
    );
  }
}

// ---------------- HEALTH RESOURCES PAGE ----------------
class HealthResourcesPage extends StatelessWidget {
  const HealthResourcesPage({super.key});

  Future<void> _openLink(String url) async {
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Trusted Menstrual Health Resources")),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // WHO Card
          Card(
            elevation: 4,
            child: ListTile(
              leading: const Icon(Icons.public, color: Colors.blue),
              title: const Text("World Health Organization (WHO)"),
              subtitle: const Text("Statement on menstrual health and rights"),
              onTap: () => _openLink(
                  "https://www.who.int/news/item/22-06-2022-who-statement-on-menstrual-health-and-rights"),
            ),
          ),

          // UNICEF ExpansionTile
          ExpansionTile(
            leading: const Icon(Icons.child_care, color: Colors.orange),
            title: const Text("UNICEF"),
            children: [
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: Text(
                  "Guidance on menstrual health and hygiene, addressing stigma and access to resources.",
                  style: const TextStyle(color: Colors.black87),
                ),
              ),
              TextButton(
                onPressed: () => _openLink(
                    "https://www.unicef.org/wash/menstrual-hygiene"),
                child: const Text("Visit UNICEF Resource"),
              ),
            ],
          ),

          // Chips for quick access
          Wrap(
            spacing: 8,
            children: [
              ActionChip(
                label: const Text("CDC"),
                avatar: const Icon(Icons.local_hospital, color: Colors.red),
                onPressed: () => _openLink(
                    "https://www.cdc.gov/wash/healthy-habits/menstrual-hygiene.html"),
              ),
              ActionChip(
                label: const Text("Office on Women’s Health"),
                avatar: const Icon(Icons.favorite, color: Colors.pink),
                onPressed: () => _openLink(
                    "https://www.womenshealth.gov/menstrual-cycle"),
              ),
              ActionChip(
                label: const Text("NIH"),
                avatar: const Icon(Icons.science, color: Colors.green),
                onPressed: () => _openLink(
                    "https://www.nichd.nih.gov/health/topics/menstruation"),
              ),
            ],
          ),

          const SizedBox(height: 16),

          // Plan International styled container
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.purple.shade50,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.purple.shade200),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text("Plan International",
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                const SizedBox(height: 8),
                const Text(
                    "Global advocacy to end period poverty and stigma, supporting menstrual health."),
                Align(
                  alignment: Alignment.centerRight,
                  child: TextButton(
                    onPressed: () => _openLink(
                        "https://plan-international.org/sexual-health/menstruation"),
                    child: const Text("Learn More"),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 16),

          // Menstrual Health Hub button
          ElevatedButton.icon(
            icon: const Icon(Icons.hub),
            label: const Text("Global Menstrual Health Hub"),
            onPressed: () => _openLink(
                "https://menstrualhealthhub.org"),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.teal,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 20),
            ),
          ),
        ],
      ),
    );
  }
}

// ---------------- COMMUNITY FORUM PAGE ----------------
class CommunityForumPage extends StatelessWidget {
  const CommunityForumPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Community Forum")),
      body: const Center(
        child: Text("Community discussions coming soon!"),
      ),
    );
  }
}

// ---------------- CHATBOT PAGE ----------------

class ChatBotPage extends StatefulWidget {
  const ChatBotPage({super.key});

  @override
  _ChatBotPageState createState() => _ChatBotPageState();
}

class _ChatBotPageState extends State<ChatBotPage> {
  final List<String> _messages = ["Bot: Hello! How can I support you today?"];
  final TextEditingController _controller = TextEditingController();

  // Gemini API key (⚠️ store securely in production!)
  final String apiKey = "AIzaSyDoW-S4yDvQf5YNADds5_4aWgUvGCKjilc";

  Future<String> _getGeminiResponse(String userMessage) async {
    try {
      // ✅ Use the correct model endpoint
      final url = Uri.parse(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=$apiKey",
      );

      final response = await http.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "contents": [
            {
              "parts": [
                {"text": userMessage}
              ]
            }
          ]
        }),
      );

      // Debug print to see raw Gemini response in terminal
      print("Response body: ${response.body}");

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);

        if (data["candidates"] != null &&
            data["candidates"][0]["content"] != null &&
            data["candidates"][0]["content"]["parts"] != null &&
            data["candidates"][0]["content"]["parts"][0]["text"] != null) {
          return data["candidates"][0]["content"]["parts"][0]["text"];
        } else {
          return "Bot: Unexpected response format.";
        }
      } else {
        return "Bot: Sorry, I cannot help right now. (Error ${response.statusCode})";
      }
    } catch (e) {
      return "Bot: An error occurred: $e";
    }
  }

  void _sendMessage() async {
    final text = _controller.text.trim();
    if (text.isNotEmpty) {
      setState(() {
        _messages.add("You: $text");
        _messages.add("Bot: ...thinking...");
      });

      _controller.clear();

      final reply = await _getGeminiResponse(text);

      setState(() {
        _messages.removeLast(); // remove placeholder
        _messages.add("Bot: $reply");
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Community ChatBot")),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              itemCount: _messages.length,
              itemBuilder: (context, index) => ListTile(
                title: Text(_messages[index]),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _controller,
                    decoration: const InputDecoration(
                      hintText: "Type your message...",
                      border: OutlineInputBorder(),
                    ),
                    onSubmitted: (_) => _sendMessage(),
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.send, color: Colors.pinkAccent),
                  onPressed: _sendMessage,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
// ---------------- LOGOUT PAGE ----------------

class LogoutPage extends StatelessWidget {
  const LogoutPage({super.key});

  void _confirmLogout(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext ctx) {
        return AlertDialog(
          title: const Text("Confirm Logout"),
          content: const Text("Are you sure you want to log out?"),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(ctx).pop(); // close dialog
              },
              child: const Text("Cancel"),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.of(ctx).pop(); // close dialog
                _logout(context);
              },
              style: ElevatedButton.styleFrom(backgroundColor: Colors.pinkAccent),
              child: const Text("Log Out"),
            ),
          ],
        );
      },
    );
  }

  void _logout(BuildContext context) {
    // Navigate back to the login screen and clear navigation history
    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(builder: (context) => const LoginScreen()),
      (Route<dynamic> route) => false,
    );

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("You have been logged out")),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Log Out")),
      body: Center(
        child: ElevatedButton(
          onPressed: () => _confirmLogout(context),
          style: ElevatedButton.styleFrom(
              backgroundColor: Colors.pinkAccent,
              minimumSize: const Size.fromHeight(48)),
          child: const Text("Confirm Log Out"),
        ),
      ),
    );
  }
}

