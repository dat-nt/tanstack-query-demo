import "./PostsTable.css";

import { apiURL } from "../api/apiURL";
import AddPost from "./AddPost";
import React, { useState } from "react";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Post } from "../types/Post";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    Box,
    CircularProgress,
    Typography,
    IconButton,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditPost from "./EditPost";
import { postsQueryKey } from "../queryKeys/queryKeys";

const delay = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

const fetchPosts = async () => {
    const response = await axios.get(`${apiURL}/posts`);
    return response.data;
};

const deletePost = async (postId: number) => {
    const response = await axios.delete(`${apiURL}/posts/${postId}`);
    return response.data;
};

const PostsTable: React.FC = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [editingPost, setEditingPost] = useState<Post | null>(null);

    const queryClient = useQueryClient();

    const { data: posts = [], isLoading, isError, error } = useQuery<Post[]>({
        queryKey: postsQueryKey,
        queryFn: () => delay(1000).then(() => fetchPosts())
    });

    const startIndex = page * rowsPerPage;
    const endIndex = page * rowsPerPage + rowsPerPage;
    const currentPosts = posts.slice(startIndex, endIndex);

    const mutationDelete = useMutation({
        mutationFn: deletePost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: postsQueryKey });
            alert('Post deleted successfully!');
        },
    });

    const handleDelete = (postId: number) => {
        if (window.confirm('Are you sure to delete this post?')) {
            mutationDelete.mutate(postId);
        }
    };

    const handleEdit = (post: Post) => {
        setEditingPost(post);
    };

    const handleCloseEdit = () => {
        setEditingPost(null);
    };

    const handleChangePage = (
        _event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
        newPage: number
    ) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    if (isLoading) return (
        <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress size={20} />
            <Box component="h3" ml={2}>Loading...</Box>
        </Box>
    )

    if (isError) return (
        <Typography color="error">Error fetching posts: {error.message}</Typography>
    )

    return (
        <Paper>
            <Box p={2}>
                <AddPost />
            </Box>

            {editingPost && (
                <EditPost post={editingPost} onClose={handleCloseEdit} />
            )}

            <Typography variant="h4" align="center" sx={{ mb: 2 }}>Posts Table</Typography>
            <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell className="header-cell" >ID</TableCell>
                            <TableCell className="header-cell" sx={{ width: 60 }}>
                                User ID
                            </TableCell>
                            <TableCell className="header-cell">Title</TableCell>
                            <TableCell className="header-cell">Body</TableCell>
                            <TableCell className="header-cell">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentPosts.map((post) => (
                            <TableRow key={post.id} className="table-row">
                                <TableCell>{post.id}</TableCell>
                                <TableCell>{post.userId}</TableCell>
                                <TableCell>{post.title}</TableCell>
                                <TableCell>{post.body}</TableCell>
                                <TableCell sx={{ display: "flex", alignItems: "center" }}>
                                    <IconButton color="primary" onClick={() => handleEdit(post)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(post.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[5, 10, 20, { label: "All", value: posts.length }]}
                component="div"
                count={posts.length}
                rowsPerPage={rowsPerPage}
                page={page}
                showFirstButton
                showLastButton
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
};

export default PostsTable;
