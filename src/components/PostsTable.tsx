import "./PostsTable.css";
import React, { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
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
} from "@mui/material";

const delay = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

const fetchPosts = async () => {
    const response = await axios.get("https://jsonplaceholder.typicode.com/posts");
    return response.data;
};

const PostsTable: React.FC = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const { data: posts = [], isLoading, isError, error } = useQuery<Post[]>({
        queryKey: ["posts"],
        queryFn: () => delay(1000).then(() => fetchPosts())
    });

    const startIndex = page * rowsPerPage;
    const endIndex = page * rowsPerPage + rowsPerPage;
    const currentPosts = posts.slice(startIndex, endIndex);

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
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentPosts.map((post) => (
                            <TableRow key={post.id} className="table-row">
                                <TableCell>{post.id}</TableCell>
                                <TableCell>{post.userId}</TableCell>
                                <TableCell>{post.title}</TableCell>
                                <TableCell>{post.body}</TableCell>
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
