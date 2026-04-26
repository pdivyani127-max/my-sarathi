// import { db } from "./firebase";
// import {
//   ref,
//   set,
//   get,
//   push,
//   remove,
//   onValue,
//   off,
// } from "firebase/database";

// // ─────────────────────────────────────────
// // 👤 USERS
// // ─────────────────────────────────────────

// // Save a new user (called during registration)
// export async function saveUser(userData) {
//   const usersRef = ref(db, "users");
//   const newUserRef = push(usersRef); // auto-generates unique ID
//   await set(newUserRef, userData);
//   return newUserRef.key; // returns the generated ID
// }

// // Get all users (returns array)
// export async function getUsers() {
//   const snapshot = await get(ref(db, "users"));
//   if (!snapshot.exists()) return [];
//   const data = snapshot.val();
//   return Object.values(data); // convert object to array
// }

// // Find a user by username + password (for login)
// export async function findUser(username, password) {
//   const users = await getUsers();
//   return users.find(
//     (u) => u.username === username && u.password === password
//   ) || null;
// }

// // ─────────────────────────────────────────
// // 🛡️ ADMINS
// // ─────────────────────────────────────────

// // Save a new admin (called during admin registration)
// export async function saveAdmin(adminData) {
//   const adminsRef = ref(db, "admins");
//   const newAdminRef = push(adminsRef);
//   await set(newAdminRef, adminData);
//   return newAdminRef.key;
// }

// // Get all admins (returns array)
// export async function getAdmins() {
//   const snapshot = await get(ref(db, "admins"));
//   if (!snapshot.exists()) return [];
//   const data = snapshot.val();
//   return Object.values(data);
// }

// // Find an admin by username + password (for login)
// export async function findAdmin(username, password) {
//   const admins = await getAdmins();
//   return admins.find(
//     (a) => a.username === username && a.password === password
//   ) || null;
// }

// // ─────────────────────────────────────────
// // 🚨 ALERTS
// // ─────────────────────────────────────────

// // Send an alert (called from admin dashboard)
// export async function sendAlert(alertData) {
//   await set(ref(db, "alert"), alertData);
// }

// // Stop/remove the alert
// export async function stopAlert() {
//   await remove(ref(db, "alert"));
// }

// // Get current alert once
// export async function getAlert() {
//   const snapshot = await get(ref(db, "alert"));
//   if (!snapshot.exists()) return null;
//   return snapshot.val();
// }

// // Listen to alert changes in real-time (for user home page)
// // Returns an unsubscribe function — call it to stop listening
// export function listenToAlert(callback) {
//   const alertRef = ref(db, "alert");
//   onValue(alertRef, (snapshot) => {
//     if (snapshot.exists()) {
//       callback(snapshot.val());
//     } else {
//       callback(null);
//     }
//   });
//   // Return unsubscribe function
//   return () => off(alertRef);
// }

import { db } from "./firebase";
import { ref, set, get, push } from "firebase/database";

// ─── Save a new user ────────────────────────────────────────────────────────
export async function saveUser(userData) {
  const newRef = push(ref(db, "users"));
  await set(newRef, userData);
}

// ─── Get all users (returns array) ─────────────────────────────────────────
export async function getUsers() {
  const snapshot = await get(ref(db, "users"));
  if (!snapshot.exists()) return [];
  const data = snapshot.val();
  return Object.values(data);
}

// ─── Find a user by username + password ────────────────────────────────────
export async function findUser(username, password) {
  const users = await getUsers();
  return users.find(
    (u) => u.username === username && u.password === password
  ) || null;
}

// ─── Save a new admin ───────────────────────────────────────────────────────
export async function saveAdmin(adminData) {
  const newRef = push(ref(db, "admins"));
  await set(newRef, adminData);
}

// ─── Get all admins (returns array) ────────────────────────────────────────
export async function getAdmins() {
  const snapshot = await get(ref(db, "admins"));
  if (!snapshot.exists()) return [];
  const data = snapshot.val();
  return Object.values(data);
}

// ─── Find an admin by username + password ──────────────────────────────────
export async function findAdmin(username, password) {
  const admins = await getAdmins();
  return admins.find(
    (a) => a.username === username && a.password === password
  ) || null;
}
