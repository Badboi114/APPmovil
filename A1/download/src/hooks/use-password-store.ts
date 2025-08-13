'use client';

import { useState, useEffect, useCallback } from 'react';

export interface PasswordEntry {
  id: string;
  website: string;
  username: string;
  password: string;
}

const isBrowser = typeof window !== 'undefined';

export function usePasswordStore() {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isBrowser) {
      try {
        const storedPasswords = localStorage.getItem('passvault-passwords');
        if (storedPasswords) {
          setPasswords(JSON.parse(storedPasswords));
        }
      } catch (error) {
        console.error('Failed to load passwords from localStorage', error);
      }
      setIsLoaded(true);
    }
  }, []);

  const savePasswords = useCallback((newPasswords: PasswordEntry[]) => {
    if (isBrowser) {
      try {
        setPasswords(newPasswords);
        localStorage.setItem('passvault-passwords', JSON.stringify(newPasswords));
      } catch (error) {
        console.error('Failed to save passwords to localStorage', error);
      }
    }
  }, []);

  const addPassword = useCallback((newPassword: Omit<PasswordEntry, 'id'>) => {
    const entry = { ...newPassword, id: crypto.randomUUID() };
    const updatedPasswords = [...passwords, entry];
    savePasswords(updatedPasswords);
  }, [passwords, savePasswords]);
  
  const deletePassword = useCallback((id: string) => {
    const updatedPasswords = passwords.filter(p => p.id !== id);
    savePasswords(updatedPasswords);
  }, [passwords, savePasswords]);


  return { passwords, addPassword, deletePassword, isLoaded };
}
