import React from 'react';
import { Pagination as MuiPagination, Box, FormControl, Typography } from '@mui/material';
import GenericListbox, { SelectOption } from './GenericListbox';

interface PaginationProps {
  page: number;
  count: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  labelText?: string;
}

/**
 * 通用分页组件
 */
const Pagination: React.FC<PaginationProps> = ({
  page,
  count,
  limit,
  onPageChange,
  onLimitChange,
  labelText = '每页显示：',
}) => {
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    onPageChange(value);
  };

  // 分页大小选项
  const limitOptions: SelectOption[] = [
    { id: 10, label: '10' },
    { id: 20, label: '20' },
    { id: 50, label: '50' },
    { id: 100, label: '100' }
  ];

  // 当前选中的分页大小选项
  const selectedLimit = limitOptions.find(option => Number(option.id) === limit) || limitOptions[0];

  // 处理分页大小变更
  const handleLimitChange = (option: SelectOption | null) => {
    if (option) {
      onLimitChange(Number(option.id));
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: { xs: 'center', md: 'space-between' },
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        mt: 3,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ mr: 1 }}>
          {labelText}
        </Typography>
        <FormControl size="small">
          <GenericListbox
            options={limitOptions}
            value={selectedLimit}
            onChange={handleLimitChange}
            buttonClassName="!rounded-md !bg-white dark:!bg-gray-900 min-w-[80px] !h-8 !px-2"
            optionsClassName="min-w-[80px]"
            ariaLabel="每页显示数量"
          />
        </FormControl>
      </Box>
      
      <MuiPagination
        count={Math.ceil(count / limit)}
        page={page}
        onChange={handlePageChange}
        color="primary"
        showFirstButton
        showLastButton
        siblingCount={1}
      />
    </Box>
  );
};

export default Pagination; 