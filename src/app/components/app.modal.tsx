import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { mutate } from "swr";

interface Props {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  title?: string; // Thêm dấu ? để chỉ định là optional
  author?: string;
  content?: string;
  isUpdate?: boolean; // Thêm thuộc tính isUpdate
  id?: number;
}

function CreateModal(props: Props) {
  const { showModal, setShowModal, title, author, content, isUpdate } = props;
  const [modalTitle, setModalTitle] = useState<string>(
    isUpdate ? "Update Blog" : "Add New Blog"
  );
  const [modalButtonLabel, setModalButtonLabel] = useState<string>(
    isUpdate ? "Update" : "Add"
  );
  const [modalButtonVariant, setModalButtonVariant] = useState<string>(
    isUpdate ? "primary" : "success"
  );

  const [formData, setFormData] = useState<{
    title: string;
    author: string;
    content: string;
  }>({
    title: title || "",
    author: author || "",
    content: content || "",
  });

  useEffect(() => {
    setFormData({
      title: title || "",
      author: author || "",
      content: content || "",
    });
  }, [showModal]); // Reset form data when modal shows

  const handleClose = () => {
    setShowModal(false);
  };

  const handleSubmit = () => {
    const { title, author, content } = formData;
    if (!title || !author || !content) {
      toast.error("Please fill out all fields");
      return;
    }

    const apiUrl = isUpdate
      ? `http://localhost:8000/blogs/${props.id}`
      : "http://localhost:8000/blogs";
    const method = isUpdate ? "PUT" : "POST";

    try {
      fetch(apiUrl, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, author, content }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res) {
            toast.success(
              isUpdate ? "Blog updated successfully" : "Blog added successfully"
            );
            mutate("http://localhost:8000/blogs");
            handleClose();
          }
        });
    } catch (error) {
      toast.error("Failed!");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Modal show={showModal} onHide={handleClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              name="title"
              value={formData.title}
              type="text"
              placeholder="Enter title"
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Author</Form.Label>
            <Form.Control
              name="author"
              value={formData.author}
              type="text"
              placeholder="Enter author"
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Content</Form.Label>
            <Form.Control
              name="content"
              value={formData.content}
              as="textarea"
              rows={3}
              placeholder="Enter content"
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant={modalButtonVariant} onClick={handleSubmit}>
          {modalButtonLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CreateModal;
