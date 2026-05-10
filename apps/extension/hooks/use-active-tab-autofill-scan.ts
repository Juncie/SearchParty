import {
  useCallback,
  useEffect,
  useState,
} from "react";

import type { ScannedAutofillFieldPayload } from "@searchparty/shared";
import { scanActiveTab } from "@/lib/autofill-active-tab";

export function useActiveTabAutofillScan() {
  const [fields, setFields] = useState<
    ScannedAutofillFieldPayload[]
  >([]);
  const [scanError, setScanError] = useState<string | null>(
    null,
  );
  const [scanBusy, setScanBusy] = useState(false);

  const refresh = useCallback(
    async (
      mode: "cached" | "refresh",
    ): Promise<ScannedAutofillFieldPayload[]> => {
      setScanBusy(true);
      setScanError(null);
      const res = await scanActiveTab(mode);
      if (!res.ok) {
        setScanError(res.error);
        setFields([]);
        setScanBusy(false);
        return [];
      }
      setFields(res.fields);
      setScanBusy(false);
      return res.fields;
    },
    [],
  );

  useEffect(() => {
    void refresh("cached");
  }, [refresh]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        void refresh("cached");
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener(
        "visibilitychange",
        onVisibility,
      );
    };
  }, [refresh]);

  return {
    fields,
    scanError,
    scanBusy,
    refreshScan: refresh,
  };
}
