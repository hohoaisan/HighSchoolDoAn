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
      NamHoc: {
        select: {
          maNamHoc: true,
          tenNamHoc: true,
        },
      },
      Lop: {
        select: {
          maLop: true,
          tenLop: true,
        },
      },
      GiaoVien: {
        select: {
          maGiaoVien: true,
          tenGiaoVien: true,
        },
      },
      soLuong: true,
    },
    where: {
      maLopChuNhiem: lopChuNhiem,
    },
  });
  if (lop === null) return res.status(404).end();
  const hocSinh = (
    await prisma.hocBa.findMany({
      select: {
        HocSinh: {
          select: {
            maHocSinh: true,
            tenHocSinh: true,
            gioiTinh: true,
            ngaySinh: true,
          },
        },
      },
      where: {
        maLopChuNhiem: lopChuNhiem,
      },
    })
  ).map(({ HocSinh }) => ({ ...HocSinh }));
  return res.status(200).json({ lopChuNhiem: lop, hocSinh });
});
