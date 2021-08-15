import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingMessage, ServerResponse } from 'http';
import withSession from 'libs/withSession';

import prisma from 'db/prisma';

import CookieBody from 'interfaces/CookieBody';
import UserType from 'enums/UserType';

export default withSession(async function handler(req: any, res: NextApiResponse) {
  const cookie_user: CookieBody = req.session.get('user');
  if (!cookie_user) return res.status(403).end();
  if (cookie_user.type !== UserType.GIAOVIEN) return res.status(403).end();
  // const id = cookie_user.id;
  const lopChuNhiem: number = Number.parseInt(req.query.lop);
  const lop = await prisma.lopChuNhiem.findUnique({
    select: {
      maLopChuNhiem: true,
      Lop: {
        select: {
          khoi: true,
        },
      },
      NamHoc: {
        select: {
          maNamHoc: true,
        },
      },
    },
    where: {
      maLopChuNhiem: lopChuNhiem,
    },
  });
  if (lop === null) return res.status(404).end();
  const currentYear = lop.NamHoc?.maNamHoc;
  const khoi = lop.Lop?.khoi;
  const hocSinhChuaThemVaoLop =
    khoi === 10
      ? (
          await prisma.hocSinh.findMany({
            select: {
              maHocSinh: true,
              tenHocSinh: true,
              gioiTinh: true,
              ngaySinh: true,
            },
            where: {
              HocBa: {
                none: {},
              },
            },
          })
        ).map((hocsinh) => ({ ...hocsinh, type: 'Chưa thêm vào lớp nào' }))
      : [];
  const hocSinhChuaLenLop = (
    await prisma.hocSinh.findMany({
      select: {
        maHocSinh: true,
        tenHocSinh: true,
        gioiTinh: true,
        ngaySinh: true,
      },
      where: {
        HocBa: {
          some: {
            LopChuNhiem: {
              Lop: {
                khoi: khoi,
              },
              maNamHoc: {
                not: currentYear,
              },
            },
            lenLop: false,
          },
          none: {
            LopChuNhiem: {
              Lop: {
                khoi: khoi,
              },
              maNamHoc: currentYear,
            },
            lenLop: false,
          },
        },
      },
    })
  ).map((hocsinh) => ({ ...hocsinh, type: `Chưa lên lớp ${khoi}` }));
  const hocSinhDaLenLopThapHonNhungChuaXepVaoKhoiHienTai = (
    await prisma.hocSinh.findMany({
      select: {
        maHocSinh: true,
        tenHocSinh: true,
        gioiTinh: true,
        ngaySinh: true,
      },
      where: {
        HocBa: {
          some: {
            LopChuNhiem: {
              Lop: {
                khoi: khoi && khoi - 1,
              },
              maNamHoc: {
                not: currentYear,
              },
            },
            lenLop: true,
          },
          none: {
            LopChuNhiem: {
              Lop: {
                khoi: khoi,
              },
            },
          },
        },
      },
    })
  ).map((hocsinh) => ({ ...hocsinh, type: `Đã lên lớp ${khoi && khoi - 1}` }));
  return res
    .status(200)
    .json([...hocSinhChuaThemVaoLop, ...hocSinhChuaLenLop, ...hocSinhDaLenLopThapHonNhungChuaXepVaoKhoiHienTai]);
});
