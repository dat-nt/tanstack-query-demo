import React, { useRef, useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Box,
    Button,
    TextField,
    Typography,
} from "@mui/material";

import { NewPost } from "../types/NewPost";

const addPost = async (newPost: NewPost) => {
    const response = await axios.post("https://jsonplaceholder.typicode.com/posts", newPost);
    return response.data;
};

const AddPost: React.FC = () => {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [userId, setUserId] = useState("");

    const queryClient = useQueryClient();
    const firstInputRef = useRef<HTMLInputElement>(null);

    const mutation = useMutation({
        mutationFn: addPost,

        // onSuccess: Callback được gọi khi mutation thành công
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });

            // Làm mới form thêm dữ liệu và focus vào dòng đầu của form
            setTitle("");
            setBody("");
            setUserId("");
            if (firstInputRef.current) {
                firstInputRef.current.focus();
            }

            alert(`Post added successfully: ${JSON.stringify(data)}`);
        },
    });

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        // Gửi dữ liệu newPost lên server
        mutation.mutate({
            title,
            body,
            userId: Number(userId),
        });
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}
        >
            <Typography variant="h6">Add New Post</Typography>
            <TextField
                label="User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                type="number"
                required
                inputRef={firstInputRef}
            />
            <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <TextField
                label="Body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
            />
            <Button variant="contained" color="primary" type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Adding..." : "Add Post"}
            </Button>
        </Box>
    );
};

export default AddPost;
