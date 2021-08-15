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
  const lastedNamHoc = (
    await prisma.namHoc.findMany({
      select: {
        maNamHoc: true,
      },
      take: 1,
      orderBy: {
        maNamHoc: 'desc',
      },
    })
  )[0].maNamHoc;

  const lop = await prisma.lopChuNhiem.findMany({
    select: {
      maLopChuNhiem: true,
      soLuong: true,
      GiaoVien: {
        select: {
          maGiaoVien: true,
          tenGiaoVien: true,
        },
      },
      Lop: {
        select: {
          maLop: true,
          tenLop: true,
        },
      },
      NamHoc: {
        select: {
          maNamHoc: true,
          tenNamHoc: true,
        },
      },
    },
    orderBy: {
      maNamHoc: 'desc',
    },
  });
  const lopChuNhiem = lop.map(({ maLopChuNhiem, soLuong, GiaoVien, Lop, NamHoc }) => ({
    maLopChuNhiem,
    soLuong,
    ...GiaoVien,
    ...Lop,
    ...NamHoc,
  }));
  res.status(200).json({ lastedNamHoc, lopChuNhiem });
});
