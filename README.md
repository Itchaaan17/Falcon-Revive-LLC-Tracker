# Falcon Revive LLC Tracker

A branded workforce-management application for Falcon Revive LLC (automotive services, Dubai).

## Platforms and roles
- Employee: Android and iPhone app
- HR: Web dashboard plus Android and iPhone app
- CEO: Web dashboard plus Android and iPhone app
- Shared backend planned with Supabase and Google sign-in

## Initial scaffold
This repository starts with an Expo React Native application that can target iOS, Android, and web from one codebase.

## Run locally
```bash
npm install
npx expo start
```
Use the Expo QR code with Expo Go for a development preview. For web:
```bash
npx expo start --web
```

## Planned production modules
1. Supabase authentication and role-based access (employee, HR, CEO)
2. HR-controlled employee invitations
3. GPS geofence attendance (40 m around the verified shop coordinates)
4. Shift rules: 09:00–19:00, Monday off, earliest check-in 08:00
5. Late / missing attendance alerts and approved overtime
6. Leave requests and private employee documents
7. Push and email notifications

## Security and production notes
The current screen is a UI scaffold only. It does not yet authenticate users, save attendance, access GPS, or send notifications. Those features must be implemented with Supabase policies, server-side validation, and configured notification services before production use. Never commit Supabase service-role keys or other secrets to this repository.
