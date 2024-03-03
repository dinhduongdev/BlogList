"use client";
import TableData from "../components/Table";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Blogs = () => {
  const { data, error, isLoading } = useSWR(
    "http://localhost:8000/blogs",
    fetcher
  );

  if (error) return "An error has occurred.";
  if (isLoading) return "Loading...";
  return (
    <div>
      <TableData blogList={data} />
    </div>
  );
};

export default Blogs;
