import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { fetchJobs } from '@/redux/slices/jobsSlice';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  Stack,
  CircularProgress,
  Alert
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { SearchBar } from '@/components/common/SearchBar';

const JobsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { jobs, total, page, size, loading, error } = useAppSelector(state => state.jobs);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    handleSearch(searchTerm);
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    dispatch(fetchJobs({
      page: 1,
      limit: size,
      search: term
    }));
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    dispatch(fetchJobs({
      page: value,
      limit: size,
      search: searchTerm
    }));
  };

  const handleAddJob = () => {
    navigate('/jobs/new');
  };

  const handleViewJob = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Box mb={4}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1">职位列表</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddJob}
          >
            添加职位
          </Button>
        </Stack>
        <SearchBar onSearch={handleSearch} />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>职位名称</TableCell>
              <TableCell>公司</TableCell>
              <TableCell>地点</TableCell>
              <TableCell>类型</TableCell>
              <TableCell>薪资</TableCell>
              <TableCell>来源</TableCell>
              <TableCell>状态</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs?.map((job) => (
              <TableRow key={job._id} hover>
                <TableCell>{job.title}</TableCell>
                <TableCell>
                  {typeof job.company === 'string' ? job.company : job.company.name}
                </TableCell>
                <TableCell>{job.location || '-'}</TableCell>
                <TableCell>{job.jobType || '-'}</TableCell>
                <TableCell>{job.salary || '-'}</TableCell>
                <TableCell>{job.platform}</TableCell>
                <TableCell>{job.status}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleViewJob(job._id)}
                  >
                    查看
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {total > 0 && (
        <Box mt={2} display="flex" justifyContent="center">
          <Pagination
            count={Math.ceil(total / size)}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Container>
  );
};

export default JobsPage; 