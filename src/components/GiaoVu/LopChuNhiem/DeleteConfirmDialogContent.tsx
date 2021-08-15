import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import DashboardGiaoVuLayout from 'components/layouts/DashboardGiaoVuLayout';
import {
  Typography,
  Container,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import useStyles from 'styles/Dashboard/common';
import {
  Save as SaveIcon,
  Replay as ReplayIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@material-ui/icons';
import { Alert, AlertTitle } from '@material-ui/lab';

import ProtectedPage from 'components/Auth/ProtectedPage';
import UserType from 'enums/UserType';
import TeacherRole from 'enums/TeacherRole';

import { AgGridColumn, AgGridReact } from 'ag-grid-react';

import useSWR, { mutate } from 'swr';
import axios from 'libs/axios';

import EKhoi from 'enums/EKhoi';

import { toast } from 'react-toastify';

import EditDialogContent from 'components/GiaoVu/LopChuNhiem/EditDialogContent';
import AddDialogContent from 'components/GiaoVu/LopChuNhiem/AddDialogContent';

const deleteLopChuNhiem = (maLopChuNhiem: number) => {
  return axios({
    method: 'post',
    url: `/api/giaovien/giaovu/lopchunhiem/${maLopChuNhiem}/delete`,
  });
};

const DeleteConfirmDialogContent: React.FC<{ setToggle: () => void; maLopChuNhiem: number }> = ({
  setToggle,
  maLopChuNhiem,
}) => {
  const handleDelete = async () => {
    if (maLopChuNhiem === 0 || Number.isNaN(maLopChuNhiem)) return;
    try {
      await deleteLopChuNhiem(maLopChuNhiem);
      toast.success('Đã xoá lớp chủ nhiệm');
      mutate('/api/giaovien/giaovu/lopchunhiem');
      setToggle();
    } catch (err) {
      toast.error('Có vấn đề khi xoá lớp chủ nhiệm, vui lòng kiểm tra lại hoặc xoá tất cả học sinh khỏi lớp này trước');
    }
  };
  return (
    <>
      <DialogTitle id="form-dialog-title">Xoá lớp chủ nhiệm</DialogTitle>
      <DialogContent>
        <DialogContentText>Bạn có muốn xoá lớp chủ nhiệm này không</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={setToggle} color="primary">
          Huỷ
        </Button>
        <Button onClick={handleDelete} color="primary">
          Chấp nhận
        </Button>
      </DialogActions>
    </>
  );
};

export default DeleteConfirmDialogContent;
