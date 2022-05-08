import 'dart:async';

import 'index.dart';
import 'serializers.dart';
import 'package:built_value/built_value.dart';

part 'users_nure_record.g.dart';

abstract class UsersNureRecord
    implements Built<UsersNureRecord, UsersNureRecordBuilder> {
  static Serializer<UsersNureRecord> get serializer =>
      _$usersNureRecordSerializer;

  @nullable
  @BuiltValueField(wireName: 'UserName')
  String get userName;

  @nullable
  @BuiltValueField(wireName: 'EmailAddress')
  String get emailAddress;

  @nullable
  @BuiltValueField(wireName: 'Password')
  String get password;

  @nullable
  String get email;

  @nullable
  @BuiltValueField(wireName: 'display_name')
  String get displayName;

  @nullable
  @BuiltValueField(wireName: 'photo_url')
  String get photoUrl;

  @nullable
  String get uid;

  @nullable
  @BuiltValueField(wireName: 'created_time')
  DateTime get createdTime;

  @nullable
  @BuiltValueField(wireName: 'phone_number')
  String get phoneNumber;

  @nullable
  @BuiltValueField(wireName: kDocumentReferenceField)
  DocumentReference get reference;

  static void _initializeBuilder(UsersNureRecordBuilder builder) => builder
    ..userName = ''
    ..emailAddress = ''
    ..password = ''
    ..email = ''
    ..displayName = ''
    ..photoUrl = ''
    ..uid = ''
    ..phoneNumber = '';

  static CollectionReference get collection =>
      FirebaseFirestore.instance.collection('users_nure');

  static Stream<UsersNureRecord> getDocument(DocumentReference ref) => ref
      .snapshots()
      .map((s) => serializers.deserializeWith(serializer, serializedData(s)));

  static Future<UsersNureRecord> getDocumentOnce(DocumentReference ref) => ref
      .get()
      .then((s) => serializers.deserializeWith(serializer, serializedData(s)));

  UsersNureRecord._();
  factory UsersNureRecord([void Function(UsersNureRecordBuilder) updates]) =
      _$UsersNureRecord;

  static UsersNureRecord getDocumentFromData(
          Map<String, dynamic> data, DocumentReference reference) =>
      serializers.deserializeWith(serializer,
          {...mapFromFirestore(data), kDocumentReferenceField: reference});
}

Map<String, dynamic> createUsersNureRecordData({
  String userName,
  String emailAddress,
  String password,
  String email,
  String displayName,
  String photoUrl,
  String uid,
  DateTime createdTime,
  String phoneNumber,
}) =>
    serializers.toFirestore(
        UsersNureRecord.serializer,
        UsersNureRecord((u) => u
          ..userName = userName
          ..emailAddress = emailAddress
          ..password = password
          ..email = email
          ..displayName = displayName
          ..photoUrl = photoUrl
          ..uid = uid
          ..createdTime = createdTime
          ..phoneNumber = phoneNumber));
