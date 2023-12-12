import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Card,
  CardHeader,
  CardMeta,
  Container,
  Form,
  Grid,
  Modal,
  TextArea,
} from "semantic-ui-react";

//modal logic
function exampleReducer(state, action) {
  switch (action.type) {
    case "close":
      return { open: false };
    case "open":
      return { open: true, size: action.size };
    case "hide":
      return { show: false };
    case "show":
      return { show: true, size: action.size };
    default:
      throw new Error("Unsupported action...");
  }
}

const Read = () => {
  // modal logic
  const [state, dispatch] = React.useReducer(exampleReducer, {
    open: false,
    size: undefined,
    show: false,
  });
  const { open, size } = state;
  const { show, setShow } = state;

  const [postId, setPostId] = useState(1);
  const [comments, setComments] = useState([]);
  const [name, SetName] = useState("");
  const [body, SetBody] = useState("");
  const [email, SetEmail] = useState("");
  const [id, SetId] = useState("");

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
      );
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const addComment = async () => {
    try {
      const response = await axios.post(
        `https://jsonplaceholder.typicode.com/posts/${postId}/comments`,
        {
          name: name,
          email: email,
          body: body,
          postId: postId,
          id: `${comments[comments.length - 1].id + 1}`,
        }
      );
      setComments([...comments, response.data]);
      SetBody("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const editComment = async () => {
    try {
      let response = await axios.put(
        `https://jsonplaceholder.typicode.com/comments/${id}`,
        {
          name: name,
          email: email,
          body: body,
        }
      );
      console.log("testing response", response);
      const updatedComments = comments.map((comment) =>
        comment.id === id ? { ...comment, content: body } : comment
      );
      setComments(updatedComments);
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await axios.delete(
        `https://jsonplaceholder.typicode.com/comments/${commentId}`
      );
      const updatedComments = comments.filter(
        (comment) => comment.id !== commentId
      );
      setComments(updatedComments);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <Container className="main">
      <h1 style={{ textAlign: "center", color: "whitesmoke" }}>
        Comments for Post {postId}
      </h1>
      <Button
        color="primary"
        style={{ margin: "20px" }}
        onClick={() => dispatch({ type: "show", size: "tiny" })}
      >
        Add
      </Button>
      <Grid columns={3} divided>
        {comments.map((comment, idx) => (
          <Grid.Column key={idx}>
            <Card style={{ backgoundColor: "somokiewhite", height: "100%" }}>
              <Card.Content>
                <CardHeader>{comment.name}</CardHeader>
                <CardMeta>
                  <span className="date">{comment.email}</span>
                </CardMeta>
                <Card.Description>
                  <strong style={{ fontStyle: "italic" }}>
                    {comment.body}
                  </strong>
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <p>Post ID: {comment.postId}</p>
              </Card.Content>
              <Card.Content extra>
                <Button
                  color="green"
                  onClick={() => {
                    SetName(comment.name);
                    SetBody(comment.body);
                    SetEmail(comment.email);
                    SetId(comment.id);
                    dispatch({ type: "open", size: "mini" });
                  }}
                >
                  Edit
                </Button>
                <Button onClick={() => deleteComment(comment.id)} color="red">
                  Delete
                </Button>
              </Card.Content>
            </Card>
          </Grid.Column>
        ))}

        {/* modal */}
        <Modal
          size={size}
          open={open}
          onClose={() => dispatch({ type: "close" })}
        >
          <Modal.Header>Edit comment</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Field>
                <label>Name</label>
                <input value={name} onChange={(e) => SetName(e.target.name)} />
              </Form.Field>
              <Form.Field>
                <label>email</label>
                <input
                  value={email}
                  onChange={(e) => SetEmail(e.target.email)}
                />
              </Form.Field>
              <Form.Field>
                <label>body</label>
                <TextArea
                  value={body}
                  onChange={(e) => SetBody(e.target.body)}
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button negative onClick={() => dispatch({ type: "close" })}>
              No
            </Button>
            <Button
              positive
              onClick={() => {
                editComment();
                dispatch({ type: "close" });
              }}
            >
              Yes
            </Button>
          </Modal.Actions>
        </Modal>
        {/* add modal */}
        <Modal
          size={size}
          open={show}
          onClose={() => dispatch({ type: "hide" })}
        >
          <Modal.Header>Add comment</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Field>
                <label>Name</label>
                <input value={name} onChange={(e) => SetName(e.target.name)} />
              </Form.Field>
              <Form.Field>
                <label>email</label>
                <input
                  value={email}
                  onChange={(e) => SetEmail(e.target.email)}
                />
              </Form.Field>
              <Form.Field>
                <label>body</label>
                <TextArea
                  value={body}
                  onChange={(e) => SetBody(e.target.body)}
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button negative onClick={() => dispatch({ type: "hide" })}>
              No
            </Button>
            <Button
              positive
              onClick={() => {
                addComment();
                dispatch({ type: "hide" });
              }}
            >
              Yes
            </Button>
          </Modal.Actions>
        </Modal>
        {/* Add modal */}
      </Grid>
    </Container>
  );
};

export default Read;
