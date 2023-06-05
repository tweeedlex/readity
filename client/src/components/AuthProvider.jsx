import { useEffect } from "react";
import { getAuth } from "firebase/auth";
import { app } from "../firebase";
import authStore from "../store/authStore";
import { observer } from "mobx-react-lite";

export const AuthProvider = observer(() => {
  const auth = getAuth(app);
  authStore.setAuth(auth);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((userCandidate) => {
      if (userCandidate !== null) {
        return authStore.setUser(userCandidate);
      }
    });

    return unsubscribe;
  }, []);
});
