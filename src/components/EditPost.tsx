import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Post } from "../types/Post";
import axios from "axios";
import { apiURL } from "../api/apiURL";
import { postsQueryKey } from "../queryKeys/queryKeys";

const updatePost = async (updatedPost: Post) => {
    const response = await axios.put(`${apiURL}/posts/${updatedPost.id}`, updatedPost);
    return response.data;
};

interface EditPostFormProps {
    post: Post;
    onClose: () => void;
}

const EditPost: React.FC<EditPostFormProps> = ({ post, onClose }) => {
    const [userId, setUserId] = useState(post.userId);
    const [title, setTitle] = useState(post.title);
    const [body, setBody] = useState(post.body);

    const queryClient = useQueryClient();

    useEffect(() => {
        setUserId(post.userId);
        setTitle(post.title);
        setBody(post.body);
    }, [post]);

    const mutation = useMutation({
        mutationFn: updatePost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: postsQueryKey });
            onClose();
            alert('Post updated successfully!');
        },
    });

    const handleSave = () => {
        mutation.mutate({ ...post, userId, title, body });
    };

    return (
        <Box sx={{ padding: 2, gap: 2, mb: 4 }}>
            <Typography variant="h6">Edit Post</Typography>
            <TextField
                label="User ID"
                value={userId}
                onChange={(e) => setUserId(Number(e.target.value))}
                type="number"
                fullWidth
                margin="normal"
            />
            <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                fullWidth
                margin="normal"
                sx={{ mb: 2 }}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={mutation.isPending}
            >
                {mutation.isPending ? "Saving..." : "Save"}
            </Button>
            <Button variant="outlined" color="warning" onClick={onClose} sx={{ ml: 2 }}>
                Cancel
            </Button>
            {mutation.isError && (
                <Typography color="error">
                    Error: {mutation.error.message}
                </Typography>
            )}
        </Box>
    );
};

export default EditPost;
