import { useEffect, useState } from "react";
import api from "../services/api";

export default function useWebsiteData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/website")
      .then((res) => {
        if (res.data && !res.data.message) {
          setData(res.data);
        }
      })
      .catch(() => {
        console.log("Admin data not found, using fallback data.");
      })
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}
