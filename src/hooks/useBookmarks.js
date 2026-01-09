import { useEffect, useState } from "react";
import { ref, set, remove, onValue } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { auth, database } from "../firebase/firebaseConfig";

export default function useBookmarks() {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    // Wait for auth to be ready
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setBookmarks([]);
        return;
      }

      const bookmarksRef = ref(database, `users/${user.uid}/bookmarks`);

      // Subscribe to realtime updates
      const unsubscribeDB = onValue(bookmarksRef, (snapshot) => {
        const data = snapshot.val();
        setBookmarks(data ? Object.keys(data).map(Number) : []);
      });

      // Cleanup DB listener when user changes
      return () => unsubscribeDB();
    });

    // Cleanup auth listener
    return () => unsubscribeAuth();
  }, []);

  const toggleBookmark = (studyId) => {
    const user = auth.currentUser;
    if (!user) return;

    const bookmarkRef = ref(
      database,
      `users/${user.uid}/bookmarks/${studyId}`
    );

    if (bookmarks.includes(studyId)) {
      remove(bookmarkRef);
    } else {
      set(bookmarkRef, true);
    }
  };

  return {
    bookmarks,
    toggleBookmark,
    count: bookmarks.length
  };
}
