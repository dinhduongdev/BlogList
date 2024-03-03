import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import CreateModal from "./app.modal";
import { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { mutate } from "swr";

interface Props {
  blogList: Blog[];
}

function TableData(props: Props) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null); // State to track the selected blog for editing

  const handleEditClick = (blog: Blog) => {
    setSelectedBlog(blog); // Set the selected blog for editing
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this blog?")) {
      try {
        fetch(`http://localhost:8000/blogs/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((res) => {
            if (res) {
              toast.success("Delete blog successfully");
              mutate("http://localhost:8000/blogs");
            }
          });
      } catch (error) {
        toast.error("Failed!");
      }
    }
  };

  return (
    <>
      <div className="d-flex p-5 justify-content-between">
        <h3>Table BLogs</h3>
        <Button variant="secondary" onClick={() => setShowModal(true)}>
          Add
        </Button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {props.blogList.map((blog) => (
            <tr key={blog.id}>
              <td>{blog.id}</td>
              <td>{blog.title}</td>
              <td>{blog.author}</td>
              <td>
                <Button variant="primary">
                  <Link className="btn btn-primary" href={`/Blogs/${blog.id}`}>
                    View
                  </Link>
                </Button>{" "}
                <Button variant="warning" onClick={() => handleEditClick(blog)}>
                  {" "}
                  {/* Pass the blog to handleEditClick */}
                  Edit
                </Button>{" "}
                <Button variant="danger" onClick={() => handleDelete(blog.id)}>
                  Delete
                </Button>{" "}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {selectedBlog && ( // Render modal only if a blog is selected
        <CreateModal
          showModal={showModal}
          setShowModal={setShowModal}
          title={selectedBlog.title.toString()}
          author={selectedBlog.author.toString()}
          content={selectedBlog.content.toString()}
          id={selectedBlog.id}
          isUpdate={true} // Set isUpdate to true for editing
        />
      )}
    </>
  );
}

export default TableData;
