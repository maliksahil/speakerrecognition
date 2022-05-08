import 'package:firebase_auth/firebase_auth.dart';
import 'package:rxdart/rxdart.dart';

class NureAppFirebaseUser {
  NureAppFirebaseUser(this.user);
  User user;
  bool get loggedIn => user != null;
}

NureAppFirebaseUser currentUser;
bool get loggedIn => currentUser?.loggedIn ?? false;
Stream<NureAppFirebaseUser> nureAppFirebaseUserStream() => FirebaseAuth.instance
    .authStateChanges()
    .debounce((user) => user == null && !loggedIn
        ? TimerStream(true, const Duration(seconds: 1))
        : Stream.value(user))
    .map<NureAppFirebaseUser>(
        (user) => currentUser = NureAppFirebaseUser(user));
