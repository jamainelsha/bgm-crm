import React, { createContext, useContext, useState, useCallback } from "react";

export interface FieldChange {
  id: string;
  recordType: string; // "unit", "resident", "lead", etc.
  recordId: string;
  fieldName: string;
  fieldLabel: string;
  oldValue: string;
  newValue: string;
  changedBy: string; // user name
  changedAt: string; // ISO timestamp
}

interface FieldHistoryContextType {
  history: FieldChange[];
  getFieldHistory: (recordType: string, recordId: string, fieldName: string) => FieldChange[];
  recordChange: (change: Omit<FieldChange, "id" | "changedAt">) => void;
}

const FieldHistoryContext = createContext<FieldHistoryContextType | null>(null);

const STORAGE_KEY = "bgm_crm_field_history";

export function FieldHistoryProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<FieldChange[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return [];
  });

  const recordChange = useCallback((change: Omit<FieldChange, "id" | "changedAt">) => {
    const entry: FieldChange = {
      ...change,
      id: `fh-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      changedAt: new Date().toISOString(),
    };
    setHistory((prev) => {
      const updated = [entry, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getFieldHistory = useCallback(
    (recordType: string, recordId: string, fieldName: string) => {
      return history.filter(
        (h) =>
          h.recordType === recordType &&
          h.recordId === recordId &&
          h.fieldName === fieldName
      );
    },
    [history]
  );

  return (
    <FieldHistoryContext.Provider value={{ history, getFieldHistory, recordChange }}>
      {children}
    </FieldHistoryContext.Provider>
  );
}

export function useFieldHistory() {
  const ctx = useContext(FieldHistoryContext);
  if (!ctx) throw new Error("useFieldHistory must be used within FieldHistoryProvider");
  return ctx;
}
