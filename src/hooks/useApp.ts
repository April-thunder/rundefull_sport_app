// src/hooks/useApp.js
import { useContext } from 'react';
import { AppContext } from '../context/context';

export function useApp() {
  return useContext(AppContext);
}