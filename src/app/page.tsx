"use client";
import TableData from "./components/Table";
import useSWR from "swr";

 
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const { data, error, isLoading } = useSWR(
    "http://localhost:8000/blogs",
    fetcher
  );

  if (error) return "An error has occurred.";
  if (isLoading) return "Loading...";

  return (
    <>
      <TableData blogList={data} />
    </>
  );
}
