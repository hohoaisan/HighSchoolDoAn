import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingMessage, ServerResponse } from 'http';
import withSession from 'libs/session';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import CookieBody from 'interfaces/CookieBody';
import UserType from 'enums/UserType';
import UserInfo from 'interfaces/UserInfo';

export default withSession(async function handler(req: any, res: NextApiResponse) {
  const cookie_user: CookieBody = req.session.get('user');
  if (!cookie_user) return res.status(200).json({ isLoggedIn: false, info: {} });

  let info: UserInfo | null = null;
  switch (cookie_user.type) {
    case UserType.GIAOVIEN: {
      const findUser = await prisma.giaoVien.findUnique({
        select: {
          maGiaoVien: true,
          tenGiaoVien: true,
          email: true,
          ChucNangGV: {
            select: {
              maChucNang: true,
            },
          },
        },
        where: {
          maGiaoVien: cookie_user.id,
        },
      });
      if (findUser == null) {
        return { isLoggedIn: false, info: {} };
      }
      info = {
        id: findUser?.maGiaoVien,
        name: findUser.tenGiaoVien,
        email: findUser.email,
        type: UserType.GIAOVIEN,
        roles: findUser.ChucNangGV.map((item) => item.maChucNang),
      };
    }
  }
  if (info) return res.status(200).json({ isLoggedIn: true, info });
});
