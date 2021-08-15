import React, { useEffect, useState, useCallback, useMemo, forwardRef, useRef, useImperativeHandle } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import DashboardGiaoVienChuNhiemLayout from 'components/layouts/DashboardGiaoVienChuNhiemLayout';
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
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Save as SaveIcon, Replay as ReplayIcon } from '@material-ui/icons';
import useStyles from 'styles/Dashboard/common';

import ProtectedPage from 'components/Auth/ProtectedPage';
import UserType from 'enums/UserType';

import useSWR from 'swr';
import axios from 'libs/axios';

import { AgGridColumn, AgGridReact } from 'ag-grid-react';

import { toast } from 'react-toastify';

interface NamHoc {
  maNamHoc: number;
  tenNamHoc: string;
}

interface LopChuNhiem {
  maGiaoVien: number;
  maLopChuNhiem: number;
  maNamHoc: number;
  Lop: {
    maLop: number;
    tenLop: string;
  };
}

interface TableRow {
  maLopChuNhiem: number;
  maHocSinh: number;
  tenHocSinh: string;
  nangLuc: string | null;
  phamChat: string | null;
  nhanXetKi1: string | null;
  nhanXetKi2: string | null;
  lenLop: boolean;
}

const fetchStudent = (lopchunhiem: number | string) =>
  axios({
    url: `/api/giaovien/gvcn/lopchunhiem/${lopchunhiem}`,
  });

const editHocBa = ({ maLopChuNhiem, maHocSinh, nhanXetKi1, nhanXetKi2, nangLuc, phamChat, lenLop }: TableRow) => {
  axios({
    method: 'post',
    url: `/api/giaovien/gvcn/lopchunhiem/${maLopChuNhiem}/${maHocSinh}`,
    data: { maHocSinh, nhanXetKi1, nhanXetKi2, nangLuc, phamChat, lenLop },
  });
};

const BtnCellRenderer: React.FC<{ data: TableRow }> = ({ data }) => {
  const handleButtonClick = useCallback(async () => {
    try {
      await editHocBa(data);
      toast.success(`Đã lưu học bạ của học sinh ${data.maHocSinh} - ${data.tenHocSinh}`);
    } catch (err) {
      toast.error(`Có lỗi xảy ra khi lưu ${data.maHocSinh} - ${data.tenHocSinh}`);
      console.log(err);
    }
  }, [data]);
  return (
    <IconButton size="small" onClick={handleButtonClick}>
      <SaveIcon />
    </IconButton>
  );
};

const CheckBoxLenLopShow: React.FC<any> = ({ value }) => {
  return <Checkbox checked={value as boolean} color="primary" />;
};

const CheckBoxLenLopEdit: React.FC = React.forwardRef((props: any, ref) => {
  const [value, setValue] = useState(props.value as boolean);
  const refInput = useRef(null);

  useEffect(() => {
    // focus on the input
    // setTimeout(() => refInput?.current?.focus());
  }, []);

  /* Component Editor Lifecycle methods */
  useImperativeHandle(ref, () => {
    return {
      // the final value to send to the grid, on completion of editing
      getValue() {
        // this simple editor doubles any value entered into the input
        return value;
      },

      // Gets called once before editing starts, to give editor a chance to
      // cancel the editing before it even starts.
      isCancelBeforeStart() {
        return false;
      },

      // Gets called once when editing is finished (eg if Enter is pressed).
      // If you return true, then the result of the edit will be ignored.
      isCancelAfterEnd() {
        // our editor will reject any value greater than 1000
        return false;
      },
    };
  });
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.checked);
  };
  return <Checkbox ref={refInput} checked={value} color="primary" onChange={handleChange} />;
});

CheckBoxLenLopEdit.displayName = 'CheckBoxLenLop';

const Content: React.FC = () => {
  const classes = useStyles();
  const { data, error, mutate } = useSWR<{ namHoc: NamHoc[]; lopChuNhiem: LopChuNhiem[] }>(
    '/api/giaovien/gvcn/lopchunhiem',
    {
      revalidateOnMount: true,
    },
  );
  const [namHoc, setNamHoc] = useState<number>(0);
  const [listNamHoc, setListNamHoc] = useState<NamHoc[]>([]);
  const [lopchunhiem, setLopchunhiem] = useState<number>(0);
  const [listLopChuNhiem, setListLopChuNhiem] = useState<LopChuNhiem[]>([]);
  const [listHocSinh, setListHocSinh] = useState<TableRow[]>([]);
  const [editable, setEditable] = useState<boolean>(false);
  useEffect(() => {
    if (!!data && !error) {
      setListNamHoc(data.namHoc);
      let namhoc = data.namHoc[0] && data.namHoc[0].maNamHoc;
      namhoc = namhoc || 0;
      setNamHoc(namhoc);
    }
  }, [data, error]);
  useEffect(() => {
    if (!!data && !error) {
      const list = data.lopChuNhiem.filter(({ maLopChuNhiem, maNamHoc }) => maNamHoc === namHoc);
      let lop = list[0] && list[0].maLopChuNhiem;
      lop = lop || 0;
      let nam = data.namHoc[0] && data.namHoc[0].maNamHoc;
      setEditable(namHoc === nam);
      setListHocSinh([]);
      setListLopChuNhiem(list);
      setLopchunhiem(lop);
    }
  }, [namHoc]);
  const loadHocSinh = useCallback(() => {
    setListHocSinh([]);
    if (!!data && !error && lopchunhiem) {
      (async () => {
        const result = await fetchStudent(lopchunhiem).then((res) => res.data);
        setListHocSinh(result);
      })();
    }
  }, [data, error, lopchunhiem]);
  useEffect(() => {
    loadHocSinh();
  }, [lopchunhiem]);
  const columnDefs = useMemo(
    () => [
      { field: 'maHocSinh', headerName: 'Mã học sinh', width: 80, flex: 0 },
      { field: 'tenHocSinh', headerName: 'Tên học sinh', flex: 1 },
      { field: 'nhanXetKi1', headerName: 'Nhận xét kì 1', flex: 1, editable },
      { field: 'nhanXetKi2', headerName: 'Nhận xét kì 2', flex: 1, editable },
      { field: 'nangLuc', headerName: 'Năng lực', flex: 1, editable },
      { field: 'phamChat', headerName: 'Phẩm chất', flex: 1, editable },
      {
        field: 'lenLop',
        headerName: 'Lên lớp',
        flex: 1,
        editable,
        cellEditor: 'checkBoxLenLopEdit',
        cellRenderer: 'checkBoxLenLopShow',
      },
      {
        field: 'maHocSinh',
        headerName: 'Thao tác',
        width: 100,
        flex: 0,
        cellRenderer: 'btnCellRenderer',
        hide: !editable,
      },
    ],
    [editable],
  );
  if (error) {
    return <div>Có lỗi xảy ra vui lòng tải lại trang</div>;
  }
  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel>Chọn năm học</InputLabel>
          <Select
            placeholder="Chọn năm học"
            autoWidth
            value={namHoc}
            onChange={(event: React.ChangeEvent<{ value: unknown }>) =>
              setNamHoc(Number.parseInt(event.target.value as string))
            }
          >
            {listNamHoc &&
              listNamHoc.map(({ maNamHoc, tenNamHoc }, index) => (
                <MenuItem key={index} value={maNamHoc}>
                  {tenNamHoc}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel>Chọn lớp chủ nhiệm</InputLabel>
          <Select
            placeholder="Lớp chủ nhiệm"
            autoWidth
            value={lopchunhiem}
            onChange={(event: React.ChangeEvent<{ value: unknown }>) =>
              setLopchunhiem(Number.parseInt(event.target.value as string))
            }
          >
            {listLopChuNhiem &&
              listLopChuNhiem.map(({ maLopChuNhiem, maNamHoc, Lop }, index) => (
                <MenuItem key={index} value={maLopChuNhiem}>
                  {Lop.tenLop}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <Grid container justifyContent="space-between">
          <Grid item>
            <Typography align="left" variant="h6">
              Danh sách học sinh
            </Typography>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" startIcon={<ReplayIcon />} size="small" onClick={loadHocSinh}>
              Tải lại
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {listLopChuNhiem.length ? (
          <>
            {editable || (
              <div>
                <Alert severity="info">Học bạ của các năm học cũ hơn chỉ có thể xem</Alert>
              </div>
            )}
            <div style={{ flex: 1 }}>
              <div className="ag-theme-alpine">
                <AgGridReact
                  rowHeight={100}
                  rowData={listHocSinh}
                  domLayout="autoHeight"
                  columnDefs={columnDefs}
                  stopEditingWhenCellsLoseFocus={true}
                  defaultColDef={{
                    flex: 1,
                    wrapText: true,
                    autoHeight: true,
                    resizable: true,
                  }}
                  frameworkComponents={{
                    btnCellRenderer: BtnCellRenderer,
                    checkBoxLenLopShow: CheckBoxLenLopShow,
                    checkBoxLenLopEdit: CheckBoxLenLopEdit,
                  }}
                ></AgGridReact>
              </div>
            </div>
          </>
        ) : (
          <div>
            <Alert severity="info">Không chủ nhiệm lớp nào trong năm học này</Alert>
          </div>
        )}
      </Grid>
    </>
  );
};
export default function Index() {
  const classes = useStyles();
  return (
    <DashboardGiaoVienChuNhiemLayout title="Cập nhật học bạ học sinh">
      <ProtectedPage type={UserType.GIAOVIEN}>
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography align="center" variant="h5">
                      Cập nhật học bạ học sinh
                    </Typography>
                  </Grid>
                  <Content />
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </ProtectedPage>
    </DashboardGiaoVienChuNhiemLayout>
  );
}
