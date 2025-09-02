// Example React component fetching data from backend API
import React, { useEffect, useState } from "react";

function DataFetcher() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5173") // your backend URL here
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  if (!data) return <div>Loading...</div>;

  return <div>Data from backend: {JSON.stringify(data)}</div>;
}

export default DataFetcher;
