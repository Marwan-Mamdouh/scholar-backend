import { useEffect, useState } from "react";
import { api, ApiError, type ApiResponse } from "@/src/lib/api-client";

export function useCatalogDetail<T>(id: string, path: string) {
  const [retry, setRetry] = useState(0);
  const key = `${path}/${id}:${retry}`;
  const invalidId =
    !/^[1-9]\d*$/.test(id) ||
    !Number.isSafeInteger(Number(id)) ||
    Number(id) > 2_147_483_647;
  const [result, setResult] = useState<{
    key: string;
    data?: T;
    error?: string;
    notFound?: boolean;
  }>();

  useEffect(() => {
    if (invalidId) return;
    const controller = new AbortController();
    api.get<ApiResponse<T>>(`${path}/${encodeURIComponent(id)}`, {
      signal: controller.signal,
    })
      .then(({ data: { data } }) => {
        if (!controller.signal.aborted) setResult({ key, data });
      })
      .catch((cause: unknown) => {
        if (!controller.signal.aborted)
          setResult({
            key,
            error:
              cause instanceof Error
                ? cause.message
                : "Could not load this record.",
            notFound: cause instanceof ApiError && cause.status === 404,
          });
      });
    return () => controller.abort();
  }, [id, path, key, invalidId]);

  return {
    data: result?.key === key ? result.data : undefined,
    loading: !invalidId && result?.key !== key,
    error: result?.key === key ? result.error : undefined,
    notFound: invalidId || (result?.key === key && !!result.notFound),
    reload: () => setRetry((value) => value + 1),
  };
}
