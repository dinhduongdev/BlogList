"use client";
import useSWR, { Fetcher } from "swr";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Link from "next/link";

function page({ params }: { params: { id: string } }) {
  const fetcher: Fetcher<Blog, string> = (url: string) =>
    fetch(url).then((res) => res.json());
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data, error, isLoading } = useSWR(
    `http://localhost:8000/blogs/${params.id}`,
    fetcher
  );

  return (
    <>
      <Button className="btn btn-primary">
        <Link className="btn btn-primary" href={"/"}>
          Back to home
        </Link>
      </Button> 
      <Card>
        <Card.Body>
          <Card.Title>{data?.title}</Card.Title>
          <Card.Text>{data?.author}</Card.Text>
          <Card.Text>{data?.content}</Card.Text>
        </Card.Body>
      </Card>
    </>
  );
}

export default page;
